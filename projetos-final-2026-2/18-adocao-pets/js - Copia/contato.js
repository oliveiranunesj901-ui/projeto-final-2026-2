const form = document.getElementById("formContato");
const erro = document.getElementById("erroForm");
const sucesso = document.getElementById("sucesso");

const celular = document.getElementById("celular");
const cep = document.getElementById("cep");

celular.addEventListener("input", e => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 6) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
  e.target.value = v;
});

cep.addEventListener("input", e => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 5) v = v.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
  e.target.value = v;
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  erro.style.display = "none";
  sucesso.style.display = "none";

  const dados = {
    nome: document.getElementById("nome").value.trim(),
    celular: celular.value.replace(/\D/g, ""),
    cep: cep.value.replace(/\D/g, ""),
    email: document.getElementById("email").value.trim()
  };

  if (dados.nome.length < 3) return mostrarErro("Digite seu nome completo.");
  if (dados.celular.length < 10) return mostrarErro("Digite um número de celular válido.");
  if (dados.cep.length !== 8) return mostrarErro("Digite um CEP válido com 8 números.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    return mostrarErro("Digite um e-mail válido.");
  }

  try {
    proximoEstado(true);

    const resposta = await fetch("/api/interesse-adocao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Não foi possível enviar seus dados.");
    }

    sucesso.innerHTML = `
      <strong>Dados enviados com sucesso! 💚</strong><br>
      Você será direcionado para o WhatsApp da equipe para continuar o atendimento.
    `;
    sucesso.style.display = "block";

    // Abre o WhatsApp com a mensagem gerada pelo servidor.
    window.location.href = resultado.whatsappUrl;

  } catch (err) {
    mostrarErro(err.message);
    proximoEstado(false);
  }
});

function mostrarErro(mensagem) {
  erro.textContent = mensagem;
  erro.style.display = "block";
}

function proximoEstado(enviando) {
  const botao = form.querySelector("button[type='submit']");
  botao.disabled = enviando;
  botao.textContent = enviando ? "Preparando atendimento..." : "Enviar interesse em adoção";
}

document.getElementById("ano").textContent = new Date().getFullYear();
