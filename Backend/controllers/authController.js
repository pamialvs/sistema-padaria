const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/colaboradorRepository");


const SECRET = "chave_secreta_do_pao_dourado"; 


async function register(req, res) {
   
    const { username, email, password, cargo, telefone } = req.body;

   
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios!" });
    }

    try {
        
        const userExists = await userRepo.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        await userRepo.createUser({
            username,
            email,
            password: hashedPassword,
            cargo: cargo || "Funcionário", 
            telefone: telefone || null
        });

        return res.status(201).json({ message: "Colaborador cadastrado com sucesso!" });

    } catch (error) {
        console.error("Erro no register:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}


async function login(req, res) {
    const { email, password } = req.body;

    try {
       
        const user = await userRepo.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

   
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Senha incorreta!" });
        }

  
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                cargo: user.cargo        
            },
            SECRET,
            { expiresIn: "8h" } 
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