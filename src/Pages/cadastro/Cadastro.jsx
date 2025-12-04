import { useState } from "react";
import s from '../login/login.module.scss';
import imgCadastro from '../../Assests/img-login.png';
import { Link } from "react-router-dom"; 



export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: nome,
        email: email,
        password: senha
      }),
    });

    const data = await response.json();
    alert(data.message);

  } catch (error) {
    console.error(error);
    alert("Erro no cadastro!");
  }
};

  return (
    <main className={s.container}>
      <section className={s.loginSection}>
        <h1 className={s.loginTitle}>Crie sua Conta</h1>

        <form className={s.loginForm} onSubmit={handleRegister}>

          <div className={s.inputGroup}>
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu-melhor-email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Crie uma senha forte"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <input
            type="submit"
            value="Criar Conta"
            className={s.buttonLogin}
          />
        </form>

        <p className={s.signupLink}>
            <Link to="/">Voltar</Link>
        </p>

      </section>

      <section className={s.illustrationSection}>
        <img src={imgCadastro} alt="Ilustração do Cadastro" />
      </section>
    </main>
  );
}