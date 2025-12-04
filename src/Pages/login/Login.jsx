import { useState } from "react";
import s from './login.module.scss';
import imgLogin from '../../Assests/img-login.png';
import { Link, useNavigate } from "react-router-dom"; 

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- CORREÇÃO APLICADA AQUI ---
        // Salvamos o token no navegador para o Dashboard ler depois
        localStorage.setItem("authToken", data.token);
        // ------------------------------

        alert("Login realizado!");
        // Redireciona para o dashboard
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Erro ao fazer login");
      }

    } catch (err) {
      alert("Erro de conexão com o servidor");
      console.error(err);
    }
  };

  return (
    <main className={s.container}>
      <section className={s.loginSection}>
        <h1 className={s.loginTitle}>Faça seu Login</h1>

        <form className={s.loginForm} onSubmit={handleLogin}>

          <div className={s.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu-email"
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
              placeholder="sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <input
            type="submit"
            value="Entrar"
            className={s.buttonLogin}
          />
        </form>

        <p className={s.signupLink}>
          <Link to="/cadastro">Crie agora</Link>
        </p>
      </section>

      <section className={s.illustrationSection}>
        <img src={imgLogin} alt="Ilustração" />   
      </section>
    </main>
  );
}