const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Coloque aqui o WhatsApp oficial da equipe, somente números,
// incluindo DDI e DDD. Ex.: 5511999999999
const WHATSAPP_ATENDIMENTO = process.env.WHATSAPP_ATENDIMENTO || "5511999999999";

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

function validar(dados) {
  if (!dados || typeof dados !== "object") return "Dados inválidos.";
  if (!dados.nome || dados.nome.trim().length < 3) return "Nome inválido.";
  if (!/^\d{10,11}$/.test(dados.celular || "")) return "Celular inválido.";
  if (!/^\d{8}$/.test(dados.cep || "")) return "CEP inválido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email || "")) return "E-mail inválido.";
  return null;
}

app.post("/api/interesse-adocao", (req, res) => {
  const dados = {
    nome: String(req.body.nome || "").trim(),
    celular: String(req.body.celular || "").replace(/\D/g, ""),
    cep: String(req.body.cep || "").replace(/\D/g, ""),
    email: String(req.body.email || "").trim()
  };

  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

  const mensagem =
`Olá! Sou da equipe da MAGLU Pet Center e recebi um novo interesse em adoção.

Nome: ${dados.nome}
Celular: ${dados.celular}
CEP: ${dados.cep}
E-mail: ${dados.email}

Gostaria de continuar o atendimento sobre adoção de um pet.`;

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_ATENDIMENTO}?text=${encodeURIComponent(mensagem)}`;

  // Não armazenamos os dados no servidor nesta versão.
  // O endpoint apenas valida e cria o link seguro de atendimento.
  return res.json({ ok: true, whatsappUrl });
});

app.get("/api/status", (_req, res) => {
  res.json({ ok: true, servico: "MAGLU Pet Center - API de adoção" });
});

app.listen(PORT, () => {
  console.log(`MAGLU rodando em http://localhost:${PORT}`);
});
