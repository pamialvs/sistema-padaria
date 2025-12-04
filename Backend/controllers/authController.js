const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/colaboradorRepository");

// Em produção, mova isso para um arquivo .env
const SECRET = "chave_secreta_do_pao_dourado"; 

// --- CADASTRO UNIFICADO (User + Colaborador) ---
async function register(req, res) {
    // 1. Recebemos dados de Login (email/senha) E dados de Colaborador (username/cargo/telefone)
    const { username, email, password, cargo, telefone } = req.body;

    // 2. Validação dos campos obrigatórios
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios!" });
    }

    try {
        // 3. Verifica se o e-mail já existe no banco
        const userExists = await userRepo.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
        }

        // 4. Criptografa a senha (Segurança)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Envia para o repositório salvar TUDO junto
        await userRepo.createUser({
            username,
            email,
            password: hashedPassword,
            cargo: cargo || "Funcionário", // Se não enviar cargo, define padrão
            telefone: telefone || null
        });

        return res.status(201).json({ message: "Colaborador cadastrado com sucesso!" });

    } catch (error) {
        console.error("Erro no register:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}

// --- LOGIN ---
async function login(req, res) {
    const { email, password } = req.body;

    try {
        // 1. Busca o usuário/colaborador pelo email
        const user = await userRepo.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // 2. Confere a senha
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Senha incorreta!" });
        }

        // 3. Gera o Token JWT com os dados que o Front precisa
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, // Importante para aparecer no topo do site
                email: user.email,
                cargo: user.cargo        // Útil se quiser restringir acesso depois
            },
            SECRET,
            { expiresIn: "8h" } // Token dura 8 horas (turno de trabalho)
        );

        return res.json({
            message: "Login realizado com sucesso!",
            token,
            username: user.username,
            cargo: user.cargo
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro ao realizar login." });
    }
}

module.exports = { register, login };