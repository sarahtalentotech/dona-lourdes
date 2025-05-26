$(document).ready(function () {

  // =======================
  // FILTRAGEM DE CATEGORIAS
  // =======================
  const categoryButtons = document.querySelectorAll('.category-button');
  const categories = document.querySelectorAll('.category');


  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');


      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');


      categories.forEach(cat => cat.style.display = 'none');


      const selectedCategory = document.querySelector(`.category[data-category="${category}"]`);
      if (selectedCategory) {
        selectedCategory.style.display = 'block';
      }
    });
  });

  // Exibição inicial de categorias
  categories.forEach(cat => cat.style.display = 'none');
  const defaultCategory = document.querySelector('.category[data-category="verduras-e-legumes"]');
  if (defaultCategory) {
    defaultCategory.style.display = 'block';
  }



  // ===============================================
  // GARANTINDO QUE O CSS FUNCIONE SEM INTERFERÊNCIA
  // ===============================================
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 600) {
      categories.forEach(category => category.style.width = '100%');
    } else {
      categories.forEach(category => category.style.width = 'calc(33.333% - 12px)');
    }
  });

  // Garante que o evento de resize ajuste corretamente
  if (window.innerWidth <= 600) {
    categories.forEach(category => category.style.width = '100%');
  } else {
    categories.forEach(category => category.style.width = 'calc(33.333% - 12px)');
  }
});




// ===================================================
// ANIMAÇÃO DE ENTRADA PELA ESQUERDA (SOMENTE NA HOME)
// ===================================================
const homeSection = document.querySelector('#home');
if (homeSection) {
  const title = homeSection.querySelector('.title');
  const description = homeSection.querySelector('.description');
  const buttons = homeSection.querySelector('#cta_buttons');

  [title, description, buttons].forEach((el, i) => {
    if (el) {
      el.classList.add('fade-left');
      setTimeout(() => {
        el.classList.add('animated');
      }, i * 300 + 50);
    }
  });
}



// ===================
// AVISO DO WHATSAPP
// ===================
const phoneButton = document.getElementById('phone_button');
const whatsappAviso = document.getElementById('whatsapp-aviso');
const whatsappCienteButton = document.getElementById('whatsapp-ciente');
const fecharAvisoButton = document.getElementById('fechar-aviso');
const whatsappLink = "https://api.whatsapp.com/send?phone=554391422338&text=Ol%C3%A1%2C%20Dona%20Lourdes!%20%F0%9F%98%8A%0AVi%20os%20produtos%20do%20Armaz%C3%A9m%20e%20gostaria%20de%20fazer%20meu%20pedido%20por%20aqui.%20Pode%20me%20ajudar%2C%20por%20favor%3F";

if (phoneButton && whatsappAviso && whatsappCienteButton && fecharAvisoButton) {
  phoneButton.addEventListener('click', function (event) {
    event.preventDefault();
    whatsappAviso.style.display = 'block';
  });

  whatsappCienteButton.addEventListener('click', function () {
    window.location.href = whatsappLink;
    whatsappAviso.style.display = 'none';
  });

  fecharAvisoButton.addEventListener('click', function () {
    whatsappAviso.style.display = 'none';
  });
}



// =============================
// SCROLL SUAVE PARA O CARDÁPIO
// =============================
$('#ver-cardapio').on('click', function (e) {
  e.preventDefault();
  const menuSection = $('#menu');
  if (menuSection.length) {
    $('html, body').animate({
      scrollTop: menuSection.offset().top - 96
    }, 800);
  }
});



// =========
// CARRINHO
// =========
let cart = [];

const cartSalvo = localStorage.getItem('carrinho');
if (cartSalvo) {
  cart = JSON.parse(cartSalvo);
  updateCartDisplay();
}

function formatPrice(price) {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItemsContainer.innerHTML = "";
  localStorage.setItem('carrinho', JSON.stringify(cart));



  // =============================
  // CARRINHO - EXIBIÇÃO E REMOÇÃO
  // =============================
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
    <img src="${item.imageSrc}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; margin-right: 10px;">
    ${item.name} <strong>(${item.quantity})</strong> - ${formatPrice(item.price * item.quantity)}
    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; font-size: 16px; cursor: pointer;">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  `;
    cartItemsContainer.appendChild(li);
  });

  // Aplicar taxa de entrega
  let deliveryFee = 4.00;
  if (isFreeDeliveryDay()) {
    deliveryFee = 0;
  }

  const deliveryLine = document.createElement("li");
  deliveryLine.innerHTML = `📦 <strong>Entrega:</strong> ${deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}`;
  cartItemsContainer.appendChild(deliveryLine);

  const totalWithDelivery = total + deliveryFee;
  cartTotal.innerText = formatPrice(totalWithDelivery);
}

// REMOÇÃO
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}




// ======================
// ADICIONAR AO CARRINHO
// ======================
function addToCart(name, price, imageSrc) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, imageSrc, quantity: 1 });
  }
  updateCartDisplay();
}



// ==============================
// CLIQUE PARA ADICIONAR ANIMAÇÃO
// ==============================
document.querySelectorAll(".dish .btn-default").forEach((button) => {
  button.addEventListener("click", () => {
    const dish = button.closest(".dish");
    const name = dish.querySelector(".dish-title").innerText;
    const priceText = dish.querySelector(".dish-price h4").innerText.replace("R$", "").replace(",", ".").trim();
    const price = parseFloat(priceText);
    const image = dish.querySelector(".dish-image");
    const imageSrc = image.getAttribute("src");

    const cartButton = document.getElementById("cart-toggle");
    const cartRect = cartButton.getBoundingClientRect();
    const imgRect = image.getBoundingClientRect();
    const clone = image.cloneNode(true);


    clone.style.position = "fixed";
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = "all 0.7s ease-in-out";
    clone.style.zIndex = "1000";
    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.left = `${cartRect.left}px`;
      clone.style.top = `${cartRect.top}px`;
      clone.style.width = "30px";
      clone.style.height = "30px";
      clone.style.opacity = "0.5";
    }, 10);

    setTimeout(() => {
      clone.remove();
    }, 800);

    addToCart(name, price, imageSrc);
  });
});




// ============================================
// TAXA GRÁTIS NA PRIMEIRA SEGUNDA-FEIRA DO MÊS
// ============================================
function isFreeDeliveryDay() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // Encontrar a primeira segunda-feira do mês
  const firstMonday = new Date(firstDay);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }

  return today.toDateString() === firstMonday.toDateString();
}




// ================
// LIMPAR CARRINHO
// ================
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCartDisplay();
});




// ========================
// MOSTRAR/OCULTAR CARRINHO
// ========================
document.getElementById("cart-toggle").addEventListener("click", () => {
  document.getElementById("cart").classList.toggle("show");
});




// ====================
// CARROSSEL DE IMAGENS
// ====================
let currentIndex = 0;
const slides = document.querySelectorAll(".slides img");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;
function showSlide(index) {
  const slideContainer = document.querySelector(".slides");
  if (index >= totalSlides) currentIndex = 0;
  else if (index < 0) currentIndex = totalSlides - 1;
  else currentIndex = index;
  slideContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[currentIndex]) dots[currentIndex].classList.add("active");
}

function changeSlide(step) {
  showSlide(currentIndex + step);
}

function currentSlide(index) {
  showSlide(index);
}


// SLIDE AUTOMÁTICO
let autoSlide = setInterval(() => {
  changeSlide(1);
}, 5000); // ← ALTERADO de 6000 para 5000 (5 segundos)

// Resetar o temporizador ao clicar manualmente
document.querySelector(".prev").addEventListener("click", () => {
  changeSlide(-1);
  // resetAutoSlide(); ← REMOVIDO daqui
});

document.querySelector(".next").addEventListener("click", () => {
  changeSlide(1);
  // resetAutoSlide(); ← REMOVIDO daqui
});

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    currentSlide(idx);
    resetAutoSlide(); // ← ESTE continua, pois currentSlide não chama changeSlide
  });
});

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    changeSlide(1);
  }, 5000); // ← ALTERADO de 6000 para 5000
}

// ✅ ADICIONADO: reinício automático dentro do changeSlide
function changeSlide(step) {
  showSlide(currentIndex + step);
  resetAutoSlide(); // ← ADICIONADO AQUI
}

showSlide(currentIndex);





// =================
// FINALIZAR PEDIDO 
// =================
const finalizarPedidoButton = document.getElementById("btn-finalizar-carrinho");
const infoModal = document.getElementById("info-modal");
const proximoPagamento = document.getElementById("proximo-pagamento");
const fecharInfo = document.getElementById("fechar-info");
const pagamentoModal = document.getElementById("payment-modal");
const fecharModalButton = document.getElementById("fechar-modal");
const confirmarPagamento = document.getElementById("confirmar-pagamento");
const trocoSection = document.getElementById("troco-section");
const trocoValorInput = document.getElementById("troco-valor");
const noTrocoCheckbox = document.getElementById("sem-troco");
const pixInfo = document.getElementById("pix-info");

// Mostrar/ocultar campos de troco e PIX conforme método de pagamento selecionado
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "pix") {
      pixInfo.style.display = "block";
      trocoSection.style.display = "none";
      trocoValorInput.value = "";
      noTrocoCheckbox.checked = false;
      trocoValorInput.disabled = false;
    } else if (radio.value === "dinheiro") {
      pixInfo.style.display = "none";
      trocoSection.style.display = "block";

      noTrocoCheckbox.checked = false;
      trocoValorInput.disabled = false;
      trocoValorInput.style.display = "inline-block";
    } else {
      pixInfo.style.display = "none";
      trocoSection.style.display = "none";
      trocoValorInput.value = "";
      noTrocoCheckbox.checked = false;
      trocoValorInput.disabled = false;
      trocoValorInput.style.display = "inline-block";
    }
  });
});

// Lógica checkbox "Não preciso de troco"
noTrocoCheckbox.addEventListener("change", () => {
  if (noTrocoCheckbox.checked) {
    trocoValorInput.value = "";
    trocoValorInput.disabled = true;
    trocoValorInput.style.display = "none";
  } else {
    trocoValorInput.disabled = false;
    trocoValorInput.style.display = "inline-block";
  }
});

if (finalizarPedidoButton) {
  finalizarPedidoButton.addEventListener("click", () => {
    infoModal.style.display = "flex";
    document.getElementById("cart").classList.remove("show");
  });
}

// Avançar para modal de pagamento com validação dos dados
proximoPagamento.addEventListener("click", () => {
  const nome = document.getElementById("nome-cliente").value.trim();
  const cidade = document.getElementById("cidade-cliente").value;
  const endereco = document.getElementById("endereco-cliente").value.trim();

  if (!nome || !cidade || !endereco) {
    alert("Por favor, preencha todas as informações.");
    return;
  }

  // Preencher resumo do pedido
  const resumoItens = document.getElementById("resumo-itens");
  const resumoTotal = document.getElementById("resumo-total");
  resumoItens.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.quantity}) - ${formatPrice(subtotal)}`;
    resumoItens.appendChild(li);
  });

  // Calcular taxa de entrega
  let deliveryFee = isFreeDeliveryDay() ? 0 : 4.00;
  const entregaItem = document.createElement("li");
  entregaItem.textContent = `Entrega: ${deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}`;
  resumoItens.appendChild(entregaItem);

  // Total com entrega
  const totalComEntrega = total + deliveryFee;
  resumoTotal.textContent = formatPrice(totalComEntrega);
  infoModal.style.display = "none";
  pagamentoModal.style.display = "flex";
});

// Fechar modal de informações e pagamento
fecharInfo.addEventListener("click", () => {
  infoModal.style.display = "none";
});
if (fecharModalButton) {
  fecharModalButton.addEventListener("click", () => {
    pagamentoModal.style.display = "none";
  });
}




// ============================
// ENVIO DO PEDIDO VIA WHATSAPP
// ============================
confirmarPagamento.addEventListener("click", () => {
  const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
  if (!selectedMethod) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  const nome = document.getElementById("nome-cliente").value.trim();
  const cidade = document.getElementById("cidade-cliente").value;
  const endereco = document.getElementById("endereco-cliente").value.trim();
  const telefonecliente = document.getElementById("telefone-cliente").value.trim();

  // Validação de telefone com 11 dígitos (ex: 44991234567)
  const telefoneNumeros = telefonecliente.replace(/\D/g, "");
  if (telefoneNumeros.length !== 11) {
    alert("Número de telefone inválido. Insira no formato com DDD (ex: 44991234567).");
    return;
  }

  const paymentMethod = selectedMethod.value;

  // Definir valor do troco conforme seleção
  let trocoValue = "";
  if (paymentMethod === "dinheiro") {
    if (noTrocoCheckbox.checked) {
      trocoValue = "Não precisa de troco";
    } else {
      if (trocoValorInput.value && !isNaN(parseFloat(trocoValorInput.value))) {
        trocoValue = trocoValorInput.value.trim();
      } else {
        trocoValue = null;
      }
    }
  }

  // Montar mensagem
  let mensagem = `Olá, Dona Lourdes! Aqui está meu pedido:%0A%0A`;
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    mensagem += `• ${item.name} (${item.quantity}) - ${formatPrice(subtotal)}%0A`;
  });

  let deliveryFee = isFreeDeliveryDay() ? 0 : 4.00;
  const totalComEntrega = total + deliveryFee;

  mensagem += `%0ATaxa de entrega: ${deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}`;
  mensagem += `%0ATotal: ${formatPrice(totalComEntrega)}%0AForma de pagamento: ${paymentMethod}`;

  if (paymentMethod === "dinheiro") {
    if (trocoValue === "Não precisa de troco") {
      mensagem += `%0ATroco: Não preciso de troco`;
    } else if (trocoValue) {
      mensagem += `%0ATroco para: R$ ${trocoValue}`;
    } else {
      mensagem += `%0ATroco: Não informado`;
    }
  }

  if (paymentMethod === "pix") {
    mensagem += `%0A%0AJá efetuei o pagamento via PIX.%0AIrei anexar o comprovante aqui:`;
  }

  mensagem += `%0A%0ANome: ${nome}%0ACidade: ${cidade}%0AEndereço: ${endereco}`;

  const telefone = "5543991422338";
  const linkWhatsApp = `https://wa.me/${telefone}?text=${mensagem}`;
  window.open(linkWhatsApp, "_blank");

  // Criar objeto do pedido e salvar no localStorage
  const pedido = {
    id: Date.now(),
    cliente: {
      nome,
      cidade,
      endereco,
      telefone: telefoneNumeros
    },
    itens: cart.map(item => ({
      nome: item.name,
      quantidade: item.quantity,
      precoUnitario: item.price,
      subtotal: item.price * item.quantity
    })),
    taxaEntrega: deliveryFee,
    total: totalComEntrega,
    formaPagamento: paymentMethod,
    troco: trocoValue || null,
    status: "Pendente",
    dataHora: new Date().toISOString()
  };

  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  pagamentoModal.style.display = "none";
});

