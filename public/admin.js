window.onload = function () {
  const storedUsername = localStorage.getItem("adminUsername");
  const storedPassword = localStorage.getItem("adminPassword");
  let username, password;
  document.getElementById("empty").style.display = "none";

  if (!storedUsername || !storedPassword) {
    username = prompt("Digite o nome de usuário:", "");
    password = prompt("Digite a senha:", "");
    if (username === "admin" && password === "1234") {
      localStorage.setItem("adminUsername", username);
      localStorage.setItem("adminPassword", password);
      document.getElementById("empty").style.display = "none";
    } else {
      alert("Acesso negado!");
      window.location.href = "index.html";
    }
  } else {
    document.getElementById("empty").style.display = "none";
  }
};

const agendamentoForm = document.getElementById("agendamentoForm");
const agendamentoTableBody = document
  .getElementById("agendamentos-table")
  .getElementsByTagName("tbody")[0];

let agendamentos = [];

document.addEventListener("DOMContentLoaded", carregarAgendamentos);

async function carregarAgendamentos() {
  try {
    const response = await fetch("/api/appointments");
    agendamentos = await response.json();
    exibirAgendamentos();
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
}

function exibirAgendamentos() {
  agendamentoTableBody.innerHTML = "";
  agendamentos.forEach((agendamento) => {
    const row = agendamentoTableBody.insertRow();

    let d = new Date(agendamento.data);
    d.setDate(d.getDate() + 1);
    const dataFormatada = d.toLocaleDateString("pt-BR");

    row.innerHTML = `
        <td>${agendamento.nomeCliente}</td>
        <td>${agendamento.telefone}</td>
        <td>${dataFormatada}</td>
        <td>${agendamento.hora}</td>
        <td>
            <button onclick="editarAgendamento('${agendamento._id}')">Editar</button>
            <button onclick="deletarAgendamento('${agendamento._id}')">Deletar</button>
        </td>
    `;
  });
}

agendamentoForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const id = document.getElementById("agendamentoId").value;
  const nomeCliente = document.getElementById("nomeCliente").value;
  const telefone = document.getElementById("telefone").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const agendamento = { nomeCliente, telefone, data, hora };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      });
    } else {
      response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      });
    }

    if (response.ok) {
      carregarAgendamentos();
      agendamentoForm.reset();
      document.getElementById("form-title").innerText = "Adicionar Agendamento";
    } else {
      alert("Erro ao salvar agendamento");
    }
  } catch (error) {
    console.error("Erro ao salvar agendamento:", error);
  }
});

function editarAgendamento(id) {
  const agendamento = agendamentos.find(
    (agendamento) => agendamento._id === id
  );
  document.getElementById("agendamentoId").value = agendamento._id;
  document.getElementById("nomeCliente").value = agendamento.nomeCliente;
  document.getElementById("telefone").value = agendamento.telefone;
  document.getElementById("data").value = agendamento.data;
  document.getElementById("hora").value = agendamento.hora;
  document.getElementById("form-title").innerText = "Editar Agendamento";
}

async function deletarAgendamento(id) {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      carregarAgendamentos();
    } else {
      alert("Erro ao deletar agendamento");
    }
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
  }
}
