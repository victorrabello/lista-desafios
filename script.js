const input = document.getElementById('desafio-input');
const btnAdd = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista-desafios');
const porcentagem = document.getElementById('porcentagem');
const barraProgresso = document.getElementById('barra-preenchimento');

let desafios = JSON.parse(localStorage.getItem('listaDesafios')) || [];
renderizarLista();

function renderizarLista() {
  lista.innerHTML = ''; // Limpa a lista antes de renderizar

  if (desafios.length === 0) {
    lista.innerHTML =
      '<p style="text-align:center; opacity:0.5;">Nenhum desafio por aqui... ainda! 🚀</p>';
    return;
  }

  desafios.forEach((item) => {
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
    atualizarProgresso();
  });
}

function alternarConcluido(id) {
  desafios = desafios.map((item) => {
    if (item.id === id) {
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
