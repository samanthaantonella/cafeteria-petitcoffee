document.addEventListener('DOMContentLoaded', () => {
    verificarAcessoGerente();
    configurarEventosAdmin();
});

// Validação simples para garantir que apenas gerentes acedem
function verificarAcessoGerente() {
    const isGerente = localStorage.getItem('is_gerente') || sessionStorage.getItem('is_gerente');

    // Descomente as linhas abaixo caso pretenda forçar o bloqueio por login de gerente
    /*
    if (!isGerente) {
        alert('Acesso negado! Esta página é exclusiva para gerentes.');
        window.location.href = 'login.html';
    }
    */
}

function configurarEventosAdmin() {
    // Ação ao clicar em "Concluir Atendimento"
    document.querySelectorAll('.btn-finalizar').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const idPedido = e.currentTarget.getAttribute('data-id');
            if (confirm(`Deseja marcar o pedido #${idPedido} como FINALIZADO?`)) {
                alert(`Pedido #${idPedido} movido para a lista de Finalizados.`);
                // Lógica de atualização via API / Backend aqui
            }
        });
    });

    // Botão Sair
    const btnSair = document.getElementById('btnLogoutAdmin');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('is_gerente');
            sessionStorage.removeItem('is_gerente');
            window.location.href = 'login.html';
        });
    }
}