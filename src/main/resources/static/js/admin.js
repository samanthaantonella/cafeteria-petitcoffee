document.addEventListener('DOMContentLoaded', () => {
    loadDashboardOrders();
    setupAdminEvents();
});

// Pedidos demonstrativos caso ainda não existam registros
const initialOrders = [
    {
        id: '1001',
        nome: 'Aline Silva',
        telefone: '(11) 98765-4321',
        produto: 'Latte Petit',
        quantidade: 2,
        pagamento: 'Pix',
        status: 'Concluído'
    },
    {
        id: '1002',
        nome: 'Carlos Eduardo',
        telefone: '(11) 97111-2233',
        produto: 'Frappuccino Caramel',
        quantidade: 1,
        pagamento: 'Cartão de Crédito',
        status: 'Em preparo'
    }
];

function getOrders() {
    const stored = localStorage.getItem('petit_orders');
    if (!stored) {
        localStorage.setItem('petit_orders', JSON.stringify(initialOrders));
        return initialOrders;
    }
    return JSON.parse(stored);
}

function saveOrders(orders) {
    localStorage.setItem('petit_orders', JSON.stringify(orders));
}

// Carrega a tabela e as estatísticas
function loadDashboardOrders() {
    const orders = getOrders();
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    let pendingCount = 0;
    let revenueTotal = 0;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">Nenhum pedido registrado no momento.</td></tr>`;
    } else {
        orders.forEach((order, index) => {
            if (order.status === 'Pendente' || order.status === 'Em preparo') pendingCount++;
            revenueTotal += (order.quantidade || 1) * 15.00;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="fw-bold">#${order.id || (1000 + index)}</td>
                <td class="fw-semibold">${order.nome || 'Cliente'}</td>
                <td class="small text-muted">${order.telefone || '-'}</td>
                <td>${order.produto || 'Café Especial'}</td>
                <td class="text-center fw-bold">${order.quantidade || 1}</td>
                <td><span class="badge bg-light text-dark border">${order.pagamento || 'Pix'}</span></td>
                <td>
                    <select class="form-select form-select-sm status-select" data-index="${index}">
                        <option value="Pendente" ${order.status === 'Pendente' ? 'selected' : ''}>⏳ Pendente</option>
                        <option value="Em preparo" ${order.status === 'Em preparo' ? 'selected' : ''}>☕ Em preparo</option>
                        <option value="Concluído" ${order.status === 'Concluído' ? 'selected' : ''}>✅ Concluído</option>
                        <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>❌ Cancelado</option>
                    </select>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger btn-delete-order" data-index="${index}">🗑️️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Atualiza estatísticas
    const clients = JSON.parse(localStorage.getItem('petit_registered_clients') || '[]');
    document.getElementById('statTotalOrders').innerText = orders.length;
    document.getElementById('statPendingOrders').innerText = pendingCount;
    document.getElementById('statClientsCount').innerText = clients.length || orders.length;
    document.getElementById('statTotalRevenue').innerText = `R$ ${revenueTotal.toFixed(2).replace('.', ',')}`;
}

function setupAdminEvents() {
    // Alterar status do pedido
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const index = e.target.getAttribute('data-index');
            const orders = getOrders();
            orders[index].status = e.target.value;
            saveOrders(orders);
            loadDashboardOrders();
        }
    });

    // Excluir pedido
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-order')) {
            const index = e.target.getAttribute('data-index');
            if (confirm('Deseja excluir este registro de pedido?')) {
                const orders = getOrders();
                orders.splice(index, 1);
                saveOrders(orders);
                loadDashboardOrders();
            }
        }
    });

    // Filtro de busca na tabela
    document.getElementById('searchOrderInput')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#ordersTableBody tr');
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });
    });

    // Limpar histórico
    document.getElementById('btnClearOrders')?.addEventListener('click', () => {
        if (confirm('Atenção: Deseja realmente apagar todo o histórico de pedidos?')) {
            localStorage.setItem('petit_orders', JSON.stringify([]));
            loadDashboardOrders();
        }
    });

    // Cadastrar produto no modal
    document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Novo produto cadastrado com sucesso!');
        const modalEl = document.getElementById('newProductModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        e.target.reset();
    });
}
localStorage.setItem('petit_admin_logged', 'true');