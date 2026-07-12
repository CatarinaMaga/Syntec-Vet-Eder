const CONFIG = window.SYNTECVET_CONFIG || {};
let supabaseClient = null;
let supabaseLoadPromise = null;
let serviceWorkerRefreshing = false;

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
const APP_VERSION = "22";
const PUBLIC_APP_URL = "https://syntec-vet-eder-x47q.vercel.app";
const LEGACY_SALES_WHATSAPP = "5571999216734";
const PHASE_ONE_MODE = true;
const ROUTES = ["login", "catalogo", "carrinho", "perfil", "admin", "privacidade"];

const seedProducts = [
  product("anestt", "Anestt", "Anestésicos", "Bovinos, equinos, suínos, ovinos, cães e gatos", "SC: grandes animais, de 5 a 10 mL. Pequenos animais, de 1 a 3 mL por sítio de aplicação.", "Frasco-ampola de 50 mL.", 4),
  product("apromazin-1-injetavel", "Apromazin 1% Injetável", "Anestésicos", "Equinos", "IV, IM ou SC: de 0,5 a 1,0 mL/100 kg.", "Frasco-ampola de 20 mL.", 4),
  product("cetamin", "Cetamin", "Anestésicos", "Equinos", "IV: 2,0 mL/100 kg, associado a Detomidin, conforme a bula.", "Frasco-ampola de 10 e 50 mL.", 5),
  product("detomidin", "Detomidin", "Anestésicos", "Equinos", "IM ou IV: de 0,2 a 0,4 mL/100 kg.", "Frasco-ampola de 5 mL e 10 mL.", 5),
  product("isoflurano-syntec", "Isoflurano Syntec", "Anestésicos", "Equinos, cães e gatos", "CAM para equinos: de 1,5% a 2,5%.", "Frasco de 100 mL e 240 mL.", 6),
  product("xilazin-2", "Xilazin 2%", "Anestésicos", "Bovinos", "IV em bovinos: de 0,25 a 0,75 mL/100 kg. IM em bovinos: de 0,25 a 1,5 mL/100 kg.", "Frasco-ampola de 10 mL e 50 mL.", 6),
  product("xilazin-10", "Xilazin 10%", "Anestésicos", "Equinos", "IM: dose de 1 mL/50 kg. IV: dose de 0,5 mL/50 kg.", "Frasco de 50 mL.", 7),
  product("get-vacina-syntec", "GET-Vacina Syntec", "Biológicos", "Equinos", "Via intramuscular profunda. Reforços conforme a idade e a condição imunológica.", "Estojo contendo 10 frascos de 2 mL.", 8),
  product("diclofenaco-syntec", "Diclofenaco Syntec", "Anti-inflamatórios", "Bovinos, equinos, suínos, ovinos e caprinos", "IM, IV ou SC: 1 mL para cada 50 kg, a cada 24 horas.", "Frasco-ampola de 50 mL.", 9),
  product("farmadex-injetavel", "Farmadex Injetável", "Anti-inflamatórios", "Bovinos, equinos, suínos, ovinos e caprinos", "Bovinos e equinos: IV ou IM, de 5 a 15 mL. Outras espécies conforme a bula.", "Frasco-ampola de 10 e 50 mL.", 9),
  product("fenilbutazona-syntec", "Fenilbutazona Syntec", "Anti-inflamatórios", "Equinos", "IV: de 1,1 a 2,2 mL/100 kg.", "Frasco-ampola conforme o catálogo.", 10),
  product("luxol", "Luxol", "Anti-inflamatórios", "Equinos", "Uso tópico: diariamente, conforme a necessidade.", "Pote de pomada para uso tópico.", 10),
  product("maxitec-injetavel", "Maxitec Injetável", "Anti-inflamatórios", "Equinos", "Conforme a orientação da bula para quadros inflamatórios, dolorosos e febris.", "Frasco-ampola conforme o catálogo.", 11),
  product("flobiotic-10", "Flobiotic 10%", "Antibióticos", "Bovinos e suínos", "IM: 0,5 mL/20 kg. Casos graves: 0,5 mL/10 kg.", "Frasco-ampola conforme o catálogo.", 12),
  product("gentomicin", "Gentomicin", "Antibióticos", "Bovinos, equinos, suínos, aves e caprinos", "Bovinos: IM, de 2,2 a 6,6 mg/kg/dia. Demais espécies conforme a bula.", "Frasco-ampola conforme o catálogo.", 12),
  product("gentomicin-mastite", "Gentomicin Mastite", "Antibióticos", "Vacas em lactação", "Via intramamária: 1 aplicador por teto ao dia, durante 3 dias.", "Bisnagas intramamárias.", 13),
  product("oxitetraciclina-la-20", "Oxitetraciclina L.A. 20% Injetável", "Antibióticos", "Bovinos e suínos", "IM: 1 mL/10 kg.", "Frasco-ampola conforme o catálogo.", 13),
  product("propen", "Propen", "Antibióticos", "Bovinos, equinos, suínos e ovinos", "IM: 10 mL/100 kg.", "Frasco-ampola conforme o catálogo.", 14),
  product("sulfatrox", "Sulfatrox", "Antibióticos", "Bovinos, equinos e suínos", "IM: de 1 a 1,5 mL/30 kg.", "Frasco-ampola conforme o catálogo.", 14),
  product("cikadol", "Cikadol", "Especialidades", "Multiespécies", "Uso tópico: aplicar 1 ou 2 vezes ao dia.", "Frasco spray para uso tópico, conforme o catálogo.", 15),
  product("sealup", "Sealup", "Especialidades", "Vacas em período seco", "Via intramamária: 1 bisnaga por teto.", "Bisnagas intramamárias.", 16),
  product("duofor", "Duofor", "Higiene e Saúde", "Ambientes", "Pulverização: diluição de 1:100 em água. Imersão: 1:50 em água.", "Frasco conforme o catálogo.", 17),
  product("limpex", "Limpex", "Higiene e Saúde", "Equinos", "Indicado para tratamento e prevenção de miíases e ferimentos, conforme a bula.", "Frasco spray conforme o catálogo.", 17),
  product("synmectin", "Synmectin", "Endectocidas", "Bovinos, suínos e ovinos", "Bovinos SC: 1 mL/50 kg. Suínos SC: 0,3 mL/50 kg. Ovinos SC: 0,2 mL/10 kg.", "Frasco conforme o catálogo.", 18),
  product("taurus-sr", "T@urus SR", "Endectocidas", "Bovinos", "SC: 1 mL/50 kg. Agitar vigorosamente antes da aplicação.", "Frasco conforme o catálogo.", 18),
  product("ciperduo", "Ciperduo", "Ectoparasiticidas", "Bovinos", "Pour-on: 10 mL/100 kg.", "Frasco pour-on conforme o catálogo.", 19),
  product("alnor-10", "Alnor 10%", "Antiparasitários", "Bovinos e ovinos", "Bovinos, via oral: de 3,75 a 7,5 mL/50 kg. Ovinos, via oral: de 0,375 a 0,5 mL/10 kg.", "Frasco conforme o catálogo.", 20),
  product("anequim-plus", "Anequim Plus", "Antiparasitários", "Equinos", "Via oral: 30 g/500 kg.", "Seringa com pasta oral, conforme o catálogo.", 20),
  product("equimectin", "Equimectin", "Antiparasitários", "Equinos", "Via oral: 20 g/100 kg.", "Seringa com pasta oral, conforme o catálogo.", 21),
  product("multisyn-180", "Multisyn 180", "Suplementos", "Bovinos", "Bezerros: 1 mL/50 kg. Bovinos adultos: 1 mL/100 kg.", "Frasco de 250 mL e 500 mL.", 22),
  product("creatina-90-syntec", "Creatina 90 Syntec", "Suplementos", "Equinos", "Dose inicial: 100 g/dia por 14 dias. Manutenção: 35 g/dia.", "Frascos de 500 g e 2 kg.", 22),
  product("ade-syntec", "ADE Syntec", "Vitamínicos e Minerais", "Bovinos, suínos, ovinos e caprinos", "Bovinos IM ou SC: de 0,5 a 5 mL. Demais espécies conforme a bula.", "Frasco conforme o catálogo.", 24),
  product("dosecal", "Dosecal", "Vitamínicos e Minerais", "Bovinos e equinos", "IV: 40 mL/50 kg.", "Frasco conforme o catálogo.", 25),
  product("dosefer", "Dosefer", "Vitamínicos e Minerais", "Bovinos, equinos, suínos, ovinos e caprinos", "Bovinos IV: 40 mL/50 kg. Demais espécies conforme a bula.", "Frasco conforme o catálogo.", 25),
  product("vitapulmin-gel", "Vitapulmin Gel", "Broncodilatadores", "Equinos", "Via oral: 4 mL/125 kg, a cada 12 horas.", "Bisnaga com gel oral, conforme o catálogo.", 26),
  product("equi-boost", "Equi-Boost", "Hormônios", "Equinos", "IM: 2,2 mL/100 kg.", "Frasco conforme o catálogo.", 27),
  product("ocitocina-syntec", "Ocitocina Syntec", "Hormônios", "Bovinos, equinos e suínos", "Bovinos e equinos: IM ou IV, de 3 a 5 mL por animal. Suínos: SC, de 1 a 2 mL.", "Frasco conforme o catálogo.", 27),
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
    description: `${name} integra a linha ${category.toLowerCase()} Syntec para grandes animais. Consulte sempre a bula e a orientação do médico-veterinário.`,
    faq: [
      ["Para quais animais é indicado?", indication],
      ["Qual é a apresentação?", presentation],
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
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function seed() {
  if (!localStorage.getItem(STORE.products)) write(STORE.products, seedProducts);
  if (!localStorage.getItem(STORE.users)) write(STORE.users, []);
  if (!localStorage.getItem(STORE.settings)) {
    write(STORE.settings, {
      representativeName: "Representante SyntecVet",
      whatsapp: "",
    });
  }
  state.products = read(STORE.products, seedProducts).map(applyCatalogText);
  state.users = read(STORE.users, []).filter((user) => !["admin", "cliente-demo"].includes(user.id));
  state.session = read(STORE.session, null);
  if (state.session && !state.users.some((user) => user.id === state.session.userId)) state.session = null;
  state.cart = read(STORE.cart, {});
  state.orders = read(STORE.orders, []);
  state.settings = read(STORE.settings, {});
  state.settings.whatsapp = normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp || "");
  state.chat = read(STORE.chat, []);
}

function applyCatalogText(item) {
  const catalogText = seedProducts.find((productItem) => productItem.id === item.id);
  if (!catalogText) return item;
  return {
    ...item,
    name: catalogText.name,
    category: catalogText.category,
    brand: catalogText.brand,
    description: catalogText.description,
    indication: catalogText.indication,
    presentation: catalogText.presentation,
    dose: catalogText.dose,
    faq: catalogText.faq,
  };
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
      return productItem?.active && quantity > 0 ? { ...productItem, quantity } : null;
    })
    .filter(Boolean);
}

function cartCount() {
  return cartItems().reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
}

function cartOrderTotal() {
  return cartItems().some((item) => item.price === null || item.price === undefined || item.price === "")
    ? null
    : cartTotal();
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9@%]+/g, " ")
    .trim();
}

function setRoute(route) {
  const nextRoute = ROUTES.includes(route) ? route : "catalogo";
  state.route = nextRoute;
  location.hash = nextRoute;
  state.selectedProduct = null;
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
  const headerSearch = document.querySelector("#headerSearch");
  const user = currentUser();
  adminNav.hidden = user?.role !== "admin";
  adminNav.textContent = "Administrador";
  if (headerSearch && headerSearch.value !== state.query) headerSearch.value = state.query;
  const categoryLabel = state.category === "Todos" ? "Todos os produtos" : state.category;
  const categoryCurrent = document.querySelector("#categoryCurrent");
  if (categoryCurrent) categoryCurrent.textContent = categoryLabel;
  document.querySelectorAll("[data-header-category]").forEach((button) => {
    const isActive = button.dataset.headerCategory === state.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

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
  const normalizedQuery = normalizeText(state.query);
  const visible = state.products.filter((item) => {
    const matchCategory = state.category === "Todos" || item.category === state.category;
    const matchQuery = normalizeText(`${item.name} ${item.category} ${item.indication}`).includes(normalizedQuery);
    return item.active && matchCategory && matchQuery;
  });

  return `
    <section class="hero">
      <img src="/assets/catalog/catalog-hero-v2.webp" alt="Cavalo e bovino representando a linha de grandes animais" />
      <div class="hero-copy">
        <h1>Catálogo digital</h1>
      </div>
    </section>

    <section class="catalog-grid">
      ${
        visible.map(renderProductCard).join("") ||
        `<div class="empty-state"><strong>Nenhum produto encontrado.</strong><span>Tente outro nome, espécie ou categoria.</span></div>`
      }
    </section>
    ${state.selectedProduct ? renderProductDrawer(state.selectedProduct) : ""}
  `;
}

function renderProductCard(item) {
  const quantity = state.cart[item.id] || 0;
  const id = escapeHtml(item.id);
  const name = escapeHtml(item.name);
  const category = escapeHtml(item.category);
  const indication = escapeHtml(item.indication);
  const image = escapeHtml(safeImageUrl(item.image));
  return `
    <article class="product-card">
      <button class="image-button" data-detail="${id}" type="button" aria-label="Ver ${name}">
        <img src="${image}" alt="${name}" loading="lazy" />
      </button>
      <div class="product-body">
        <div class="product-meta">
          <span>${category}</span>
          <strong>${money(item.price)}</strong>
        </div>
        <h2>${name}</h2>
        <p>${indication}</p>
        <div class="quantity-row">
          <button class="icon-button soft" type="button" data-dec="${id}" aria-label="Diminuir ${name}">
            <span data-icon="minus"></span>
          </button>
          <output>${quantity}</output>
          <button class="icon-button soft" type="button" data-inc="${id}" aria-label="Aumentar ${name}">
            <span data-icon="plus"></span>
          </button>
          <button class="add-button" type="button" data-add="${id}">Adicionar</button>
        </div>
      </div>
    </article>
  `;
}

function renderProductDrawer(id) {
  const item = state.products.find((productItem) => productItem.id === id);
  if (!item) return "";
  const safeId = escapeHtml(item.id);
  const name = escapeHtml(item.name);
  const category = escapeHtml(item.category);
  const image = escapeHtml(safeImageUrl(item.image));
  return `
    <div class="modal-backdrop" data-close-detail></div>
    <aside class="drawer" aria-label="Detalhes do produto">
      <div class="drawer-head">
        <div>
          <span>${category}</span>
          <h2>${name}</h2>
        </div>
        <button class="icon-button ghost" type="button" data-close-detail aria-label="Fechar">
          <span data-icon="close"></span>
        </button>
      </div>
      <img class="drawer-image" src="${image}" alt="${name}" />
      <dl class="detail-list">
        <div><dt>Preço</dt><dd>${money(item.price)}</dd></div>
        <div><dt>Indicação</dt><dd>${escapeHtml(item.indication)}</dd></div>
        <div><dt>Posologia</dt><dd>${escapeHtml(item.dose)}</dd></div>
        <div><dt>Apresentação</dt><dd>${escapeHtml(item.presentation)}</dd></div>
      </dl>
      <button class="primary-button" type="button" data-add="${safeId}">Adicionar ao carrinho</button>
    </aside>
  `;
}

function renderLogin() {
  return `
    <section class="auth-layout">
      <div class="auth-card">
        <h1 id="authTitle">Acesso do representante</h1>
        <p>Entre para atualizar produtos, preços, imagens e o WhatsApp comercial.</p>
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
          <button class="link-button" type="button" data-route="catalogo">Voltar ao catálogo</button>
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
          <li>Nome, WhatsApp, CEP, endereço e produtos escolhidos no carrinho.</li>
          <li>Esses dados são informados somente no fechamento do pedido.</li>
          <li>O cliente não precisa criar uma conta para comprar nesta fase inicial.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Finalidade</h2>
        <ul class="privacy-list">
          <li>Montar a mensagem do pedido.</li>
          <li>Enviar os dados ao WhatsApp comercial do representante.</li>
          <li>Permitir contato para confirmação, entrega e atendimento.</li>
          <li>Responder dúvidas sobre os produtos pelo assistente virtual.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Proteção</h2>
        <ul class="privacy-list">
          <li>Coleta limitada aos dados essenciais do pedido.</li>
          <li>Os pedidos não ficam salvos como histórico do cliente no sistema nesta fase.</li>
          <li>O acesso administrativo é restrito ao representante.</li>
          <li>O site usa HTTPS e políticas de segurança na publicação.</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Direitos do cliente</h2>
        <ul class="privacy-list">
          <li>Conferir e corrigir os dados antes de enviar o pedido.</li>
          <li>Solicitar atendimento humano pelo WhatsApp.</li>
          <li>Pedir ao representante a correção ou a exclusão de dados que tenham permanecido na conversa comercial.</li>
          <li>Solicitar informações sobre o uso dos dados do pedido.</li>
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
        <h1>${escapeHtml(user.fullName)}</h1>
      </div>
      ${user.role === "admin" ? `<button class="primary-button" type="button" data-route="admin">Painel admin</button>` : ""}
    </section>
    <section class="split-layout">
      <form id="profileForm" class="panel form-grid">
        ${inputField("profileName", "Nome", user.fullName || "")}
        ${inputField("profilePhone", "WhatsApp", user.phone || "", "tel", "Ex.: 71999998888", "Use somente números, com DDD. Ex.: 71999998888 ou 5571999998888.")}
        ${inputField("profileZip", "CEP", user.zipCode || "", "text", "00000-000")}
        ${inputField("profileStreet", "Rua", user.street || "")}
        ${inputField("profileNumber", "Número", user.addressNumber || "")}
        ${inputField("profileComplement", "Complemento", user.addressComplement || "")}
        ${inputField("profileNeighborhood", "Bairro", user.neighborhood || "")}
        ${inputField("profileCity", "Cidade", user.city || "")}
        ${inputField("profileState", "UF", user.state || "")}
        <button class="primary-button full" type="submit">Salvar perfil</button>
      </form>
      <div class="panel">
        <h2>Últimos pedidos</h2>
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
        <p class="muted">Consentimento: ${user.privacyConsentAt ? new Date(user.privacyConsentAt).toLocaleString("pt-BR") : "não registrado"}.</p>
      </div>
      <div class="data-actions">
        <button class="secondary-button" type="button" data-route="privacidade">Ver política</button>
        <button class="secondary-button" type="button" id="exportDataButton">Exportar meus dados</button>
        <button class="danger-button" type="button" id="requestDeletionButton">Solicitar exclusão</button>
        <button class="link-button" type="button" id="clearLocalDataButton">Limpar este dispositivo</button>
      </div>
    </section>
  `;
}

function inputField(id, label, value, type = "text", placeholder = "", help = "") {
  const requiredIds = new Set(["checkoutName", "checkoutPhone", "checkoutZip", "checkoutStreet", "checkoutNumber"]);
  const isZip = id.endsWith("Zip");
  const inputMode = type === "tel" || isZip ? 'inputmode="numeric"' : "";
  const maxLength = isZip ? 'maxlength="9"' : type === "tel" ? 'maxlength="15"' : "";
  const required = requiredIds.has(id) ? "required" : "";
  return `
    <label class="field" for="${id}">
      <span>${label}</span>
      <input id="${id}" type="${type}" value="${escapeHtml(value)}" placeholder="${placeholder}" ${inputMode} ${maxLength} ${required} />
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
        <h1>${items.length ? `${items.length} produto(s) selecionado(s)` : "Seu carrinho está vazio"}</h1>
      </div>
      <button class="secondary-button" type="button" data-route="catalogo">Continuar comprando</button>
    </section>
    <section class="cart-layout">
      <div class="panel cart-items">
        ${items.map(renderCartItem).join("") || `<p class="muted">Escolha produtos no catálogo para montar o pedido.</p>`}
      </div>
      <aside class="panel checkout-panel">
        <h2>Dados para envio</h2>
        <p class="muted">Preencha apenas os dados necessários para o representante receber o pedido pelo WhatsApp.</p>
        <form id="checkoutForm" class="form-stack">
          ${inputField("checkoutName", "Nome completo", "", "text", "Nome do cliente")}
          ${inputField("checkoutPhone", "WhatsApp", "", "tel", "Ex.: 71999998888", "Use somente números, com DDD. Ex.: 71999998888 ou 5571999998888.")}
          ${inputField("checkoutZip", "CEP", "", "text", "00000-000")}
          ${inputField("checkoutStreet", "Rua", "")}
          ${inputField("checkoutNumber", "Número", "")}
          ${inputField("checkoutComplement", "Complemento", "")}
          ${inputField("checkoutNeighborhood", "Bairro", "")}
          ${inputField("checkoutCity", "Cidade", "")}
          ${inputField("checkoutState", "UF", "")}
          <label class="checkbox-field">
            <input id="checkoutPrivacy" type="checkbox" required />
            <span>Estou ciente de que meus dados serão usados somente para montar este pedido e enviá-lo ao WhatsApp do representante.</span>
          </label>
          <button class="link-button compact-link" type="button" data-route="privacidade">Ver aviso de privacidade</button>
          <div class="summary-row"><span>Total</span><strong>${money(cartOrderTotal())}</strong></div>
          <button class="primary-button" type="submit" ${items.length ? "" : "disabled"}>Enviar pedido no WhatsApp</button>
        </form>
      </aside>
    </section>
  `;
}

function renderCartItem(item) {
  const id = escapeHtml(item.id);
  const name = escapeHtml(item.name);
  const category = escapeHtml(item.category);
  const image = escapeHtml(safeImageUrl(item.image));
  return `
    <article class="cart-line">
      <img src="${image}" alt="${name}" />
      <div>
        <h2>${name}</h2>
        <p>${category} - ${money(item.price)}</p>
      </div>
      <div class="quantity-row tight">
        <button class="icon-button soft" type="button" data-dec="${id}" aria-label="Diminuir"><span data-icon="minus"></span></button>
        <output>${item.quantity}</output>
        <button class="icon-button soft" type="button" data-inc="${id}" aria-label="Aumentar"><span data-icon="plus"></span></button>
      </div>
    </article>
  `;
}

function renderAdmin() {
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
      ${metric("Atendimento", "WhatsApp")}
      ${metric("Modo", "Fase 1")}
    </section>
    <section class="admin-layout">
      <div class="panel">
        <h2>Fluxo atual</h2>
        <p class="muted">Os clientes não precisam criar uma conta. Eles escolhem os produtos, preenchem nome, WhatsApp e endereço no carrinho, e o pedido é enviado diretamente ao WhatsApp do representante.</p>
        <p class="muted">Nesta fase, o sistema não salva o histórico de clientes nem os pedidos no banco.</p>
      </div>
      <form id="settingsForm" class="panel form-stack">
        <h2>Representante</h2>
        ${inputField("settingsName", "Nome", state.settings.representativeName || "")}
        ${inputField("settingsWhatsapp", "WhatsApp", normalizeSalesWhatsapp(state.settings.whatsapp), "tel", "5571999999999", "Use o código do país + DDD + número. Ex.: 5571999999999.")}
        <button class="primary-button" type="submit">Salvar WhatsApp</button>
      </form>
    </section>
    <section class="panel">
      <h2>Atualizar produtos</h2>
      <div class="product-admin-list">
        ${state.products.map(renderAdminProduct).join("")}
      </div>
    </section>
  `;
}

function metric(label, value) {
  return `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`;
}

function renderAdminProduct(item) {
  const id = escapeHtml(item.id);
  const name = escapeHtml(item.name);
  const category = escapeHtml(item.category);
  const image = escapeHtml(safeImageUrl(item.image));
  return `
    <article class="admin-product">
      <img src="${image}" alt="${name}" />
      <div>
        <strong>${name}</strong>
        <span>${category}</span>
      </div>
      <label>Preço<input type="number" step="0.01" min="0" value="${item.price ?? ""}" data-admin-price="${id}" placeholder="0,00" /></label>
      <label>Estoque<input type="number" step="1" min="0" value="${item.stock || 0}" data-admin-stock="${id}" /></label>
      <label>Imagem URL<input type="url" value="${escapeHtml(item.image)}" data-admin-image="${id}" /></label>
      <label class="switch"><input type="checkbox" ${item.active ? "checked" : ""} data-admin-active="${id}" /><span>Ativo</span></label>
      <button class="secondary-button" type="button" data-save-product="${id}">Salvar</button>
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
  const phoneLabel = user.phone ? formatPhone(user.phone) : "Telefone não cadastrado";
  return `
    <div class="alert-item">
      <strong>${escapeHtml(user.fullName || user.email || "Cliente")}</strong>
      <span>Solicitou exclusão ou revogação do consentimento em ${new Date(user.dataDeletionRequestedAt).toLocaleString("pt-BR")}.</span>
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
  const phoneLabel = phone ? formatPhone(phone) : "Telefone não cadastrado";
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
  const orderId = escapeHtml(String(order.id || "").slice(0, 8));
  const itemSummary = order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
  return `
    <article class="order-mini">
      <strong>Pedido ${orderId}</strong>
      <span>${new Date(order.createdAt).toLocaleDateString("pt-BR")} - ${money(order.total)}</span>
      <small>${escapeHtml(itemSummary)}</small>
    </article>
  `;
}

async function lookupCep(zip) {
  const clean = zip.replace(/\D/g, "");
  if (clean.length !== 8) throw new Error("Digite um CEP com 8 números.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`, { signal: controller.signal });
    if (!response.ok) throw new Error("CEP não encontrado.");
    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado.");
    return {
      zipCode: clean,
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    };
  } catch (error) {
    if (error.name === "AbortError") throw new Error("A consulta do CEP demorou demais. Tente novamente.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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
  const productItem = state.products.find((item) => item.id === id && item.active);
  if (!productItem) {
    toast("Este produto não está disponível no momento.");
    return false;
  }
  const requested = Number.isFinite(Number(nextQuantity)) ? Math.trunc(Number(nextQuantity)) : 0;
  const quantity = productItem.stock > 0 ? Math.min(Math.max(0, requested), productItem.stock) : Math.max(0, requested);
  if (productItem.stock > 0 && requested > productItem.stock) {
    toast(`Quantidade limitada ao estoque informado: ${productItem.stock}.`);
    return false;
  }
  if (quantity === 0) delete state.cart[id];
  else state.cart[id] = quantity;
  save();
  render();
  return true;
}

function addToCart(id) {
  if (updateCart(id, (state.cart[id] || 0) + 1)) toast("Produto adicionado ao carrinho.");
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
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safeImageUrl(value, fallback = "/assets/icon-512.png") {
  const imageUrl = String(value || "").trim();
  if (!imageUrl) return fallback;

  try {
    const parsed = new URL(imageUrl, location.origin);
    if (parsed.origin === location.origin || parsed.protocol === "https:") return imageUrl;
  } catch {
    return fallback;
  }

  return fallback;
}

function isValidImageUrl(value) {
  return safeImageUrl(value, "") !== "";
}

function bindEvents() {
  document.addEventListener("click", async (event) => {
    if (!event.target.closest("#categoryMenuToggle, #categoryDropdown")) closeCategoryMenu();
    const target = event.target.closest("button, [data-route], [data-detail], [data-close-detail]");
    if (!target) return;

    if (target.id === "categoryMenuToggle") {
      toggleCategoryMenu();
      return;
    }
    if (target.id === "navCatalog") {
      closeCategoryMenu();
      setRoute("catalogo");
    }
    if (target.id === "navCart") setRoute("carrinho");
    if (target.id === "navProfile") setRoute(currentUser()?.role === "admin" ? "admin" : "login");
    if (target.id === "headerHelp") openChat();
    if (target.dataset.route) setRoute(target.dataset.route);
    if (target.dataset.headerCategory) {
      state.category = target.dataset.headerCategory;
      closeCategoryMenu();
      setRoute("catalogo");
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
    if (target.dataset.saveProduct) await saveProduct(target.dataset.saveProduct);
    if (target.dataset.alertWhatsapp) replyHumanAlert(Number(target.dataset.alertWhatsapp));
    if (target.dataset.resolveAlert) resolveHumanAlert(Number(target.dataset.resolveAlert));
    if (target.dataset.lgpdWhatsapp) replyPrivacyRequest(target.dataset.lgpdWhatsapp);
    if (target.dataset.resolveLgpd) resolvePrivacyRequest(target.dataset.resolveLgpd);
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "headerSearch") {
      state.query = event.target.value;
      if (state.route !== "catalogo") setRoute("catalogo");
      else render();
    }

    if (["profileZip", "checkoutZip"].includes(event.target.id)) {
      const clean = event.target.value.replace(/\D/g, "");
      const prefix = event.target.id === "profileZip" ? "profile" : "checkout";
      if (clean.length === 8 && event.target.dataset.cepLookup !== clean) {
        event.target.dataset.cepLookup = clean;
        autoCep(clean, prefix);
      }
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCategoryMenu();
  });
  window.addEventListener("hashchange", syncRouteFromLocation);
}

function syncRouteFromLocation() {
  const nextRoute = initialRoute();
  if (nextRoute === state.route) return;
  state.route = nextRoute;
  state.selectedProduct = null;
  closeCategoryMenu();
  render();
}

function toggleCategoryMenu() {
  const dropdown = document.querySelector("#categoryDropdown");
  const trigger = document.querySelector("#categoryMenuToggle");
  const shouldOpen = dropdown.hidden;
  dropdown.hidden = !shouldOpen;
  trigger.setAttribute("aria-expanded", String(shouldOpen));
}

function closeCategoryMenu() {
  const dropdown = document.querySelector("#categoryDropdown");
  const trigger = document.querySelector("#categoryMenuToggle");
  if (!dropdown || !trigger) return;
  dropdown.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
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
  toast("A autenticação administrativa está indisponível. Verifique a configuração do Supabase.");
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
      toast("Usuário autenticado, mas ainda não está marcado como administrador.");
      return;
    }
    state.session = { userId: localUser.id };
    save();
    await syncProducts();
    setRoute("admin");
  } catch (error) {
    toast(authErrorMessage(error));
  }
}

function authErrorMessage(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos no Supabase.";
  }

  if (message.includes("email not confirmed")) {
    return "Este e-mail ainda não foi confirmado no Supabase.";
  }

  if (message.includes("user not found")) {
    return "Usuário não encontrado no Supabase.";
  }

  if (message.includes("too many") || message.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }

  return error?.message || "Não foi possível autenticar.";
}

async function loginWithGoogle() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) {
    toast("Configure Supabase em config.js para ativar Google.");
    return;
  }
  try {
    const client = await loadSupabase();
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) throw error;
  } catch (error) {
    toast(authErrorMessage(error) || "Não foi possível iniciar o login com o Google.");
  }
}

function loadSupabase() {
  if (supabaseClient) return Promise.resolve(supabaseClient);
  if (supabaseLoadPromise) return supabaseLoadPromise;

  supabaseLoadPromise = new Promise((resolve, reject) => {
    const connect = () => {
      if (!window.supabase?.createClient) {
        reject(new Error("A biblioteca de autenticação do Supabase não foi carregada."));
        return;
      }
      supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      resolve(supabaseClient);
    };

    if (window.supabase?.createClient) {
      connect();
      return;
    }

    const existingScript = document.querySelector("script[data-supabase-client]");
    if (existingScript) {
      if (existingScript.dataset.loadState === "error") {
        existingScript.remove();
      } else if (existingScript.dataset.loadState === "loaded") {
        connect();
        return;
      } else {
        const timeout = setTimeout(
          () => reject(new Error("A autenticação do Supabase demorou demais para carregar.")),
          12000,
        );
        existingScript.addEventListener(
          "load",
          () => {
            clearTimeout(timeout);
            connect();
          },
          { once: true },
        );
        existingScript.addEventListener(
          "error",
          () => {
            clearTimeout(timeout);
            reject(new Error("Não foi possível carregar a autenticação do Supabase. Verifique sua conexão."));
          },
          { once: true },
        );
        return;
      }
    }

    const script = document.createElement("script");
    script.dataset.supabaseClient = "true";
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.2/dist/umd/supabase.min.js";
    const scriptTimeout = setTimeout(() => {
      script.dataset.loadState = "error";
      script.remove();
      reject(new Error("A autenticação do Supabase demorou demais para carregar."));
    }, 12000);
    script.onload = () => {
      clearTimeout(scriptTimeout);
      script.dataset.loadState = "loaded";
      connect();
    };
    script.onerror = () => {
      clearTimeout(scriptTimeout);
      script.dataset.loadState = "error";
      script.remove();
      reject(new Error("Não foi possível carregar a autenticação do Supabase. Verifique sua conexão."));
    };
    document.head.append(script);
  }).catch((error) => {
    supabaseLoadPromise = null;
    throw error;
  });

  return supabaseLoadPromise;
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
    await syncProducts();

    cleanAuthCallbackUrl();

    if (state.route === "login") setRoute("admin");
    else render();
  } catch {
    cleanAuthCallbackUrl();
    if (shouldShowLoginError) toast("Não foi possível concluir o login com o Google.");
  }
}

async function fetchSupabaseProfile(client, userId) {
  const { data, error } = await client
    .from("profiles")
    .select("full_name,email,phone,zip_code,street,neighborhood,city,state,address_number,address_complement,role,avatar_url,privacy_consent_at,privacy_version,data_deletion_requested_at,data_deletion_handled_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(`Falha ao consultar o perfil do administrador: ${error.message}`);
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
    role: profile.role || "customer",
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
    provider: authUser.app_metadata?.provider || "email",
  });

  return user;
}

async function syncSupabaseProfile(user, extra = {}) {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !user?.id || user.id === "admin" || user.id === "cliente-demo") return;
  try {
    const client = await loadSupabase();
    const { error } = await client
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
    if (error) throw error;
  } catch {
    // O perfil local continua disponivel mesmo se a sincronizacao remota falhar.
  }
}

async function logout() {
  if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey) {
    try {
      const client = await loadSupabase();
      await client.auth.signOut();
    } catch {
      toast("A sessão local foi encerrada, mas o Supabase não respondeu.");
    }
  }
  state.session = null;
  save();
  setRoute("catalogo");
}

async function autoCep(value, prefix) {
  if (!value.trim()) return;
  const input = document.querySelector(`#${prefix}Zip`);
  const clean = value.replace(/\D/g, "");
  if (input?.dataset.cepResolved === clean) return;
  try {
    const address = await lookupCep(value);
    applyAddress(prefix, address);
    if (input) input.dataset.cepResolved = clean;
    toast("Endereço preenchido pelo CEP.");
  } catch (error) {
    if (input) delete input.dataset.cepLookup;
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

  if (!isValidSalesWhatsapp(normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp))) {
    toast("O WhatsApp do representante ainda não foi configurado.");
    return;
  }

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
    toast("Preencha nome, WhatsApp, CEP, rua e número.");
    return;
  }
  if (!isValidCustomerPhone(customerPhone)) {
    toast("Informe um WhatsApp válido com DDD. Ex.: 71999998888.");
    return;
  }
  if (!/^\d{8}$/.test(address.zipCode)) {
    toast("Informe um CEP válido com 8 números.");
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
    total: cartOrderTotal(),
    items: items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  openExternalUrl(whatsappUrl(order));
  state.cart = {};
  save();
  setRoute("catalogo");
  toast("Pedido enviado ao WhatsApp. Nenhum cadastro de cliente foi criado.");
}

function whatsappUrl(order) {
  const lines = [
    `ALERTA: Pedido SyntecVet ${order.id.slice(0, 8)}`,
    `Representante: ${state.settings.representativeName || "SyntecVet"}`,
    `Cliente: ${order.customerName}`,
    `Telefone: ${order.customerPhone || "Não informado"}`,
    `Entrega: ${order.shippingAddress}`,
    "",
    ...order.items.map((item) => `${item.quantity}x ${item.name} - ${money(item.price)} cada`),
    "",
    `Total: ${money(order.total)}`,
  ];
  const phone = normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp);
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

  openExternalUrl(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
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

function isValidCustomerPhone(phone) {
  const clean = String(phone || "").replace(/\D/g, "");
  return clean.startsWith("55") ? /^55\d{10,11}$/.test(clean) : /^\d{10,11}$/.test(clean);
}

async function saveProduct(id) {
  if (currentUser()?.role !== "admin") {
    toast("Sessão administrativa inválida. Entre novamente.");
    return;
  }
  const item = state.products.find((productItem) => productItem.id === id);
  if (!item) return;
  const priceValue = document.querySelector(`[data-admin-price="${id}"]`)?.value;
  const price = priceValue === "" ? null : Number(String(priceValue).replace(",", "."));
  const stock = Math.max(0, Math.trunc(Number(document.querySelector(`[data-admin-stock="${id}"]`)?.value || 0)));
  const image = document.querySelector(`[data-admin-image="${id}"]`)?.value.trim() || item.image;
  const active = document.querySelector(`[data-admin-active="${id}"]`)?.checked || false;
  const saveButton = document.querySelector(`[data-save-product="${id}"]`);

  if (price !== null && (!Number.isFinite(price) || price < 0)) {
    toast("Informe um preço válido.");
    return;
  }
  if (!isValidImageUrl(image)) {
    toast("Informe uma URL de imagem HTTPS válida.");
    return;
  }

  const updatedItem = { ...item, price, stock, image, active };

  try {
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = "Salvando...";
    }
    const client = await loadSupabase();
    const { data, error } = await client
      .from("products")
      .upsert(productPayload(updatedItem), { onConflict: "id" })
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("O banco não confirmou a atualização do produto.");

    Object.assign(item, updatedItem);
    save();
    toast("Produto e preço salvos para todos os clientes.");
    render();
  } catch (error) {
    toast(`Não foi possível salvar o produto: ${error.message || "erro desconhecido"}`);
  } finally {
    if (saveButton?.isConnected) {
      saveButton.disabled = false;
      saveButton.textContent = "Salvar";
    }
  }
}

function productPayload(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    brand: item.brand || "Syntec",
    description: item.description || "",
    indication: item.indication || "",
    presentation: item.presentation || "",
    dose: item.dose || "",
    price: item.price === "" || item.price === undefined ? null : item.price,
    image_url: item.image || "",
    active: item.active !== false,
    stock: Math.max(0, Math.trunc(Number(item.stock) || 0)),
    faq: Array.isArray(item.faq) ? item.faq : [],
    updated_at: new Date().toISOString(),
  };
}

function productFromDatabase(row) {
  const fallback = state.products.find((item) => item.id === row.id) || seedProducts.find((item) => item.id === row.id) || {};
  const catalogText = seedProducts.find((item) => item.id === row.id) || fallback;
  return {
    ...fallback,
    id: row.id,
    name: catalogText.name || row.name || row.id,
    category: catalogText.category || row.category || "Outros",
    brand: catalogText.brand || row.brand || "Syntec",
    description: catalogText.description || row.description || "",
    indication: catalogText.indication || row.indication || "",
    presentation: catalogText.presentation || row.presentation || "",
    dose: catalogText.dose || row.dose || "",
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    image: row.image_url || fallback.image || "",
    active: row.active !== false,
    stock: Math.max(0, Math.trunc(Number(row.stock) || 0)),
    faq: catalogText.faq || (Array.isArray(row.faq) ? row.faq : []),
  };
}

async function syncProducts() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return;
  try {
    const client = await loadSupabase();
    const { data, error } = await client
      .from("products")
      .select("id,name,category,brand,description,indication,presentation,dose,price,image_url,active,stock,faq");
    if (error) throw error;
    if (!data?.length) return;

    const databaseProducts = new Map(data.map((row) => [row.id, productFromDatabase(row)]));
    state.products = state.products.map((item) => databaseProducts.get(item.id) || item);
    for (const [id, item] of databaseProducts) {
      if (!state.products.some((productItem) => productItem.id === id)) state.products.push(item);
    }
    Object.keys(state.cart).forEach((id) => {
      const productItem = state.products.find((item) => item.id === id);
      if (!productItem?.active) delete state.cart[id];
    });
    save();
    render();
  } catch (error) {
    if (currentUser()?.role === "admin") {
      toast(`Não foi possível carregar os produtos do banco: ${error.message || "erro desconhecido"}`);
    }
  }
}

async function handleSettings(event) {
  event.preventDefault();
  const representativeName = value("settingsName");
  const whatsapp = normalizeSalesWhatsapp(value("settingsWhatsapp"));

  if (!representativeName) {
    toast("Informe o nome do representante.");
    return;
  }
  if (!isValidSalesWhatsapp(whatsapp)) {
    toast("Informe o WhatsApp com o código do país, DDD e número. Ex.: 5571999999999.");
    return;
  }

  try {
    const client = await loadSupabase();
    const { data, error } = await client
      .from("sales_settings")
      .update({
        representative_name: representativeName,
        whatsapp_number: whatsapp,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Registro de configuração comercial não encontrado.");

    state.settings.representativeName = representativeName;
    state.settings.whatsapp = whatsapp;
    save();
    toast("Dados do representante salvos para todos os clientes.");
    render();
  } catch (error) {
    toast(`Não foi possível salvar os dados do representante: ${error.message || "erro desconhecido"}`);
  }
}

function normalizeSalesWhatsapp(phone) {
  const clean = String(phone || "").replace(/\D/g, "");
  return clean === LEGACY_SALES_WHATSAPP ? "" : clean;
}

function isValidSalesWhatsapp(phone) {
  return /^55\d{10,11}$/.test(String(phone || ""));
}

async function syncSalesSettings() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return;
  try {
    const client = await loadSupabase();
    const { data, error } = await client
      .from("sales_settings")
      .select("representative_name,whatsapp_number")
      .eq("id", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return;

    state.settings.representativeName = data.representative_name || "Representante SyntecVet";
    state.settings.whatsapp = normalizeSalesWhatsapp(data.whatsapp_number);
    save();
    render();
  } catch (error) {
    if (currentUser()?.role === "admin") {
      toast(`Não foi possível carregar os dados do representante: ${error.message || "erro desconhecido"}`);
    }
  }
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
  const representativePhone = normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp);
  if (!isValidSalesWhatsapp(representativePhone)) {
    toast("O WhatsApp do representante ainda não foi configurado.");
    return;
  }
  user.dataDeletionRequestedAt = new Date().toISOString();
  user.dataDeletionHandledAt = "";
  await syncSupabaseProfile(user);
  save();

  const message = [
    "SOLICITAÇÃO LGPD - EXCLUSÃO OU REVOGAÇÃO",
    `Cliente: ${user.fullName || user.email}`,
    `E-mail: ${user.email || "não informado"}`,
    `WhatsApp: ${user.phone || "não informado"}`,
    "Solicito a verificação, a exclusão ou a revogação do consentimento dos meus dados pessoais no sistema SyntecVet.",
  ].join("\n");
  openExternalUrl(representativeWhatsappUrl(message));
  toast("Solicitação LGPD enviada ao representante.");
  render();
}

async function clearLocalData() {
  const user = currentUser();
  if (!user) return;
  const confirmed = confirm("Limpar os dados deste dispositivo remove a sessão, o carrinho, o histórico e o cadastro locais. Os dados já enviados ao banco ou ao WhatsApp precisam ser tratados pelo representante.");
  if (!confirmed) return;
  if (CONFIG.supabaseUrl && CONFIG.supabaseAnonKey) {
    try {
      const client = await loadSupabase();
      await client.auth.signOut();
    } catch {
      // A limpeza local deve continuar mesmo se o serviço de autenticação estiver indisponível.
    }
  }
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
  const phone = normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function openExternalUrl(url) {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

function replyPrivacyRequest(userId) {
  const user = state.users.find((item) => item.id === userId);
  const phone = normalizeCustomerPhone(user?.phone || "");
  if (!phone) {
    toast("Cliente sem telefone cadastrado.");
    return;
  }
  const message = [
    `Olá, ${user.fullName || "tudo bem"}!`,
    `Sou ${state.settings.representativeName || "o representante SyntecVet"}.`,
    "Recebi sua solicitação LGPD e vou tratar seu pedido de privacidade.",
  ].join("\n");
  openExternalUrl(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}

async function resolvePrivacyRequest(userId) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) return;
  user.dataDeletionHandledAt = new Date().toISOString();
  await syncSupabaseProfile(user);
  save();
  toast("Solicitação LGPD marcada como tratada.");
  render();
}

function openChat() {
  document.querySelector("#chatPanel").hidden = false;
  document.querySelector("#chatToggle").setAttribute("aria-expanded", "true");
  renderChat();
  document.querySelector("#chatInput")?.focus();
}

function closeChat() {
  document.querySelector("#chatPanel").hidden = true;
  document.querySelector("#chatToggle").setAttribute("aria-expanded", "false");
  document.querySelector("#chatToggle")?.focus();
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
    `<div class="chat-bubble from-bot">Olá! Sou o assistente virtual SyntecVet. Pergunte pelo nome do produto, preço, indicação, dose, apresentação ou disponibilidade. Digite: Representante para ser encaminhado ao WhatsApp do Representante de Vendas.</div>`;
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
  state.chat = state.chat.slice(-50);
  save();
  renderChat();
  if (answer.needsHuman) {
    const humanMessage = [
      "ATENDIMENTO HUMANO - CATÁLOGO SYNTECVET",
      `Cliente: ${customerInfo.customer}`,
      customerInfo.customerPhone ? `Telefone informado: ${customerInfo.customerPhone}` : "",
      `Mensagem: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
    openExternalUrl(representativeWhatsappUrl(humanMessage));
  }
}

function chatAnswer(message) {
  const text = normalizeText(message);
  if (/(humano|representante|atendente|vendedor|urgente|whatsapp)/.test(text)) {
    const phone = normalizeSalesWhatsapp(state.settings.whatsapp || CONFIG.salesRepWhatsapp);
    if (!isValidSalesWhatsapp(phone)) {
      return {
        needsHuman: false,
        message: "O WhatsApp do representante ainda não está configurado. Tente novamente mais tarde.",
      };
    }
    return {
      needsHuman: true,
      message: "Vou abrir o WhatsApp com sua solicitação para o representante de vendas.",
    };
  }

  const item = findProductInMessage(text);
  if (item) {
    if (/(preco|valor|quanto|custa)/.test(text)) {
      return { message: `${item.name}: ${money(item.price)}. O representante confirma as condições comerciais.`, needsHuman: false };
    }
    if (/(estoque|disponivel|disponibilidade|tem para vender)/.test(text)) {
      const availability = item.stock > 0 ? `${item.stock} unidade(s) informada(s) no estoque.` : "Disponibilidade sob consulta.";
      return { message: `${item.name}: ${availability}`, needsHuman: false };
    }
    if (/(dose|posologia|aplicar|aplicacao|como usar|uso)/.test(text)) {
      return {
        message: `${item.name} - posologia resumida do catálogo: ${item.dose} Confirme sempre na bula e com o médico-veterinário.`,
        needsHuman: false,
      };
    }
    if (/(apresentacao|frasco|embalagem|tamanho)/.test(text)) {
      return { message: `${item.name} - apresentação: ${item.presentation}`, needsHuman: false };
    }
    if (/(indicacao|indicado|serve|animais|especies)/.test(text)) {
      return { message: `${item.name} - indicação do catálogo: ${item.indication}.`, needsHuman: false };
    }
    return {
      message: `${item.name}: ${item.description} Indicação do catálogo: ${item.indication}.`,
      needsHuman: false,
    };
  }

  const category = findCategoryInMessage(text);
  if (category) {
    const names = state.products
      .filter((productItem) => productItem.active && productItem.category === category)
      .map((productItem) => productItem.name)
      .join(", ");
    return { message: `${category}: ${names || "nenhum produto ativo no momento"}.`, needsHuman: false };
  }

  if (/(categorias|tipos|linhas de produtos)/.test(text)) {
    return { message: `Categorias disponíveis: ${categories().slice(1).join(", ")}.`, needsHuman: false };
  }

  if (/(diagnostico|tratamento|recomenda|qual devo usar)/.test(text)) {
    return {
      message: "Não posso indicar tratamento ou fazer diagnóstico. Posso informar os dados do catálogo; para orientação clínica, consulte um médico-veterinário.",
      needsHuman: false,
    };
  }

  return {
    needsHuman: false,
    message: "Informe o nome do produto ou uma categoria. Posso responder sobre preço, indicação, dose, apresentação e disponibilidade, ou chamar o representante.",
  };
}

function findProductInMessage(normalizedMessage) {
  const ignoredTokens = new Set(["syntec", "injetavel"]);
  let bestMatch = null;
  let bestScore = 0;

  for (const item of state.products.filter((productItem) => productItem.active)) {
    const normalizedName = normalizeText(item.name);
    const normalizedId = normalizeText(item.id.replaceAll("-", " "));
    if (normalizedMessage.includes(normalizedName) || normalizedMessage.includes(normalizedId)) return item;

    const tokens = normalizedName.split(" ").filter((token) => token.length > 2 && !ignoredTokens.has(token));
    const score = tokens.filter((token) => normalizedMessage.includes(token)).length;
    if (score > bestScore) {
      bestMatch = item;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

function findCategoryInMessage(normalizedMessage) {
  return (
    categories()
      .slice(1)
      .find((category) => normalizedMessage.includes(normalizeText(category))) || null
  );
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
    whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.892-9.884a9.82 9.82 0 0 1 7.021 2.91 9.81 9.81 0 0 1 2.9 7.023c-.003 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.82 11.82 0 0 0 12.056 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.692 1.448h.005c6.557 0 11.893-5.335 11.896-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/></svg>`,
    "chevron-down": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.7 8.6 5.3 5.3 5.3-5.3 1.4 1.4-6.7 6.7L5.3 10z"/></svg>`,
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

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  const reloadKey = `syntecvet-sw-reloaded-${APP_VERSION}`;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (serviceWorkerRefreshing) return;
    serviceWorkerRefreshing = true;
    try {
      if (sessionStorage.getItem(reloadKey)) return;
      sessionStorage.setItem(reloadKey, "true");
    } catch {
      // A atualização ainda pode prosseguir quando o armazenamento de sessão estiver bloqueado.
    }
    location.reload();
  });

  try {
    const registration = await navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`, {
      updateViaCache: "none",
    });
    await registration.update();
  } catch {
    // O catálogo continua funcional on-line mesmo se o modo offline não puder ser ativado.
  }
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
  registerServiceWorker();
  if (shouldSyncSupabaseSession()) syncSupabaseSession();
  syncSalesSettings();
  syncProducts();
}

boot();
