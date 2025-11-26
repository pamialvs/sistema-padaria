const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

const SECRET = "minha_chave_super_segura";

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: "Usuário já cadastrado!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });

  res.json({ message: "Cadastro realizado com sucesso!" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });

  const correctPass = await bcrypt.compare(password, user.password);
  if (!correctPass) return res.status(401).json({ message: "Senha incorreta!" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });

  res.json({ message: "Login efetuado com sucesso!", token });
};

