const agendamentoForm = document.getElementById('agendamentoForm');
const dataInput = document.getElementById('data');
const horaInput = document.getElementById('hora');
const agendarButton = agendamentoForm.querySelector('.submit-button');
const mensagem = document.getElementById('mensagem');

async function carregarHorariosDisponiveis() {
    const response = await fetch('/api/appointments');
    const agendamentos = await response.json();
    const hoje = new Date().toISOString().split('T')[0];
    const horariosAgendados = agendamentos.filter(agendamento => agendamento.data === hoje).map(agendamento => agendamento.hora);
    let proximaHoraDisponivel = new Date().getHours() + 1;
    while (horariosAgendados.includes(`${String(proximaHoraDisponivel).padStart(2, '0')}:00`) && proximaHoraDisponivel <= 23) {
        proximaHoraDisponivel++;
    }
    if (proximaHoraDisponivel > 23) {
        horaInput.disabled = true;
        dataInput.disabled = true;
        agendarButton.disabled = true;
        mensagem.textContent = 'Horários indisponíveis hoje';
    } else {
        dataInput.value = hoje;
        horaInput.value = `${String(proximaHoraDisponivel).padStart(2, '0')}:00`;
    }
}

agendamentoForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const nomeCliente = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const agendamento = { nomeCliente, telefone, data, hora };
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agendamento),
        });
        const result = await response.json();
        if (response.ok) {
            alert('Agendamento realizado com sucesso!');
            agendamentoForm.reset();
            carregarHorariosDisponiveis();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao realizar agendamento. Tente novamente mais tarde.');
    }
});

document.addEventListener('DOMContentLoaded', carregarHorariosDisponiveis);
