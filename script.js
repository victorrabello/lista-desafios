const input = document.getElementById('desafio-input');
const btnAdd = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista-desafios');
const porcentagem = document.getElementById('porcentagem');
const barraProgresso = document.getElementById('barra-preenchimento');
const btnLimpar = document.getElementById('btn-limpar');

let desafios = JSON.parse(localStorage.getItem('listaDesafios')) || [];
let filtroAtual = 'todos';

renderizarLista();

function mudarFiltro(novofiltro, elementoBotao) {
  filtroAtual = novofiltro;

  document
    .querySelectorAll('.btn-filtro')
    .forEach((btn) => btn.classList.remove('ativo'));

  elementoBotao.classList.add('ativo');

  renderizarLista();
}

function renderizarLista() {
  let listaFiltrada = desafios;

  if (filtroAtual === 'pendentes')
    listaFiltrada = desafios.filter((d) => !d.concluido);
  if (filtroAtual === 'concluidos')
    listaFiltrada = desafios.filter((d) => d.concluido);

  const temConcluidos = desafios.some((item) => item.concluido);
  btnLimpar.style.display = temConcluidos ? 'block' : 'none';

  if (listaFiltrada.length === 0) {
    mostrarMensagemVazia();
    atualizarProgresso();
    return;
  }

  lista.innerHTML = ''; // Limpa a lista antes de renderizar

  listaFiltrada.forEach((item) => {
    const novoCard = document.createElement('div');
    novoCard.classList.add('card-desafio');
    if (item.concluido) novoCard.classList.add('concluido');

    novoCard.innerHTML = `
    <span>${item.texto}</span>
    <div>
      <button onclick="alternarConcluido(${item.id})">✔️</button>
      <button onclick="removerDesafio(${item.id})">🗑️</button>
    </div>`;

    lista.appendChild(novoCard);
  });
  atualizarProgresso();
}

function mostrarMensagemVazia() {
  let mensagem = '';
  let icone = '';

  if (filtroAtual === 'todos') {
    mensagem = 'Nenhum desafio por aqui... ainda! 🚀';
    icone = '🎯';
  } else if (filtroAtual === 'pendentes') {
    mensagem = 'Incrível! Você não tem nada pendente. ☕';
    icone = '✅';
  } else {
    mensagem = 'Você ainda não completou nenhum desafio. Vamos lá! 💪';
    icone = '⏳';
  }

  lista.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icone}</div>
      <p>${mensagem}</p>
    </div>
  `;
}

function alternarConcluido(id) {
  desafios = desafios.map((item) => {
    if (item.id === id) {
      // Verificamos se ele vai ser concluído AGORA (estava false e vai virar true)
      if (!item.concluido) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#753185', '#a34ec4', '#ffffff'],
        });
      }
      // Retornamos o item invertido
      return { ...item, concluido: !item.concluido };
    }
    return item;
  });

  salvarNoLocalStorage();
  renderizarLista();
}

function removerDesafio(id) {
  // Filtra o array, mantendo apenas quem NÃO tem o ID que queremos apagar
  desafios = desafios.filter((item) => item.id !== id);
  salvarNoLocalStorage();
  renderizarLista();
}

function salvarNoLocalStorage() {
  localStorage.setItem('listaDesafios', JSON.stringify(desafios));
}

btnAdd.addEventListener('click', () => {
  const texto = input.value.trim();
  if (texto !== '') {
    const novoDesafio = {
      id: Date.now(),
      texto: texto,
      concluido: false,
    };
    desafios.push(novoDesafio);
    salvarNoLocalStorage();
    renderizarLista();
  }
  input.value = ''; //Limpa o input após adicionar
});

function atualizarProgresso() {
  const total = desafios.length;
  const concluidos = desafios.filter((item) => item.concluido).length;
  const porcentagemConcluida =
    total === 0 ? 0 : Math.round((concluidos / total) * 100);
  porcentagem.textContent = `${porcentagemConcluida}%`;
  barraProgresso.style.width = `${porcentagemConcluida}%`;

  if (porcentagemConcluida === 100 && total > 0) {
    barraProgresso.style.background = 'var(--success)'; // A barra fica verde
    barraProgresso.style.boxShadow = '0 0 15px var(--success)';
  } else {
    barraProgresso.style.background =
      'linear-gradient(90deg, var(--primary), #a34ec4)';
    barraProgresso.style.boxShadow = '0 0 10px var(--primary)';
  }
}

btnLimpar.addEventListener('click', () => {
  desafios = desafios.filter((item) => !item.concluido);
  salvarNoLocalStorage();
  renderizarLista();
});
