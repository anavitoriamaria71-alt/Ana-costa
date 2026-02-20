// ====== Carregamento de Header e Footer ======
async function injectPartial(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const url = container.getAttribute("data-partial");
  if (!url) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);
    const html = await res.text();
    container.innerHTML = html;

    if (containerSelector === "#site-footer") {
      const yearSpan = container.querySelector("#year");
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
      wireNewsletter(container);
    }

    if (containerSelector === "#site-header") {
      updateCartDisplay();
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="container"><p>Erro ao carregar componente.</p></div>`;
  }
}

// ====== Ações Globais ======
function wireGlobalActions() {
  document.querySelectorAll("[data-action='mostrar-alerta']").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("✨ Bem-vinda à nossa loja! Aproveite nossa nova coleção rosa 💗");
    });
  });
}

// ====== Sistema Simples de Carrinho ======
let cartCount = 0;

function wireAddToCart() {
  document.querySelectorAll("[data-action='add-carrinho']").forEach(btn => {
    btn.addEventListener("click", () => {
      cartCount++;
      updateCartDisplay();
      alert("🛍️ Produto adicionado ao carrinho!");
    });
  });
}

function updateCartDisplay() {
  const cartBadge = document.querySelector("#cart-count");
  if (cartBadge) {
    cartBadge.textContent = cartCount;
  }
}

// ====== Newsletter ======
function wireNewsletter(root) {
  const form = root.querySelector("#newsletter-form");
  const input = root.querySelector("#nl-email");
  const feedback = root.querySelector("#nl-feedback");
  if (!form || !input || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      feedback.textContent = "Por favor, insira um e-mail válido.";
      return;
    }
    feedback.textContent = "💌 Você entrou para nossa lista VIP!";
    form.reset();
  });
}

// ====== Contato ======
function wireContato() {
  const form = document.querySelector("#contato-form");
  const feedback = document.querySelector("#contato-feedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      feedback.textContent = "Preencha todos os campos corretamente.";
      return;
    }

    feedback.textContent = "✨ Mensagem enviada com sucesso!";
    form.reset();
  });
}

// ====== Inicialização ======
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    injectPartial("#site-header"),
    injectPartial("#site-footer"),
  ]);

  wireGlobalActions();
  wireContato();
  wireAddToCart();
});