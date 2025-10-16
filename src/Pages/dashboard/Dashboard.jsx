import React from 'react';
import { useState } from "react";

export default function Dashboard() {
  // Função para simular o logout
  const handleLogout = () => {
    // Limpa o token do localStorage
    localStorage.removeItem('authToken');
    // Redireciona para a página de login
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Bem-vindo(a) à Pão Dourado Dashboard!</h1>
      <p>Esta é a sua área logada.</p>
      <button onClick={handleLogout} style={{ padding: '10px', color: 'white', backgroundColor: '#8B1C1C', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Sair (Logout)
      </button>
    </div>
  );
}