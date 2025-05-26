// ====================
// SELEÇÃO DE ELEMENTOS
// ====================
const listaPedidos = document.getElementById('listaPedidos');
const filtroNome = document.getElementById('filtroNome');
const filtroStatus = document.getElementById('filtroStatus');
const btnLimparHistorico = document.getElementById('limparHistorico');


// =======================================
// CARREGAR PEDIDOS DO ARMAZENAMENTO LOCAL
// =======================================
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
console.log('Pedidos carregados no painel:', pedidos);


// ==============================
// SALVAR PEDIDOS NO LOCALSTORAGE
// ==============================
function salvarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}


// ========================================
// ATUALIZAR A EXIBIÇÃO DA LISTA DE PEDIDOS
// ========================================
function atualizarLista() {
    const nomeFiltro = filtroNome.value.toLowerCase();
    const statusFiltro = filtroStatus.value;

    listaPedidos.innerHTML = '';

    const pedidosFiltrados = pedidos.filter(p => {
        const nomeMatch = p.cliente.nome.toLowerCase().includes(nomeFiltro);
        const statusMatch = statusFiltro ? p.status === statusFiltro : true;
        return nomeMatch && statusMatch;
    });

    if (pedidosFiltrados.length === 0) {
        listaPedidos.innerHTML = '<p>Nenhum pedido encontrado.</p>';
        return;
    }

    pedidosFiltrados.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'pedido-card';
        card.style.border = '1px solid #ccc';
        card.style.padding = '10px';
        card.style.marginBottom = '10px';

        card.innerHTML = `
    <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
    <p><strong>Cidade:</strong> ${pedido.cliente.cidade}</p>
    <p><strong>Endereço:</strong> ${pedido.cliente.endereco}</p>
    <p><strong>Telefone:</strong> ${pedido.cliente.telefone || '-'}</p>
    <p><strong>Itens:</strong></p>
    <ul>
      ${pedido.itens.map(i => `<li>${i.nome} (${i.quantidade}) - R$${i.subtotal.toFixed(2)}</li>`).join('')}
    </ul>
    <p><strong>Entrega:</strong> R$${pedido.taxaEntrega.toFixed(2)}</p>
    <p><strong>Total:</strong> R$${pedido.total.toFixed(2)}</p>
    <p><strong>Pagamento:</strong> ${pedido.formaPagamento}</p>
    <p><strong>Troco:</strong> ${pedido.troco || '-'}</p>
    <p><strong>Status:</strong> <span id="status-${pedido.id}">${pedido.status}</span></p>
    <p><small>${new Date(pedido.dataHora).toLocaleString()}</small></p>
    <div>
      <button onclick="atualizarStatus(${pedido.id}, 'Pendente')">🟡 Pendente</button>
      <button onclick="atualizarStatus(${pedido.id}, 'Aceito')">🟢 Aceito</button>
      <button onclick="atualizarStatus(${pedido.id}, 'Saiu')">🛵 Saiu</button>
      <button onclick="atualizarStatus(${pedido.id}, 'Entregue')">✅ Entregue</button>
      <button onclick="atualizarStatus(${pedido.id}, 'Cancelado')">❌ Cancelado</button>
    </div>
    <div style="margin-top: 10px;">
      <button onclick="copiarMensagem(${pedido.id})">📋 Copiar mensagem pronta</button>
      ${pedido.cliente.telefone ? `<a href="https://wa.me/55${pedido.cliente.telefone}" target="_blank">💬 Ver conversa</a>` : ''}
    </div>
  `;

        listaPedidos.appendChild(card);
    });
}


// ==========================
// ALTERAR O STATUS DO PEDIDO
// ==========================
function atualizarStatus(id, novoStatus) {
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    if (pedidoIndex > -1) {
        pedidos[pedidoIndex].status = novoStatus;
        salvarPedidos();
        atualizarLista();
    }
}

// EVENTOS PARA FILTROS
filtroNome.addEventListener('input', atualizarLista);
filtroStatus.addEventListener('change', atualizarLista);

// LIMPAR HISTÓRICO DE PEDIDOS
btnLimparHistorico.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de pedidos?')) {
        pedidos = [];
        salvarPedidos();
        atualizarLista();
    }
});


// ==============================
// INICIALIZA A LISTA AO CARREGAR
// ==============================
atualizarLista();


// =======================================
// COPIAR MENSAGEM PRONTA, CONFORME STATUS
// =======================================
function copiarMensagem(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    const nomeCliente = pedido.cliente.nome;
    const status = pedido.status;

    let mensagem = `Olá, ${nomeCliente}! Aqui é a Dona Lourdes. `;

    switch (status) {
        case 'Pendente':
            mensagem += `Recebi seu pedido com muito carinho e já estou preparando tudo para você. Em breve, confirmo tudinho, tá bem? 🍲💛`;
            break;
        case 'Aceito':
            mensagem += `Seu pedido foi confirmado e está sendo preparado com todo o cuidado.  🍳🌷`;
            break;
        case 'Saiu':
            mensagem += `Seu pedido já saiu para entrega e logo estará aí com você. Fique tranquilo(a), cuide-se bem! 🛵💨`;
            break;
        case 'Entregue':
            mensagem += `Seu pedido foi entregue! Espero que tenha gostado e que traga um gostinho de conforto. Qualquer coisa, estou aqui para ajudar! 😊💚`;
            break;
        case 'Cancelado':
            mensagem += `Infelizmente seu pedido precisou ser cancelado. Sinto muito mesmo! Se quiser, podemos conversar para resolver. Estou aqui para você. 🙁🤝`;
            break;
        default:
            mensagem += `Tudo certo com seu pedido! Se precisar, é só me chamar, viu? Estou sempre aqui para ajudar com muito carinho. 💕`;
    }

    mensagem += `\n\nVolte sempre que quiser!💚🌱`;

    navigator.clipboard.writeText(mensagem).then(() => {
        alert("Mensagem copiada! Agora é só colar no WhatsApp.");
    });
}


