const CONFIG = window.SYNTECVET_CONFIG || {};
let supabaseClient = null;

const STORE = {
  products: "syntecvet.products",
  users: "syntecvet.users",
  session: "syntecvet.session",
  cart: "syntecvet.cart",
  orders: "syntecvet.orders",
  settings: "syntecvet.settings",
  chat: "syntecvet.chat",
};

const PRIVACY_VERSION = "2026-07-09";
const PUBLIC_APP_URL = "https://syntec-vet-eder-x47q.vercel.app";
const PHASE_ONE_MODE = true;
const ROUTES = ["login", "catalogo", "carrinho", "perfil", "admin", "privacidade"];

const seedProducts = [
  product("anestt", "Anestt", "Anestesicos", "Bovinos, equinos, suinos, ovinos, caes e gatos", "SC: grandes animais 5 a 10 mL. Pequenos animais 1 a 3 mL por sitio de aplicacao.", "Frasco-ampola de 50 mL.", 4),
  product("apromazin-1-injetavel", "Apromazin 1% Injetavel", "Anestesicos", "Equinos", "IV, IM ou SC: 0,5 a 1,0 mL/100 kg.", "Frasco-ampola de 20 mL.", 4),
  product("cetamin", "Cetamin", "Anestesicos", "Equinos", "IV: 2,0 mL/100 kg associado a Detomidin conforme bula.", "Frasco-ampola de 10 e 50 mL.", 5),
  product("detomidin", "Detomidin", "Anestesicos", "Equinos", "IM ou IV: 0,2 a 0,4 mL/100 kg.", "Frasco-ampola de 5 mL e 10 mL.", 5),
  product("isoflurano-syntec", "Isoflurano Syntec", "Anestesicos", "Equinos, caes e gatos", "CAM equinos: 1,5% a 2,5%.", "Frasco de 100 mL e 240 mL.", 6),
  product("xilazin-2", "Xilazin 2%", "Anestesicos", "Bovinos", "IV bovinos: 0,25 a 0,75 mL/100 kg. IM bovinos: 0,25 a 1,5 mL/100 kg.", "Frasco-ampola de 10 mL e 50 mL.", 6),
  product("xilazin-10", "Xilazin 10%", "Anestesicos", "Equinos", "IM: dose 1 mL/50 kg. IV: dose 0,5 mL/50 kg.", "Frasco de 50 mL.", 7),
  product("get-vacina-syntec", "GET-Vacina Syntec", "Biologicos", "Equinos", "Intramuscular profunda. Reforcos conforme idade e condicao imunologica.", "Estojo contendo 10 frascos com 2 mL.", 8),
  product("diclofenaco-syntec", "Diclofenaco Syntec", "Anti-inflamatorios", "Bovinos, equinos, suinos, ovinos e caprinos", "IM, IV ou SC: 1 mL para cada 50 kg a cada 24 horas.", "Frasco-ampola de 50 mL.", 9),
  product("farmadex-injetavel", "Farmadex Injetavel", "Anti-inflamatorios", "Bovinos, equinos, suinos, ovinos e caprinos", "Bovinos e equinos: IV ou IM 5 a 15 mL. Outras especies conforme bula.", "Frasco-ampola de 10 e 50 mL.", 9),
  product("fenilbutazona-syntec", "Fenilbutazona Syntec", "Anti-inflamatorios", "Equinos", "IV: 1,1 a 2,2 mL/100 kg.", "Frasco-ampola conforme catalogo.", 10),
  product("luxol", "Luxol", "Anti-inflamatorios", "Equinos", "Uso topico: diariamente e conforme necessidade.", "Pote/pomada de uso topico.", 10),
  product("maxitec-injetavel", "Maxitec Injetavel", "Anti-inflamatorios", "Equinos", "Conforme orientacao de bula para quadros inflamatorios, dolorosos e febris.", "Frasco-ampola conforme catalogo.", 11),
  product("flobiotic-10", "Flobiotic 10%", "Antibioticos", "Bovinos e suinos", "IM: 0,5 mL/20 kg. Casos graves: 0,5 mL/10 kg.", "Frasco-ampola conforme catalogo.", 12),
  product("gentomicin", "Gentomicin", "Antibioticos", "Bovinos, equinos, suinos, aves e caprinos", "Bovinos: IM 2,2 a 6,6 mg/kg/dia. Demais especies conforme bula.", "Frasco-ampola conforme catalogo.", 12),
  product("gentomicin-mastite", "Gentomicin Mastite", "Antibioticos", "Vacas em lactacao", "Intramamaria: 1 aplicador/teto/dia por 3 dias.", "Bisnagas intramamarias.", 13),
  product("oxitetraciclina-la-20", "Oxitetraciclina L.A. 20% Injetavel", "Antibioticos", "Bovinos e suinos", "IM: 1 mL/10 kg.", "Frasco-ampola conforme catalogo.", 13),
  product("propen", "Propen", "Antibioticos", "Bovinos, equinos, suinos e ovinos", "IM: 10 mL/100 kg.", "Frasco-ampola conforme catalogo.", 14),
  product("sulfatrox", "Sulfatrox", "Antibioticos", "Bovinos, equinos e suinos", "IM: 1 a 1,5 mL/30 kg.", "Frasco-ampola conforme catalogo.", 14),
  product("cikadol", "Cikadol", "Especialidades", "Multiespecies", "Uso topico: aplicar 1 ou 2 vezes ao dia.", "Frasco spray/topico conforme catalogo.", 15),
  product("sealup", "Sealup", "Especialidades", "Vacas em periodo seco", "Intramamaria: 1 bisnaga/teto.", "Bisnagas intramamarias.", 16),
  product("duofor", "Duofor", "Higiene e Saude", "Ambientes", "Pulverizacao: diluicao 1:100 em agua. Imersao: 1:50 em agua.", "Frasco conforme catalogo.", 17),
  product("limpex", "Limpex", "Higiene e Saude", "Equinos", "Indicado para tratamento e prevencao de miiases e ferimentos, conforme bula.", "Frasco spray conforme catalogo.", 17),
  product("synmectin", "Synmectin", "Endectocidas", "Bovinos, suinos e ovinos", "Bovinos SC: 1 mL/50 kg. Suinos SC: 0,3 mL/50 kg. Ovinos SC: 0,2 mL/10 kg.", "Frasco conforme catalogo.", 18),
  product("taurus-sr", "T@urus SR", "Endectocidas", "Bovinos", "SC: 1 mL/50 kg. Agitar vigorosamente antes da aplicacao.", "Frasco conforme catalogo.", 18),
  product("ciperduo", "Ciperduo", "Ectoparasiticidas", "Bovinos", "Pour-on: 10 mL/100 kg.", "Frasco pour-on conforme catalogo.", 19),
  product("alnor-10", "Alnor 10%", "Antiparasitarios", "Bovinos e ovinos", "Bovinos oral: 3,75 a 7,5 mL/50 kg. Ovinos oral: 0,375 a 0,5 mL/10 kg.", "Frasco conforme catalogo.", 20),
  product("anequim-plus", "Anequim Plus", "Antiparasitarios", "Equinos", "Oral: 30 g/500 kg.", "Seringa/pasta oral conforme catalogo.", 20),
  product("equimectin", "Equimectin", "Antiparasitarios", "Equinos", "Oral: 20 g/100 kg.", "Seringa/pasta oral conforme catalogo.", 21),
  product("multisyn-180", "Multisyn 180", "Suplementos", "Bovinos", "Bezerros: 1 mL/50 kg. Bovinos adultos: 1 mL/100 kg.", "Frasco de 250 mL e 500 mL.", 22),
  product("creatina-90-syntec", "Creatina 90 Syntec", "Suplementos", "Equinos", "Dose inicial: 100 g/dia por 14 dias. Manutencao: 35 g/dia.", "Frascos de 500 g e 2 kg.", 22),
  product("ade-syntec", "ADE Syntec", "Vitaminicos e Minerais", "Bovinos, suinos, ovinos e caprinos", "Bovinos IM ou SC: 0,5 a 5 mL. Demais especies conforme bula.", "Frasco conforme catalogo.", 24),
  product("dosecal", "Dosecal", "Vitaminicos e Minerais", "Bovinos e equinos", "IV: 40 mL/50 kg.", "Frasco conforme catalogo.", 25),
  product("dosefer", "Dosefer", "Vitaminicos e Minerais", "Bovinos, equinos, suinos, ovinos e caprinos", "Bovinos IV: 40 mL/50 kg. Demais especies conforme bula.", "Frasco conforme catalogo.", 25),
  product("vitapulmin-gel", "Vitapulmin Gel", "Broncodilatadores", "Equinos", "Oral: 4 mL/125 kg a cada 12 horas.", "Bisnaga/gel oral conforme catalogo.", 26),
  product("equi-boost", "Equi-Boost", "Hormonios", "Equinos", "IM: 2,2 mL/100 kg.", "Frasco conforme catalogo.", 27),
  product("ocitocina-syntec", "Ocitocina Syntec", "Hormonios", "Bovinos, equinos e suinos", "Bovinos e equinos: IM ou IV 3 a 5 mL/animal. Suinos: SC 1 a 2 mL.", "Frasco conforme catalogo.", 27),
];

const state = {
  products: [],
  users: [],
  session: null,
  cart: {},
  orders: [],
  settings: {},
  chat: [],
  route: "catalogo",
  category: "Todos",
  query: "",
  selectedProduct: null,
};

function product(id, name, category, indication, dose, presentation, page) {
  return {
    id,
    name,
    category,
    brand: "Syntec",
    indication,
    dose,
    presentation,
    page,
    price: null,
    stock: 0,
    active: true,
    image: `/assets/products/${id}.jpg`,
    pageImage: `/assets/catalog/page-${String(page).padStart(2, "0")}.png`,
    description: `${name} integra a linha ${category.toLowerCase()} Syntec para grandes animais. Consulte sempre a bula e a orientacao do medico-veterinario.`,
    faq: [
      ["Para quais animais e indicado?", indication],
      ["Qual a apresentacao?", presentation],
      ["Qual a posologia resumida?", dose],
    ],
  };
}

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seed() {
  if (!localStorage.getItem(STORE.products)) write(STORE.products, seedProducts);
  if (!localStorage.getItem(STORE.users)) {
    write(STORE.users, [
      {
        id: "admin",
        role: "admin",
        fullName: "Representante SyntecVet",
        email: "representante@syntecvet.local",
        phone: CONFIG.salesRepWhatsapp || "5571999216734",
        password: "admin123",
        createdAt: new Date().toISOString(),
      },
      {
        id: "cliente-demo",
        role: "customer",
        fullName: "Cliente SyntecVet",
        email: "cliente@syntecvet.local",
        phone: "71999990000",
        password: "cliente123",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(STORE.settings)) {
    write(STORE.settings, {
      representativeName: "Representante SyntecVet",
      whatsapp: CONFIG.salesRepWhatsapp || "5571999216734",
    });
  }
  state.products = read(STORE.products, seedProducts);
  state.users = read(STORE.users, []);
  state.session = read(STORE.session, null);
  state.cart = read(STORE.cart, {});
  state.orders = read(STORE.orders, []);
  state.settings = read(STORE.settings, {});
  state.chat = read(STORE.chat, []);
}

function save() {
  write(STORE.products, state.products);
  write(STORE.users, state.users);
  write(STORE.session, state.session);
  write(STORE.cart, state.cart);
  write(STORE.orders, state.orders);
  write(STORE.settings, state.settings);
  write(STORE.chat, state.chat);
}

function money(value) {
  if (value === null || value === undefined || value === "") return "Sob consulta";
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function slugId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function currentUser() {
  if (!state.session) return null;
  return state.users.find((user) => user.id === state.session.userId) || null;
}

function categories() {
  return ["Todos", ...Array.from(new Set(state.products.map((item) => item.category))).sort()];
}

function cartItems() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const productItem = state.products.find((item) => item.id === id);
      return productItem ? { ...productItem, quantity } : null;
    })
    .filter(Boolean);
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
}

function setRoute(route) {
  state.route = route;
  location.hash = route;
  render();
}

function initialRoute() {
  const hashRoute = location.hash.replace("#", "");
  if (ROUTES.includes(hashRoute)) return hashRoute;

  const pathRoute = location.pathname.replace(/^\/+|\/+$/g, "").split("/").pop();
  if (ROUTES.includes(pathRoute)) return pathRoute;

  return "catalogo";
}

function hasAuthCallback() {
  return (
    location.search.includes("code=") ||
    location.search.includes("error=") ||
    location.hash.includes("access_token=") ||
    location.hash.includes("error=")
  );
}

function cleanAuthCallbackUrl() {
  if (hasAuthCallback()) {
    history.replaceState({}, "", `${location.origin}${location.pathname}`);
  }
}

function shouldSyncSupabaseSession() {
  return state.route === "login" || state.route === "admin" || hasAuthCallback();
}

function render() {
  document.querySelector("#cartBadge").hidden = cartCount() === 0;
  document.querySelector("#cartBadge").textContent = String(cartCount());
  const adminNav = document.querySelector("#navProfile");
  const user = currentUser();
  adminNav.hidden = user?.role !== "admin";
  adminNav.textContent = "Admin";

  const app = document.querySelector("#app");
  if (state.route === "login") app.innerHTML = renderLogin();
  if (state.route === "catalogo") app.innerHTML = renderCatalog();
  if (state.route === "carrinho") app.innerHTML = renderCart();
  if (state.route === "perfil") app.innerHTML = currentUser()?.role === "admin" ? renderAdmin() : renderCatalog();
  if (state.route === "admin") app.innerHTML = currentUser()?.role === "admin" ? renderAdmin() : renderLogin();
  if (state.route === "privacidade") app.innerHTML = renderPrivacy();
  mountIcons();
}

function renderCatalog() {
  const visible = state.products.filter((item) => {
    const matchCategory = state.category === "Todos" || item.category === state.category;
    const matchQuery = `${item.name} ${item.category} ${item.indication}`.toLowerCase().includes(state.query.toLowerCase());
    return item.active && matchCategory && matchQuery;
  });

  return `
    <section class="hero">
      <img src="/assets/catalog/page-01.png" alt="" />
      <div class="hero-copy">
        <h1>Catalogo digital</h1>
      </div>
    </section>

    <section class="toolbar">
      <label class="search-box">
        <span data-icon="search"></span>
        <input id="searchInput" value="${escapeHtml(state.query)}" type="search" placeholder="Buscar produto, especie ou categoria" />
      </label>
      <div class="segmented" role="tablist">
        ${categories()
          .map(
            (category) => `
              <button class="${category === state.category ? "is-active" : ""}" type="button" data-category="${category}">
                ${category}
              </button>`,
          )
          .join("")}
      </div>
    </section>

    <section class="catalog-grid">
      ${visible.map(renderProductCard).join("")}
    </section>
    ${state.selectedProduct ? renderProductDrawer(state.selectedProduct) : ""}
  `;
}

function renderProductCard(item) {
  const quantity = state.cart[item.id] || 0;
  return `
    <article class="product-card">
      <button class="image-button" data-detail="${item.id}" type="button" aria-label="Ver ${item.name}">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </button>
      <div class="product-body">
        <div class="product-meta">
          <span>${item.category}</span>
          <strong>${money(item.price)}</strong>
        </div>
        <h2>${item.name}</h2>
        <p>${item.indication}</p>
        <div class="quantity-row">
          <button class="icon-button soft" type="button" data-dec="${item.id}" aria-label="Diminuir ${item.name}">
            <span data-icon="minus"></span>
          </button>
          <output>${quantity}</output>
          <button class="icon-button soft" type="button" data-inc="${item.id}" aria-label="Aumentar ${item.name}">
            <span data-icon="plus"></span>
          </button>
          <button class="add-button" type="button" data-add="${item.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `;
}

function renderProductDrawer(id) {
  const item = state.products.find((productItem) => productItem.id === id);
  if (!item) return "";
  return `
    <div class="modal-backdrop" data-close-detail></div>
    <aside class="drawer" aria-label="Detalhes do produto">
      <div class="drawer-head">
        <div>
          <span>${item.category}</span>
          <h2>${item.name}</h2>
        </div>
        <button class="icon-button ghost" type="button" data-close-detail aria-label="Fechar">
          <span data-icon="close"></span>
        </button>
      </div>
      <img class="drawer-image" src="${item.image}" alt="${item.name}" />
      <dl class="detail-list">
        <div><dt>Preco</dt><dd>${money(item.price)}</dd></div>
        <div><dt>Indicacao</dt><dd>${item.indication}</dd></div>
        <div><dt>Posologia</dt><dd>${item.dose}</dd></div>
        <div><dt>Apresentacao</dt><dd>${item.presentation}</dd></div>
      </dl>
      <button class="primary-button" type="button" data-add="${item.id}">Adicionar ao carrinho</button>
    </aside>
  `;
}

function renderLogin() {
  return `
    <section class="auth-layout">
      <div class="auth-card">
        <h1 id="authTitle">Acesso do representante</h1>
        <p>Entre para atualizar produtos, precos, imagens e WhatsApp comercial.</p>
        <button class="google-button" type="button" id="googleLogin">
          <span class="google-mark">G</span>
          Entrar com Google
        </button>
        <div class="divider"><span>ou</span></div>
        <form id="authForm" class="form-stack">
          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="password">Senha</label>
            <div class="password-field">
              <input id="password" name="password" type="password" autocomplete="current-password" required />
              <button type="button" class="icon-button ghost" id="togglePassword" aria-label="Mostrar senha" title="Mostrar senha">
                <span data-icon="eye"></span>
              </button>
            </div>
          </div>
          <button class="primary-button" id="authSubmit" type="submit">Entrar</button>
          <button class="link-button" type="button" data-route="catalogo">Voltar ao catalogo</button>
          <button class="link-button" type="button" data-route="privacidade">Privacidade e LGPD</button>
        </form>
      </div>
    </section>
  `;
}

function renderPrivacy() {
  return `
    <section class="page-band">
      <div>
        <span>Privacidade e LGPD</span>
        <h1>Tratamento de dados</h1>
      </div>
      <button class="secondary-button" type="button" data-route="${currentUser() ? "perfil" : "login"}">Voltar</button>
    </section>
    <section class="privacy-grid">
      <article class="panel">
        <h2>Dados usados</h2>
        <ul class="privacy-list">
          <li>Nome, WhatsApp, CEP/endereco e produtos escolhidos no carrinho.</li>
          <li>Esses dados sao informados somente no fechamento do pedido.</li>
          <li>O cliente nao precisa criar conta para comprar nesta fase inicial.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Finalidade</h2>
        <ul class="privacy-list">
          <li>Montar a mensagem do pedido.</li>
          <li>Enviar os dados ao WhatsApp comercial do representante.</li>
          <li>Permitir contato para confirmacao, entrega e atendimento.</li>
          <li>Responder duvidas sobre produtos pelo assistente virtual.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Protecao</h2>
        <ul class="privacy-list">
          <li>Coleta limitada aos dados essenciais do pedido.</li>
          <li>Pedidos nao ficam salvos como historico de cliente no sistema nesta fase.</li>
          <li>O acesso administrativo e restrito ao representante.</li>
          <li>O site usa HTTPS e politicas de seguranca no deploy.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Direitos do cliente</h2>
        <ul class="privacy-list">
          <li>Conferir e corrigir os dados antes de enviar o pedido.</li>
          <li>Solicitar atendimento humano pelo WhatsApp.</li>
          <li>Pedir ao representante correcao ou exclusao de dados que tenham ficado na conversa comercial.</li>
          <li>Solicitar informacoes sobre o uso dos dados do pedido.</li>
        </ul>
      </article>
    </section>
  `;
}

function renderProfile() {
  const user = currentUser();
  return `
    <section class="page-band">
      <div>
        <span>Perfil</span>
        <h1>${user.fullName}</h1>
      </div>
      ${user.role === "admin" ? `<button class="primary-button" type="button" data-route="admin">Painel admin</button>` : ""}
    </section>
    <section class="split-layout">
      <form id="profileForm" class="panel form-grid">
        ${inputField("profileName", "Nome", user.fullName || "")}
        ${inputField("profilePhone", "WhatsApp", user.phone || "", "tel", "Ex: 71999998888", "Use somente numeros, com DDD. Ex: 71999998888 ou 5571999998888.")}
        ${inputField("profileZip", "CEP", user.zipCode || "", "text", "00000-000")}
        ${inputField("profileStreet", "Rua", user.street || "")}
        ${inputField("profileNumber", "Numero", user.addressNumber || "")}
        ${inputField("profileComplement", "Complemento", user.addressComplement || "")}
        ${inputField("profileNeighborhood", "Bairro", user.neighborhood || "")}
        ${inputField("profileCity", "Cidade", user.city || "")}
        ${inputField("profileState", "UF", user.state || "")}
        <button class="primary-button full" type="submit">Salvar perfil</button>
      </form>
      <div class="panel">
        <h2>Ultimos pedidos</h2>
        <div class="orders-list">
          ${state.orders
            .filter((order) => order.userId === user.id)
            .slice(-6)
            .reverse()
            .map(renderOrderMini)
            .join("") || `<p class="muted">Nenhum pedido registrado.</p>`}
        </div>
      </div>
    </section>
    <section class="panel privacy-panel">
      <div>
        <span class="eyebrow">LGPD</span>
        <h2>Privacidade e dados pessoais</h2>
        <p class="muted">Consentimento: ${user.privacyConsentAt ? new Date(user.privacyConsentAt).toLocaleString("pt-BR") : "nao registrado"}.</p>
      </div>
      <div class="data-actions">
        <button class="secondary-button" type="button" data-route="privacidade">Ver politica</button>
        <button class="secondary-button" type="button" id="exportDataButton">Exportar meus dados</button>
        <button class="danger-button" type="button" id="requestDeletionButton">Solicitar exclusao</button>
        <button class="link-button" type="button" id="clearLocalDataButton">Limpar este dispositivo</button>
      </div>
    </section>
  `;
}

function inputField(id, label, value, type = "text", placeholder = "", help = "") {
  return `
    <label class="field" for="${id}">
      <span>${label}</span>
      <input id="${id}" type="${type}" value="${escapeHtml(value)}" placeholder="${placeholder}" ${type === "tel" ? 'inputmode="numeric"' : ""} />
      ${help ? `<small>${help}</small>` : ""}
    </label>
  `;
}

function renderCart() {
  const items = cartItems();
  return `
    <section class="page-band">
      <div>
        <span>Carrinho</span>
        <h1>${items.length ? `${items.length} produto(s) selecionado(s)` : "Seu carrinho esta vazio"}</h1>
      </div>
      <button class="secondary-button" type="button" data-route="catalogo">Continuar comprando</button>
    </section>
    <section class="cart-layout">
      <div class="panel cart-items">
        ${items.map(renderCartItem).join("") || `<p class="muted">Escolha produtos no catalogo para montar o pedido.</p>`}
      </div>
      <aside class="panel checkout-panel">
        <h2>Dados para envio</h2>
        <p class="muted">Preencha apenas os dados necessarios para o representante receber o pedido no WhatsApp.</p>
        <form id="checkoutForm" class="form-stack">
          ${inputField("checkoutName", "Nome completo", "", "text", "Nome do cliente")}
          ${inputField("checkoutPhone", "WhatsApp", "", "tel", "Ex: 71999998888", "Use somente numeros, com DDD. Ex: 71999998888 ou 5571999998888.")}
          ${inputField("checkoutZip", "CEP", "", "text", "00000-000")}
          ${inputField("checkoutStreet", "Rua", "")}
          ${inputField("checkoutNumber", "Numero", "")}
          ${inputField("checkoutComplement", "Complemento", "")}
          ${inputField("checkoutNeighborhood", "Bairro", "")}
          ${inputField("checkoutCity", "Cidade", "")}
          ${inputField("checkoutState", "UF", "")}
          <label class="checkbox-field">
            <input id="checkoutPrivacy" type="checkbox" required />
            <span>Estou ciente de que meus dados serao usados somente para montar este pedido e enviar ao WhatsApp do representante.</span>
          </label>
          <button class="link-button compact-link" type="button" data-route="privacidade">Ver aviso de privacidade</button>
          <div class="summary-row"><span>Total</span><strong>${money(cartTotal())}</strong></div>
          <button class="primary-button" type="submit" ${items.length ? "" : "disabled"}>Enviar pedido no WhatsApp</button>
        </form>
      </aside>
    </section>
  `;
}

function renderCartItem(item) {
  return `
    <article class="cart-line">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h2>${item.name}</h2>
        <p>${item.category} - ${money(item.price)}</p>
      </div>
      <div class="quantity-row tight">
        <button class="icon-button soft" type="button" data-dec="${item.id}" aria-label="Diminuir"><span data-icon="minus"></span></button>
        <output>${item.quantity}</output>
        <button class="icon-button soft" type="button" data-inc="${item.id}" aria-label="Aumentar"><span data-icon="plus"></span></button>
      </div>
    </article>
  `;
}

function renderAdmin() {
  const alerts = humanAlerts();
  return `
    <section class="page-band">
      <div>
        <span>Painel do representante</span>
        <h1>Dashboard SyntecVet</h1>
      </div>
      <button class="secondary-button" type="button" id="logoutButton">Sair</button>
    </section>
    <section class="admin-grid">
      ${metric("Produtos ativos", state.products.filter((item) => item.active).length)}
      ${metric("Categorias", categories().length - 1)}
      ${metric("Alertas humanos", state.chat.filter((item) => item.needsHuman && !item.handled).length)}
      ${metric("Modo", "Fase 1")}
    </section>
    <section class="admin-layout">
      <div class="panel">
        <h2>Fluxo atual</h2>
        <p class="muted">Clientes nao precisam criar conta. Eles escolhem os produtos, preenchem nome, WhatsApp e endereco no carrinho, e o pedido e enviado direto para o WhatsApp do representante.</p>
        <p class="muted">Nesta fase, o sistema nao salva historico de clientes nem pedidos no banco.</p>
      </div>
      <form id="settingsForm" class="panel form-stack">
        <h2>Representante</h2>
        ${inputField("settingsName", "Nome", state.settings.representativeName || "")}
        ${inputField("settingsWhatsapp", "WhatsApp", state.settings.whatsapp || "", "tel", "5571999216734", "Use codigo do pais + DDD + numero. Ex: 5571999216734.")}
        <button class="primary-button" type="submit">Salvar WhatsApp</button>
      </form>
    </section>
    <section class="panel">
      <h2>Atualizar produtos</h2>
      <div class="product-admin-list">
        ${state.products.map(renderAdminProduct).join("")}
      </div>
    </section>
    <section class="admin-layout">
      <div class="panel">
        <h2>Mensagens para atendimento</h2>
        <div class="table-list">
          ${alerts.slice(-8).reverse().map(renderHumanAlert).join("") || `<p class="muted">Nenhum alerta humano.</p>`}
        </div>
      </div>
    </section>
  `;
}

function metric(label, value) {
  return `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`;
}

function renderBar(name, value, max) {
  const width = Math.max(6, Math.round((value / max) * 100));
  return `<div class="bar-row"><span>${name}</span><strong>${value}</strong><i style="width:${width}%"></i></div>`;
}

function renderAdminProduct(item) {
  return `
    <article class="admin-product">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong>
        <span>${item.category}</span>
      </div>
      <label>Preco<input type="number" step="0.01" min="0" value="${item.price ?? ""}" data-admin-price="${item.id}" placeholder="0,00" /></label>
      <label>Estoque<input type="number" step="1" min="0" value="${item.stock || 0}" data-admin-stock="${item.id}" /></label>
      <label>Imagem URL<input type="url" value="${escapeHtml(item.image)}" data-admin-image="${item.id}" /></label>
      <label class="switch"><input type="checkbox" ${item.active ? "checked" : ""} data-admin-active="${item.id}" /><span>Ativo</span></label>
      <button class="secondary-button" type="button" data-save-product="${item.id}">Salvar</button>
    </article>
  `;
}

function humanAlerts() {
  return state.chat
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.needsHuman && !item.handled);
}

function privacyRequests() {
  return state.users.filter((user) => user.dataDeletionRequestedAt && !user.dataDeletionHandledAt);
}

function renderPrivacyRequest(user) {
  const phoneLabel = user.phone ? formatPhone(user.phone) : "Telefone nao cadastrado";
  return `
    <div class="alert-item">
      <strong>${escapeHtml(user.fullName || user.email || "Cliente")}</strong>
      <span>Solicitou exclusao/revogacao de consentimento em ${new Date(user.dataDeletionRequestedAt).toLocaleString("pt-BR")}.</span>
      <small>${escapeHtml(user.email || "")} ${phoneLabel ? `- ${phoneLabel}` : ""}</small>
      <div class="alert-actions">
        <button class="secondary-button" type="button" data-lgpd-whatsapp="${user.id}" ${user.phone ? "" : "disabled"}>Responder no WhatsApp</button>
        <button class="primary-button" type="button" data-resolve-lgpd="${user.id}">Marcar como tratado</button>
      </div>
    </div>
  `;
}

function renderHumanAlert({ item, index }) {
  const customer = alertCustomer(item);
  const phone = customer?.phone || item.customerPhone || "";
  const phoneLabel = phone ? formatPhone(phone) : "Telefone nao cadastrado";
  return `
    <div class="alert-item">
      <strong>${escapeHtml(item.customer || customer?.fullName || "Cliente")}</strong>
      <span>${escapeHtml(item.message)}</span>
      <small>${phoneLabel}</small>
      <div class="alert-actions">
        <button class="secondary-button" type="button" data-alert-whatsapp="${index}" ${phone ? "" : "disabled"}>Responder no WhatsApp</button>
        <button class="primary-button" type="button" data-resolve-alert="${index}">Marcar como resolvido</button>
      </div>
    </div>
  `;
}

function alertCustomer(item) {
  const customerId = item.customerId || "";
  const customerEmail = String(item.customerEmail || item.customer || "").toLowerCase();
  const customerName = String(item.customer || "").toLowerCase();
  return state.users.find((user) => {
    return (
      user.id === customerId ||
      String(user.email || "").toLowerCase() === customerEmail ||
      String(user.fullName || "").toLowerCase() === customerName
    );
  });
}

function formatPhone(phone) {
  const clean = String(phone || "").replace(/\D/g, "");
  if (!clean) return "";
  if (clean.length === 13) return `+${clean.slice(0, 2)} (${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`;
  if (clean.length === 11) return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  return clean;
}

function renderOrderMini(order) {
  return `
    <article class="order-mini">
      <strong>Pedido ${order.id.slice(0, 8)}</strong>
      <span>${new Date(order.createdAt).toLocaleDateString("pt-BR")} - ${money(order.total)}</span>
      <small>${order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</small>
    </article>
  `;
}

function productStats() {
  const map = new Map();
  state.orders.forEach((order) => {
    order.items.forEach((item) => {
      map.set(item.id, {
        name: item.name,
        quantity: (map.get(item.id)?.quantity || 0) + item.quantity,
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

function customerStats() {
  return state.users
    .filter((user) => user.role === "customer")
    .map((user) => {
      const orders = state.orders.filter((order) => order.userId === user.id);
      return {
        name: user.fullName || user.email,
        orders: orders.length,
        quantity: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
      };
    })
    .sort((a, b) => b.orders - a.orders);
}

async function lookupCep(zip) {
  const clean = zip.replace(/\D/g, "");
  if (clean.length !== 8) throw new Error("Digite um CEP com 8 numeros.");
  const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  const data = await response.json();
  if (!response.ok || data.erro) throw new Error("CEP nao encontrado.");
  return {
    zipCode: clean,
    street: data.logradouro || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    state: data.uf || "",
  };
}

function applyAddress(prefix, address) {
  setValue(`${prefix}Zip`, address.zipCode);
  setValue(`${prefix}Street`, address.street);
  setValue(`${prefix}Neighborhood`, address.neighborhood);
  setValue(`${prefix}City`, address.city);
  setValue(`${prefix}State`, address.state);
}

function setValue(id, value) {
  const input = document.querySelector(`#${id}`);
  if (input) input.value = value || "";
}

function updateCart(id, nextQuantity) {
  const quantity = Math.max(0, nextQuantity);
  if (quantity === 0) delete state.cart[id];
  else state.cart[id] = quantity;
  save();
  render();
}

function addToCart(id) {
  updateCart(id, (state.cart[id] || 0) + 1);
  toast("Produto adicionado ao carrinho.");
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.append(node);
  setTimeout(() => node.remove(), 2800);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bindEvents() {
  document.addEventListener("click", async (event) => {
    const target = event.target.closest("button, [data-category], [data-route], [data-detail], [data-close-detail]");
    if (!target) return;

    if (target.id === "navCatalog") setRoute("catalogo");
    if (target.id === "navCart") setRoute("carrinho");
    if (target.id === "navProfile") setRoute(currentUser()?.role === "admin" ? "admin" : "login");
    if (target.dataset.route) setRoute(target.dataset.route);
    if (target.dataset.category) {
      state.category = target.dataset.category;
      render();
    }
    if (target.dataset.add) addToCart(target.dataset.add);
    if (target.dataset.inc) updateCart(target.dataset.inc, (state.cart[target.dataset.inc] || 0) + 1);
    if (target.dataset.dec) updateCart(target.dataset.dec, (state.cart[target.dataset.dec] || 0) - 1);
    if (target.dataset.detail) {
      state.selectedProduct = target.dataset.detail;
      render();
    }
    if (target.dataset.closeDetail !== undefined) {
      state.selectedProduct = null;
      render();
    }
    if (target.id === "toggleAuth") toggleAuthMode();
    if (target.id === "togglePassword") togglePassword();
    if (target.id === "googleLogin") loginWithGoogle();
    if (target.id === "logoutButton") logout();
    if (target.id === "exportDataButton") exportMyData();
    if (target.id === "requestDeletionButton") requestDataDeletion();
    if (target.id === "clearLocalDataButton") clearLocalData();
    if (target.dataset.saveProduct) saveProduct(target.dataset.saveProduct);
    if (target.dataset.alertWhatsapp) replyHumanAlert(Number(target.dataset.alertWhatsapp));
    if (target.dataset.resolveAlert) resolveHumanAlert(Number(target.dataset.resolveAlert));
    if (target.dataset.lgpdWhatsapp) replyPrivacyRequest(target.dataset.lgpdWhatsapp);
    if (target.dataset.resolveLgpd) resolvePrivacyRequest(target.dataset.resolveLgpd);
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "searchInput") {
      state.query = event.target.value;
      const cursor = event.target.selectionStart;
      render();
      requestAnimationFrame(() => {
        const input = document.querySelector("#searchInput");
        if (input) {
          input.focus();
          input.setSelectionRange(cursor, cursor);
        }
      });
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "authForm") handleAuth(event);
    if (event.target.id === "profileForm") handleProfile(event);
    if (event.target.id === "checkoutForm") handleCheckout(event);
    if (event.target.id === "settingsForm") handleSettings(event);
    if (event.target.id === "chatForm") handleChat(event);
  });

  document.addEventListener("blur", async (event) => {
    if (event.target.id === "profileZip") await autoCep(event.target.value, "profile");
    if (event.target.id === "checkoutZip") await autoCep(event.target.value, "checkout");
  }, true);

  document.querySelector("#chatToggle").addEventListener("click", openChat);
  document.querySelector("#chatClose").addEventListener("click", closeChat);
}

function toggleAuthMode() {
  toast("Nesta fase, clientes enviam pedidos sem criar conta.");
}

function togglePassword() {
  const input = document.querySelector("#password");
  const button = document.querySelector("#togglePassword");
  input.type = input.type === "password" ? "text" : "password";
  button.title = input.type === "password" ? "Mostrar senha" : "Ocultar senha";
  button.setAttribute("aria-label", button.title);
  button.innerHTML = input.type === "password" ? iconMarkup("eye") : iconMarkup("eye-off");
}

async function handleAuth(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey) {
    await handleSupabaseEmailAuth(email, password);
    return;
  }

  const user = state.users.find((item) => item.email === email && item.password === password);
  if (!user) return toast("E-mail ou senha invalidos.");
  if (user.role !== "admin") return toast("Acesso restrito ao representante.");
  state.session = { userId: user.id };
  save();
  setRoute("admin");
}

async function handleSupabaseEmailAuth(email, password) {
  try {
    const client = await loadSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const authUser = data.user;
    const profile = await fetchSupabaseProfile(client, authUser.id);
    const localUser = upsertSupabaseUser(authUser, profile);
    if (localUser.role !== "admin") {
      await client.auth.signOut();
      state.session = null;
      save();
      setRoute("catalogo");
      toast("Usuario autenticado, mas ainda nao esta marcado como admin.");
      return;
    }
    state.session = { userId: localUser.id };
    save();
    setRoute("admin");
  } catch (error) {
    toast(authErrorMessage(error));
  }
}

function authErrorMessage(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "E-mail ou senha invalidos no Supabase.";
  }

  if (message.includes("email not confirmed")) {
    return "Este e-mail ainda nao foi confirmado no Supabase.";
  }

  if (message.includes("user not found")) {
    return "Usuario nao encontrado no Supabase.";
  }

  if (message.includes("too many") || message.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }

  return error?.message || "Nao foi possivel autenticar.";
}

function loginWithGoogle() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) {
    toast("Configure Supabase em config.js para ativar Google.");
    return;
  }
  loadSupabase()
    .then((client) =>
      client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/login` },
      }),
    )
    .catch(() => toast("Nao foi possivel iniciar login com Google."));
}

function loadSupabase() {
  return new Promise((resolve, reject) => {
    if (supabaseClient) {
      resolve(supabaseClient);
      return;
    }
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      resolve(supabaseClient);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = () => {
      supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      resolve(supabaseClient);
    };
    script.onerror = reject;
    document.head.append(script);
  });
}

async function syncSupabaseSession() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return;
  const shouldShowLoginError = state.route === "login" || state.route === "admin" || hasAuthCallback();

  try {
    const client = await loadSupabase();
    const { data } = await client.auth.getSession();
    const authUser = data.session?.user;
    if (!authUser) {
      cleanAuthCallbackUrl();
      return;
    }

    const profile = await fetchSupabaseProfile(client, authUser.id);
    const localUser = upsertSupabaseUser(authUser, profile);
    if (localUser.role !== "admin") {
      await client.auth.signOut();
      state.session = null;
      save();
      cleanAuthCallbackUrl();
      setRoute("catalogo");
      if (shouldShowLoginError) toast("Acesso restrito ao representante.");
      return;
    }
    state.session = { userId: localUser.id };
    save();

    cleanAuthCallbackUrl();

    if (state.route === "login") setRoute("admin");
    else render();
  } catch {
    cleanAuthCallbackUrl();
    if (shouldShowLoginError) toast("Nao foi possivel concluir o login com Google.");
  }
}

async function fetchSupabaseProfile(client, userId) {
  const { data } = await client
    .from("profiles")
    .select("full_name,email,phone,zip_code,street,neighborhood,city,state,address_number,address_complement,role,avatar_url,privacy_consent_at,privacy_version,data_deletion_requested_at,data_deletion_handled_at")
    .eq("id", userId)
    .maybeSingle();
  return data || {};
}

function upsertSupabaseUser(authUser, profile) {
  const email = String(profile.email || authUser.email || "").toLowerCase();
  let user = state.users.find((item) => item.id === authUser.id || item.email === email);
  if (!user) {
    user = { id: authUser.id, createdAt: new Date().toISOString() };
    state.users.push(user);
  }

  Object.assign(user, {
    id: authUser.id,
    role: profile.role || user.role || "customer",
    email,
    fullName: profile.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || email,
    phone: profile.phone || user.phone || "",
    zipCode: profile.zip_code || user.zipCode || "",
    street: profile.street || user.street || "",
    neighborhood: profile.neighborhood || user.neighborhood || "",
    city: profile.city || user.city || "",
    state: profile.state || user.state || "",
    addressNumber: profile.address_number || user.addressNumber || "",
    addressComplement: profile.address_complement || user.addressComplement || "",
    avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || "",
    privacyConsentAt: profile.privacy_consent_at || authUser.user_metadata?.privacy_consent_at || user.privacyConsentAt || "",
    privacyVersion: profile.privacy_version || authUser.user_metadata?.privacy_version || user.privacyVersion || "",
    dataDeletionRequestedAt: profile.data_deletion_requested_at || user.dataDeletionRequestedAt || "",
    dataDeletionHandledAt: profile.data_deletion_handled_at || user.dataDeletionHandledAt || "",
    provider: "google",
  });

  return user;
}

async function syncSupabaseProfile(user, extra = {}) {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !user?.id || user.id === "admin" || user.id === "cliente-demo") return;
  try {
    const client = await loadSupabase();
    await client
      .from("profiles")
      .update({
        full_name: user.fullName || "",
        email: user.email || "",
        phone: String(user.phone || "").replace(/\D/g, ""),
        zip_code: user.zipCode || "",
        street: user.street || "",
        neighborhood: user.neighborhood || "",
        city: user.city || "",
        state: user.state || "",
        address_number: user.addressNumber || "",
        address_complement: user.addressComplement || "",
        privacy_consent_at: user.privacyConsentAt || null,
        privacy_version: user.privacyVersion || PRIVACY_VERSION,
        data_deletion_requested_at: user.dataDeletionRequestedAt || null,
        data_deletion_handled_at: user.dataDeletionHandledAt || null,
        ...extra,
      })
      .eq("id", user.id);
  } catch {
    // O perfil local continua disponivel mesmo se a sincronizacao remota falhar.
  }
}

async function logout() {
  if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey) {
    loadSupabase().then((client) => client.auth.signOut()).catch(() => {});
  }
  state.session = null;
  save();
  setRoute("catalogo");
}

async function autoCep(value, prefix) {
  if (!value.trim()) return;
  try {
    const address = await lookupCep(value);
    applyAddress(prefix, address);
    toast("Endereco preenchido pelo CEP.");
  } catch (error) {
    toast(error.message || "Erro ao consultar CEP.");
  }
}

async function handleProfile(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) return;
  Object.assign(user, {
    fullName: value("profileName"),
    phone: value("profilePhone").replace(/\D/g, ""),
    zipCode: value("profileZip").replace(/\D/g, ""),
    street: value("profileStreet"),
    addressNumber: value("profileNumber"),
    addressComplement: value("profileComplement"),
    neighborhood: value("profileNeighborhood"),
    city: value("profileCity"),
    state: value("profileState"),
  });
  await syncSupabaseProfile(user);
  save();
  toast("Perfil atualizado.");
  render();
}

function value(id) {
  return document.querySelector(`#${id}`)?.value.trim() || "";
}

async function handleCheckout(event) {
  event.preventDefault();
  const items = cartItems();
  if (!items.length) return;

  const customerName = value("checkoutName");
  const customerPhone = value("checkoutPhone").replace(/\D/g, "");
  const address = {
    zipCode: value("checkoutZip").replace(/\D/g, ""),
    street: value("checkoutStreet"),
    number: value("checkoutNumber"),
    complement: value("checkoutComplement"),
    neighborhood: value("checkoutNeighborhood"),
    city: value("checkoutCity"),
    state: value("checkoutState"),
  };
  if (!customerName || !customerPhone || !address.zipCode || !address.street || !address.number) {
    toast("Preencha nome, WhatsApp, CEP, rua e numero.");
    return;
  }
  if (!document.querySelector("#checkoutPrivacy")?.checked) {
    toast("Confirme o aviso de privacidade para enviar o pedido.");
    return;
  }

  const shippingAddress = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    `${address.city} - ${address.state}`,
    `CEP ${address.zipCode}`,
  ]
    .filter(Boolean)
    .join(", ");

  const order = {
    id: slugId(),
    userId: "",
    customerName,
    customerPhone,
    shippingAddress,
    total: cartTotal(),
    items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  state.cart = {};
  save();
  window.open(whatsappUrl(order), "_blank", "noopener,noreferrer");
  setRoute("catalogo");
  toast("Pedido enviado ao WhatsApp. Nenhum cadastro de cliente foi criado.");
}

function whatsappUrl(order) {
  const lines = [
    `ALERTA: Pedido SyntecVet ${order.id.slice(0, 8)}`,
    `Representante: ${state.settings.representativeName || "SyntecVet"}`,
    `Cliente: ${order.customerName}`,
    `Telefone: ${order.customerPhone || "Nao informado"}`,
    `Entrega: ${order.shippingAddress}`,
    "",
    ...order.items.map((item) => `${item.quantity}x ${item.name} - ${money(item.price)} cada`),
    "",
    `Total: ${money(order.total)}`,
  ];
  const phone = String(state.settings.whatsapp || CONFIG.salesRepWhatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function replyHumanAlert(index) {
  const item = state.chat[index];
  if (!item) return;
  const customer = alertCustomer(item);
  const phone = normalizeCustomerPhone(customer?.phone || item.customerPhone || "");
  if (!phone) {
    toast("Cliente sem telefone cadastrado.");
    return;
  }

  const message = [
    `Olá, ${item.customer || customer?.fullName || "tudo bem"}!`,
    `Sou ${state.settings.representativeName || "o representante SyntecVet"}.`,
    "Vi sua solicitação de atendimento no catálogo digital e estou entrando em contato para ajudar.",
  ].join("\n");

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function resolveHumanAlert(index) {
  const item = state.chat[index];
  if (!item) return;
  item.handled = true;
  item.handledAt = new Date().toISOString();
  save();
  toast("Alerta marcado como resolvido.");
  render();
}

function normalizeCustomerPhone(phone) {
  const clean = String(phone || "").replace(/\D/g, "");
  if (!clean) return "";
  if (clean.startsWith("55")) return clean;
  if (clean.length === 10 || clean.length === 11) return `55${clean}`;
  return clean;
}

function saveProduct(id) {
  const item = state.products.find((productItem) => productItem.id === id);
  if (!item) return;
  const priceValue = document.querySelector(`[data-admin-price="${id}"]`)?.value;
  item.price = priceValue === "" ? null : Number(priceValue);
  item.stock = Number(document.querySelector(`[data-admin-stock="${id}"]`)?.value || 0);
  item.image = document.querySelector(`[data-admin-image="${id}"]`)?.value || item.image;
  item.active = document.querySelector(`[data-admin-active="${id}"]`)?.checked || false;
  save();
  toast("Produto atualizado.");
  render();
}

function handleSettings(event) {
  event.preventDefault();
  state.settings.representativeName = value("settingsName");
  state.settings.whatsapp = value("settingsWhatsapp").replace(/\D/g, "");
  save();
  toast("Configuracao salva.");
  render();
}

function exportMyData() {
  const user = currentUser();
  if (!user) return;
  const { password, ...profile } = user;
  const payload = {
    exportedAt: new Date().toISOString(),
    app: PUBLIC_APP_URL,
    privacyVersion: PRIVACY_VERSION,
    profile,
    orders: state.orders.filter((order) => order.userId === user.id),
    chat: state.chat.filter((item) => item.customerId === user.id || item.customerEmail === user.email),
    cart: state.cart,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `syntecvet-dados-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Arquivo de dados gerado.");
}

async function requestDataDeletion() {
  const user = currentUser();
  if (!user) return;
  user.dataDeletionRequestedAt = new Date().toISOString();
  user.dataDeletionHandledAt = "";
  await syncSupabaseProfile(user);
  save();

  const message = [
    "SOLICITACAO LGPD - EXCLUSAO/REVOGACAO",
    `Cliente: ${user.fullName || user.email}`,
    `E-mail: ${user.email || "nao informado"}`,
    `WhatsApp: ${user.phone || "nao informado"}`,
    "Solicito a verificacao, exclusao ou revogacao do consentimento dos meus dados pessoais no sistema SyntecVet.",
  ].join("\n");
  window.open(representativeWhatsappUrl(message), "_blank", "noopener,noreferrer");
  toast("Solicitacao LGPD enviada ao representante.");
  render();
}

function clearLocalData() {
  const user = currentUser();
  if (!user) return;
  const confirmed = confirm("Limpar os dados deste dispositivo remove sessao, carrinho, historico local e cadastro local. Dados ja enviados ao banco/WhatsApp precisam ser tratados pelo representante.");
  if (!confirmed) return;
  state.orders = state.orders.filter((order) => order.userId !== user.id);
  state.chat = state.chat.filter((item) => item.customerId !== user.id && item.customerEmail !== user.email);
  state.users = state.users.filter((item) => item.id !== user.id);
  state.cart = {};
  state.session = null;
  save();
  setRoute("catalogo");
  toast("Dados locais removidos deste dispositivo.");
}

function representativeWhatsappUrl(message) {
  const phone = String(state.settings.whatsapp || CONFIG.salesRepWhatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function replyPrivacyRequest(userId) {
  const user = state.users.find((item) => item.id === userId);
  const phone = normalizeCustomerPhone(user?.phone || "");
  if (!phone) {
    toast("Cliente sem telefone cadastrado.");
    return;
  }
  const message = [
    `Ola, ${user.fullName || "tudo bem"}!`,
    `Sou ${state.settings.representativeName || "o representante SyntecVet"}.`,
    "Recebi sua solicitacao LGPD e vou tratar seu pedido de privacidade.",
  ].join("\n");
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

async function resolvePrivacyRequest(userId) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) return;
  user.dataDeletionHandledAt = new Date().toISOString();
  await syncSupabaseProfile(user);
  save();
  toast("Solicitacao LGPD marcada como tratada.");
  render();
}

function openChat() {
  document.querySelector("#chatPanel").hidden = false;
  renderChat();
}

function closeChat() {
  document.querySelector("#chatPanel").hidden = true;
}

function renderChat() {
  const box = document.querySelector("#chatMessages");
  const history = state.chat.slice(-12);
  box.innerHTML =
    history
      .map(
        (item) => `
        <div class="chat-bubble ${item.from === "user" ? "from-user" : "from-bot"}">
          ${escapeHtml(item.message)}
        </div>`,
      )
      .join("") ||
    `<div class="chat-bubble from-bot">Olá. Sou o assistente SyntecVet. Pergunte por indicação, apresentação, posologia ou peça atendimento humano.</div>`;
  box.scrollTop = box.scrollHeight;
}

function handleChat(event) {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  const user = currentUser();
  const customerInfo = {
    customerId: user?.id || "",
    customer: user?.fullName || user?.email || "Visitante",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
  };
  state.chat.push({ id: slugId(), from: "user", message, ...customerInfo, createdAt: new Date().toISOString() });
  const answer = chatAnswer(message);
  state.chat.push({
    id: slugId(),
    from: "bot",
    message: answer.message,
    needsHuman: answer.needsHuman,
    ...customerInfo,
    createdAt: new Date().toISOString(),
  });
  save();
  renderChat();
  if (answer.needsHuman) {
    const alertOrder = {
      id: slugId(),
      customerName: user?.fullName || "Cliente",
      customerPhone: user?.phone || "",
      shippingAddress: "Atendimento via chatbot",
      total: 0,
      items: [{ id: "chat", name: `Atendimento humano: ${message}`, quantity: 1, price: null }],
      createdAt: new Date().toISOString(),
    };
    window.open(whatsappUrl(alertOrder), "_blank", "noopener,noreferrer");
  }
}

function chatAnswer(message) {
  const text = message.toLowerCase();
  if (/(humano|representante|atendente|vendedor|urgente|whatsapp)/.test(text)) {
    return {
      needsHuman: true,
      message: "Vou direcionar sua mensagem ao representante com alerta de atendimento humano.",
    };
  }
  const item = state.products.find((productItem) => text.includes(productItem.name.toLowerCase().split(" ")[0]));
  if (item) {
    if (/(preco|valor|quanto)/.test(text)) return { message: `${item.name}: ${money(item.price)}. O representante pode confirmar condicoes comerciais.`, needsHuman: false };
    if (/(dose|posologia|aplicar|uso)/.test(text)) return { message: `${item.name} - posologia resumida: ${item.dose}`, needsHuman: false };
    if (/(apresentacao|frasco|embalagem)/.test(text)) return { message: `${item.name} - apresentacao: ${item.presentation}`, needsHuman: false };
    return { message: `${item.name}: ${item.description} Indicacao: ${item.indication}.`, needsHuman: false };
  }
  return {
    needsHuman: false,
    message: "Posso responder por produto, indicacao, posologia, apresentacao ou chamar o representante.",
  };
}

function mountIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = iconMarkup(node.dataset.icon);
  });
}

function iconMarkup(name) {
  const icons = {
    grid: `<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>`,
    cart: `<svg viewBox="0 0 24 24"><path d="M6 6h15l-2 8H8L6 3H3v2h2l2 11h12v-2H9.6l-.3-2H19a1 1 0 0 0 1-.8l2-8A1 1 0 0 0 21 4H6z"/><circle cx="9" cy="20" r="2"/><circle cx="18" cy="20" r="2"/></svg>`,
    message: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="m6 7.4 1.4-1.4L12 10.6 16.6 6 18 7.4 13.4 12 18 16.6 16.6 18 12 13.4 7.4 18 6 16.6l4.6-4.6z"/></svg>`,
    send: `<svg viewBox="0 0 24 24"><path d="M3 20 21 12 3 4v6l10 2-10 2z"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><path d="M10 4a6 6 0 1 0 3.7 10.7l4.8 4.8 1.4-1.4-4.8-4.8A6 6 0 0 0 10 4m0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8"/></svg>`,
    plus: `<svg viewBox="0 0 24 24"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>`,
    minus: `<svg viewBox="0 0 24 24"><path d="M5 11h14v2H5z"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M12 5c5 0 8.6 4.2 10 7-1.4 2.8-5 7-10 7s-8.6-4.2-10-7c1.4-2.8 5-7 10-7m0 2c-3.6 0-6.4 2.8-7.7 5 1.3 2.2 4.1 5 7.7 5s6.4-2.8 7.7-5C18.4 9.8 15.6 7 12 7m0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5"/></svg>`,
    "eye-off": `<svg viewBox="0 0 24 24"><path d="m3.3 2 18.4 18.4-1.4 1.4-3.2-3.2A10.8 10.8 0 0 1 12 20c-5 0-8.6-4.2-10-7a15 15 0 0 1 4-4.8L1.9 3.4zm5 7.6A7.6 7.6 0 0 0 4.3 13c1.3 2.2 4.1 5 7.7 5 1.3 0 2.5-.4 3.5-.9l-2.1-2.1A3.5 3.5 0 0 1 9 10.6zM12 4c5 0 8.6 4.2 10 7-.5 1.1-1.5 2.4-2.8 3.7l-1.4-1.4c.8-.8 1.4-1.6 1.9-2.3C18.4 8.8 15.6 6 12 6c-.8 0-1.6.1-2.3.4L8.1 4.8A10.6 10.6 0 0 1 12 4"/></svg>`,
  };
  return icons[name] || "";
}

function boot() {
  seed();
  state.route = initialRoute();
  if (!ROUTES.includes(state.route)) {
    state.route = "catalogo";
  }
  bindEvents();
  render();
  renderChat();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  if (shouldSyncSupabaseSession()) syncSupabaseSession();
}

boot();
