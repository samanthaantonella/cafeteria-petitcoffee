document.addEventListener('DOMContentLoaded', () => {
    guardAdmin();
    carregarUsuarioAdmin();
    inicializarEventos();
});

// Guard de Proteção de Acesso
function guardAdmin() {
    const isAdmin = localStorage.getItem('petit_is_admin') || sessionStorage.getItem('petit_is_admin');
    const currentUser = JSON.parse(localStorage.getItem('petit_user') || sessionStorage.getItem('petit_user') || '{}');

    if (!isAdmin && currentUser.role !== 'admin') {
        alert('Acesso restrito. Esta área é exclusiva para administradores da Petit Coffee.');
        window.location.href = './login.html';
    }
}

// Carrega informações do utilizador logado
function carregarUsuarioAdmin() {
    const user = JSON.parse(localStorage.getItem('petit_user') || sessionStorage.getItem('petit_user') || '{}');
    const elName = document.getElementById('adminUserName');
    const elEmail = document.getElementById('adminUserEmail');

    if (user.nome && elName) elName.textContent = user.nome;
    if (user.email && elEmail) elEmail.textContent = user.email;
}

// Configuração de Eventos do Painel
function inicializarEventos() {
    // Logout
    const btnLogout = document.getElementById('btnLogoutAdmin');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('petit_is_admin');
            sessionStorage.removeItem('petit_is_admin');
            window.location.href = './login.html';
        });
    }

    // Modal de Novo Produto
    let modalProdInstance;
    const btnNovoProd = document.getElementById('btnAbrirModalProduto');
    const formProd = document.getElementById('formProdutoAdmin');

    if (btnNovoProd) {
        btnNovoProd.addEventListener('click', () => {
            modalProdInstance = new bootstrap.Modal(document.getElementById('modalProduto'));
            modalProdInstance.show();
        });
    }

    if (formProd) {
        formProd.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Produto guardado com sucesso no catálogo!');
            if (modalProdInstance) modalProdInstance.hide();
        });
    }

    // Alteração de Status dos Pedidos
    document.querySelectorAll('.select-status-pedido').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const novoStatus = e.target.value;
            alert(`O estado do pedido #${id} foi alterado para: ${novoStatus.toUpperCase()}`);
        });
    });

    // Botões de Ação do Cardápio
    document.querySelectorAll('.btn-editar-prod').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nome = e.currentTarget.getAttribute('data-nome');
            alert(`Editar detalhes do produto: ${nome}`);
        });
    });

    document.querySelectorAll('.btn-remover-prod').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nome = e.currentTarget.getAttribute('data-nome');
            if (confirm(`Tem certeza que deseja remover "${nome}" do cardápio?`)) {
                alert('Produto removido.');
            }
        });
    });
}