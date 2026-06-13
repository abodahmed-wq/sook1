/* ============================================================
   SOUQ – سوك  |  Main Script
   Vanilla JS – LocalStorage persistence
   ============================================================ */


'use strict';

// ============================================================
// STATE
// ============================================================
let state = {
  users: [],
  stores: [],
  products: [],
  orders: [],
  tickets: [],
  notifications: [],
  settings: {
    siteName: 'سـوك',
    logo: '',
    categories: ['gpu','cpu','laptop','monitor','gaming','accessories']
  },
  currentUser: null,
  cart: [],
  page: 'home',
  pageParam: null,
  searchQuery: '',
  filterCat: 'all',
  devTab: 'stats',
  selTab: 'overview',
  buyTab: 'overview',
  editProductId: null,
};

// ── Seed Data ──────────────────────────────────────────────
function seedData() {
  if (state.users.length) return;

  const now = Date.now();
  const day = 86400000;

  // Developer account
  state.users.push({
    id: 'dev-1', username: 'abodiq', password: '1122',
    type: 'developer', displayName: 'عبود القاضي',
    storeId: null, banned: false,
    createdAt: now - day * 60, lastLogin: now - 3600000,
  });

  // Sellers
  const stores = [
    { id: 'st-1', name: 'متجر التيك برو', desc: 'أفضل قطع الكمبيوتر في العراق', logo: '', ownerId: 'sel-1', products: 0, sales: 142, revenue: 18500000, rating: 4.8, createdAt: now - day * 30 },
    { id: 'st-2', name: 'جيمر زون', desc: 'كل ما يحتاجه الجيمر العراقي', logo: '', ownerId: 'sel-2', products: 0, sales: 87, revenue: 9200000, rating: 4.5, createdAt: now - day * 20 },
    { id: 'st-3', name: 'ميغا تك', desc: 'استيراد مباشر بأسعار تنافسية', logo: '', ownerId: 'sel-3', products: 0, sales: 55, revenue: 7800000, rating: 4.3, createdAt: now - day * 15 },
  ];
  state.stores = stores;

  state.users.push(
    { id: 'sel-1', username: 'techpro', password: '1234', type: 'seller', displayName: 'أحمد الكناني', storeId: 'st-1', banned: false, createdAt: now - day * 30, lastLogin: now - day * 2 },
    { id: 'sel-2', username: 'gamerzone', password: '1234', type: 'seller', displayName: 'محمد الشمري', storeId: 'st-2', banned: false, createdAt: now - day * 20, lastLogin: now - day },
    { id: 'sel-3', username: 'megatek', password: '1234', type: 'seller', displayName: 'علي البغدادي', storeId: 'st-3', banned: false, createdAt: now - day * 15, lastLogin: now - 7200000 },
  );

  // Buyers
  state.users.push(
    { id: 'buy-1', username: 'zaid', password: '1234', type: 'buyer', displayName: 'زيد حسين', storeId: null, banned: false, createdAt: now - day * 10, lastLogin: now - day },
    { id: 'buy-2', username: 'sara', password: '1234', type: 'buyer', displayName: 'سارة محمد', storeId: null, banned: false, createdAt: now - day * 5, lastLogin: now - 3600000 },
  );

  // Products
  const prods = [
    { id: 'p1', storeId: 'st-1', sellerId: 'sel-1', name: 'RTX 4070 Super 12GB', desc: 'كرت شاشة Nvidia RTX 4070 Super بأداء خارق للألعاب بدقة 4K', category: 'gpu', price: 1250000, qty: 5, images: [], condition: 'new', views: 320, orders: 28, rating: 4.9, pinned: false, hidden: false, createdAt: now - day * 10 },
    { id: 'p2', storeId: 'st-1', sellerId: 'sel-1', name: 'Core i9-14900K', desc: 'معالج Intel الجيل الرابع عشر للألعاب والإنتاج', category: 'cpu', price: 950000, qty: 8, images: [], condition: 'new', views: 280, orders: 22, rating: 4.8, pinned: false, hidden: false, createdAt: now - day * 8 },
    { id: 'p3', storeId: 'st-2', sellerId: 'sel-2', name: 'PS5 Pro Edition', desc: 'بلايستيشن 5 الإصدار المطور مع 2 تيرا', category: 'gaming', price: 1100000, qty: 3, images: [], condition: 'new', views: 490, orders: 31, rating: 4.7, pinned: true, hidden: false, createdAt: now - day * 7 },
    { id: 'p4', storeId: 'st-2', sellerId: 'sel-2', name: 'Laptop Asus ROG Zephyrus G14', desc: 'لابتوب الألعاب الأخف والأقوى مع RX7900S', category: 'laptop', price: 1650000, qty: 2, images: [], condition: 'new', views: 410, orders: 19, rating: 4.8, pinned: false, hidden: false, createdAt: now - day * 6 },
    { id: 'p5', storeId: 'st-3', sellerId: 'sel-3', name: 'Samsung Odyssey G7 27"', desc: 'شاشة ألعاب بمعدل 240hz وقدرة 1440p', category: 'monitor', price: 650000, qty: 6, images: [], condition: 'new', views: 210, orders: 15, rating: 4.6, pinned: false, hidden: false, createdAt: now - day * 5 },
    { id: 'p6', storeId: 'st-1', sellerId: 'sel-1', name: 'Ryzen 9 7950X', desc: 'معالج AMD للمبدعين والمحترفين، 16 نواة', category: 'cpu', price: 870000, qty: 4, images: [], condition: 'new', views: 195, orders: 12, rating: 4.7, pinned: false, hidden: false, createdAt: now - day * 4 },
    { id: 'p7', storeId: 'st-3', sellerId: 'sel-3', name: 'Logitech G Pro X Superlight', desc: 'ماوس الاحتراف اللاسلكي الأخف في العالم', category: 'accessories', price: 180000, qty: 15, images: [], condition: 'new', views: 350, orders: 42, rating: 4.9, pinned: false, hidden: false, createdAt: now - day * 3 },
    { id: 'p8', storeId: 'st-2', sellerId: 'sel-2', name: 'Xbox Series X', desc: 'إكس بوكس سيريز إكس أحدث إصدار مع 3 ألعاب', category: 'gaming', price: 950000, qty: 4, images: [], condition: 'new', views: 380, orders: 26, rating: 4.6, pinned: false, hidden: false, createdAt: now - day * 2 },
  ];

  // Used products (by buyers)
  const usedProds = [
    { id: 'u1', storeId: null, sellerId: 'buy-1', name: 'GTX 1080 Ti مستعملة بحالة ممتازة', desc: 'كرت شاشة قديم لكن بحالة ممتازة، يناسب الألعاب 1080p', category: 'gpu', price: 380000, qty: 1, images: [], condition: 'used', views: 120, orders: 3, rating: 4.3, province: 'بغداد', pinned: false, hidden: false, createdAt: now - day * 3 },
    { id: 'u2', storeId: null, sellerId: 'buy-2', name: 'لابتوب Dell XPS 13 مستعمل', desc: 'استخدام سنة ونصف، لا يوجد أي عيوب', category: 'laptop', price: 750000, qty: 1, images: [], condition: 'used', views: 90, orders: 1, rating: 4.0, province: 'البصرة', pinned: false, hidden: false, createdAt: now - day * 2 },
  ];

  state.products = [...prods, ...usedProds];

  // Update store product counts
  state.stores.forEach(st => {
    st.products = state.products.filter(p => p.storeId === st.id).length;
  });

  // Sample orders
  state.orders = [
    { id: 'ord-1', buyerId: 'buy-1', sellerId: 'sel-1', storeId: 'st-1', items: [{ productId: 'p1', qty: 1, price: 1250000 }], total: 1250000, phone: '07712345678', address: 'بغداد، الكرادة', province: 'بغداد', status: 'completed', createdAt: now - day * 5 },
    { id: 'ord-2', buyerId: 'buy-2', sellerId: 'sel-2', storeId: 'st-2', items: [{ productId: 'p3', qty: 1, price: 1100000 }], total: 1100000, phone: '07801234567', address: 'بصرة، العشار', province: 'البصرة', status: 'pending', createdAt: now - day * 1 },
    { id: 'ord-3', buyerId: 'buy-1', sellerId: 'sel-3', storeId: 'st-3', items: [{ productId: 'p7', qty: 2, price: 180000 }], total: 360000, phone: '07712345678', address: 'بغداد، المنصور', province: 'بغداد', status: 'processing', createdAt: now - 3600000 * 3 },
  ];

  // Sample tickets
  state.tickets = [
    { id: 'tck-1', userId: 'buy-1', subject: 'مشكلة في الطلب ord-1', body: 'الطلب وصل لكن الكرت فيه كسر في المشط', status: 'open', replies: [{ userId: 'dev-1', body: 'سنتواصل مع البائع فوراً', createdAt: now - day }], createdAt: now - day * 2 },
    { id: 'tck-2', userId: 'sel-1', subject: 'طلب زيادة حد الرفع', body: 'أريد رفع أكثر من 20 منتج في نفس الوقت', status: 'closed', replies: [{ userId: 'dev-1', body: 'تم الموافقة على طلبك', createdAt: now - day * 2 }], createdAt: now - day * 3 },
  ];

  saveState();
}

// ============================================================
// PERSISTENCE
// ============================================================
const STORAGE_KEY = 'souq_state';
let firestoreDb = null;
let firebaseProductsReady = false;
let firebaseWarningShown = false;

function getLocalStateSnapshot() {
  const { products, ...localState } = state;
  return localState;
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(getLocalStateSnapshot())); } catch(e) {}
}

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      delete parsed.products;
      Object.assign(state, parsed);
    }
  } catch(e) {}
}

function hasFirebaseConfig() {
  const cfg = window.SOUQ_FIREBASE_CONFIG || {};
  return Boolean(cfg.apiKey && cfg.projectId && !String(cfg.apiKey).startsWith('YOUR_') && !String(cfg.projectId).startsWith('YOUR_'));
}

function initFirestore() {
  if (firestoreDb) return firestoreDb;
  if (!hasFirebaseConfig() || !window.firebase?.initializeApp || !window.firebase?.firestore) return null;

  try {
    if (!firebase.apps.length) firebase.initializeApp(window.SOUQ_FIREBASE_CONFIG);
    firestoreDb = firebase.firestore();
    return firestoreDb;
  } catch (err) {
    warnFirebase(err);
    return null;
  }
}

function warnFirebase(err) {
  if (firebaseWarningShown) return;
  console.warn('Firebase Firestore is unavailable. Products will not sync between devices until firebase-config.js is configured correctly.', err);
  firebaseWarningShown = true;
}

function normalizeProductForFirestore(product) {
  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
  return {
    name: product.name || '',
    price: Number(product.price) || 0,
    image: product.image || images[0] || '',
    images,
    description: product.description || product.desc || '',
    desc: product.desc || product.description || '',
    createdAt: product.createdAt || Date.now(),
    storeId: product.storeId || null,
    sellerId: product.sellerId || null,
    sellerName: product.sellerName || getUser(product.sellerId)?.displayName || '',
    category: product.category || 'accessories',
    qty: Number(product.qty) || 1,
    condition: product.condition || 'new',
    province: product.province || '',
    views: Number(product.views) || 0,
    orders: Number(product.orders) || 0,
    rating: Number(product.rating) || 0,
    pinned: Boolean(product.pinned),
    hidden: Boolean(product.hidden)
  };
}

function normalizeProductFromFirestore(id, data) {
  const product = normalizeProductForFirestore(data || {});
  product.id = id;
  return product;
}

async function addProductToFirestore(product) {
  const db = initFirestore();
  if (!db) { toast('يرجى إعداد Firebase أولاً حتى تتم مزامنة المنتجات بين الأجهزة', 'error'); return false; }
  await db.collection('products').doc(product.id).set(normalizeProductForFirestore(product));
  return true;
}

async function updateProductInFirestore(pid, updates) {
  const db = initFirestore();
  if (!db) { toast('تعذر الاتصال بـ Firebase', 'error'); return false; }
  await db.collection('products').doc(pid).update(normalizeProductForFirestore({ ...state.products.find(p => p.id === pid), ...updates }));
  return true;
}

async function deleteProductFromFirestore(pid) {
  const db = initFirestore();
  if (!db) { toast('تعذر الاتصال بـ Firebase', 'error'); return false; }
  await db.collection('products').doc(pid).delete();
  return true;
}

function startProductsRealtimeSync() {
  const db = initFirestore();
  if (!db) {
    if (hasFirebaseConfig()) warnFirebase(new Error('Firebase SDK did not initialize.'));
    return false;
  }

  db.collection('products').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    state.products = snapshot.docs.map(doc => normalizeProductFromFirestore(doc.id, doc.data()));
    state.stores.forEach(st => {
      st.products = state.products.filter(p => p.storeId === st.id).length;
    });
    firebaseProductsReady = true;
    render();
    updateCartBadge();
  }, err => warnFirebase(err));

  return true;
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function toast(msg, type = 'info') {
  const c = document.getElementById('notif-container');
  const icons = { info: 'fa-info-circle', success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
  const el = document.createElement('div');
  el.className = `notif-toast ${type}`;
  el.innerHTML = `<i class="fa ${icons[type]||'fa-info-circle'}"></i><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function addNotif(msg, icon = 'fa-bell') {
  state.notifications.unshift({ id: Date.now(), msg, icon, time: new Date().toLocaleTimeString('ar') });
  updateNotifBadge();
  saveState();
}
function updateNotifBadge() {
  const badge = document.getElementById('notif-badge');
  if (badge) {
    const count = state.notifications.length;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
}
function toggleNotifPanel() {
  const p = document.getElementById('notif-panel');
  p.classList.toggle('hidden');
  renderNotifPanel();
}
function renderNotifPanel() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  if (!state.notifications.length) {
    list.innerHTML = `<div class="notif-empty"><i class="fa fa-bell-slash"></i><br>لا توجد إشعارات</div>`;
    return;
  }
  list.innerHTML = state.notifications.slice(0,15).map(n => `
    <div class="notif-item">
      <i class="fa ${n.icon}"></i>
      <div><div>${n.msg}</div><div class="nt">${n.time}</div></div>
    </div>`).join('');
}
function clearNotifs() {
  state.notifications = [];
  saveState();
  updateNotifBadge();
  renderNotifPanel();
}

// ============================================================
// AUTH
// ============================================================
function loginUser(username, password) {
  const u = state.users.find(u => u.username === username && u.password === password);
  if (!u) { toast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error'); return false; }
  if (u.banned) { toast('هذا الحساب محظور. تواصل مع الدعم.', 'error'); return false; }
  state.currentUser = u;
  u.lastLogin = Date.now();
  saveState();
  renderUserNav();
  toast(`مرحباً ${u.displayName}!`, 'success');
  addNotif(`تم تسجيل دخولك – ${u.displayName}`, 'fa-sign-in-alt');
  navigate('dashboard');
  return true;
}

function registerUser(data) {
  if (state.users.find(u => u.username === data.username)) {
    toast('اسم المستخدم مستخدم مسبقاً', 'error'); return false;
  }
  const id = 'usr-' + Date.now();
  const u = {
    id, username: data.username, password: data.password,
    type: data.type, displayName: data.displayName,
    storeId: null, banned: false,
    createdAt: Date.now(), lastLogin: Date.now(),
  };
  if (data.type === 'seller') {
    const storeId = 'st-' + Date.now();
    const store = { id: storeId, name: data.storeName, desc: data.storeDesc, logo: data.storeLogo || '', ownerId: id, products: 0, sales: 0, revenue: 0, rating: 0, createdAt: Date.now() };
    state.stores.push(store);
    u.storeId = storeId;
  }
  state.users.push(u);
  state.currentUser = u;
  saveState();
  renderUserNav();
  toast('تم إنشاء الحساب بنجاح!', 'success');
  navigate('dashboard');
  return true;
}

function logoutUser() {
  state.currentUser = null;
  saveState();
  renderUserNav();
  navigate('home');
  toast('تم تسجيل الخروج', 'info');
}

// ============================================================
// NAVIGATION
// ============================================================
function navigate(page, param) {
  state.page = page;
  state.pageParam = param || null;
  currentQty = 1;
  document.getElementById('notif-panel').classList.add('hidden');
  window.scrollTo(0,0);
  render();
}

function render() {
  const root = document.getElementById('app-root');
  try {
    switch (state.page) {
      case 'home':       root.innerHTML = renderHome(); break;
      case 'login':      root.innerHTML = renderLogin(); break;
      case 'register':   root.innerHTML = renderRegister(); break;
      case 'dashboard':  root.innerHTML = renderDashboard(); break;
      case 'product':    root.innerHTML = renderProductPage(state.pageParam); break;
      case 'store':      root.innerHTML = renderStorePage(state.pageParam); break;
      case 'cart':       root.innerHTML = renderCart(); break;
      case 'checkout':   root.innerHTML = renderCheckout(); break;
      case 'orders':     root.innerHTML = renderOrders(); break;
      case 'tickets':    root.innerHTML = renderTickets(); break;
      case 'used':       root.innerHTML = renderUsed(); break;
      case 'stores':     root.innerHTML = renderStoresList(); break;
      case 'search':     root.innerHTML = renderSearchPage(); break;

      // Static informational pages (added)
      case 'contact':   root.innerHTML = renderInfoPage('اتصل بنا', 'info', 'info'); break;
      case 'privacy':   root.innerHTML = renderInfoPage('سياسة الخصوصية', 'privacy', 'info'); break;
      case 'terms':     root.innerHTML = renderInfoPage('الشروط والأحكام', 'terms', 'info'); break;
      case 'support':   root.innerHTML = renderInfoPage('الدعم', 'support', 'info'); break;

      default:          root.innerHTML = renderHome();
    }
  } catch (err) {
    // Prevent one page error from breaking the whole app
    console.error('Render error:', err);
    root.innerHTML = `<div class="container" style="padding:60px 20px;">
      <div class="panel" style="padding:24px;">
        <h2 style="font-size:18px;font-weight:900;">حصل خطأ أثناء تحميل الصفحة</h2>
        <p style="color:var(--gray);margin-top:10px;">جرّب إعادة التحميل أو العودة للرئيسية.</p>
        <button class="btn btn-primary" onclick="navigate('home')" style="margin-top:14px;">العودة للرئيسية</button>
      </div>
    </div>`;
  }

  attachEvents();
  updateCartBadge();
  updateNotifBadge();
}


// ============================================================
// HEADER / NAV RENDER
// ============================================================
function renderUserNav() {
  const area = document.getElementById('user-nav-area');
  const mobDash = document.getElementById('mob-dashboard-link');
  const mobLogout = document.getElementById('mob-logout-link');
  const mobLogin = document.getElementById('mob-login-link');
  if (!area) return;

  if (state.currentUser) {
    const u = state.currentUser;
    const init = u.displayName[0];
    area.innerHTML = `
      <button class="nav-user-btn" onclick="navigate('dashboard')">
        <div class="nav-user-avatar">${init}</div>
        <span>${u.displayName}</span>
      </button>
      <button class="btn btn-secondary btn-sm" onclick="logoutUser()"><i class="fa fa-sign-out-alt"></i> خروج</button>`;
    if (mobDash) mobDash.classList.remove('hidden');
    if (mobLogout) mobLogout.classList.remove('hidden');
    if (mobLogin) mobLogin.classList.add('hidden');
    document.getElementById('cart-btn').classList.toggle('hidden', u.type !== 'buyer');
  } else {
    area.innerHTML = `
      <button class="btn-login" onclick="navigate('login')">دخول</button>
      <button class="btn-register" onclick="navigate('register')">حساب جديد</button>`;
    if (mobDash) mobDash.classList.add('hidden');
    if (mobLogout) mobLogout.classList.add('hidden');
    if (mobLogin) mobLogin.classList.remove('hidden');
    document.getElementById('cart-btn').classList.add('hidden');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = state.cart.reduce((s,i) => s+i.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

function toggleMobileMenu() {
  const m = document.getElementById('mobile-menu');
  m.classList.toggle('hidden');
}

// ============================================================
// SEARCH & FILTER
// ============================================================
function doSearch() {
  const q = document.getElementById('search-input').value.trim();
  state.searchQuery = q;
  navigate('search');
}
function filterCategory(cat) {
  state.filterCat = cat;
  navigate('home');
  document.querySelectorAll('.categories-inner a').forEach(a => a.classList.remove('active'));
}

// ============================================================
// HOME PAGE
// ============================================================
function renderHome() {
  const visProds = state.products.filter(p => !p.hidden);
  const byCat = state.filterCat === 'all' ? visProds : visProds.filter(p => p.category === state.filterCat);
  const topSales = [...visProds].sort((a,b) => b.orders-a.orders).slice(0,5);
  const topViews = [...visProds].sort((a,b) => b.views-a.views).slice(0,5);
  const newest = [...visProds].sort((a,b) => b.createdAt-a.createdAt).slice(0,5);
  const pinned = visProds.filter(p => p.pinned).slice(0,4);

  return `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <div class="hero-eyebrow"><i class="fa fa-bolt"></i> السوق الإلكتروني الأول في العراق</div>
        <h1>اشتري وبيع <br><span class="accent">إلكترونياتك</span><br>بأفضل الأسعار</h1>
        <p>من كروت الشاشة إلى أجهزة الألعاب – جديد أو مستعمل – كل شيء في مكان واحد.</p>
        <div class="hero-btns">
          <button class="btn btn-primary" onclick="filterCategory('all');navigate('home')"><i class="fa fa-shopping-bag"></i> تصفح المنتجات</button>
          <button class="btn btn-outline" onclick="navigate('used')"><i class="fa fa-recycle"></i> قسم المستعمل</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><div class="hero-stat-num">${state.products.length}+</div><div class="hero-stat-label">منتج</div></div>
          <div class="hero-stat"><div class="hero-stat-num">${state.stores.length}+</div><div class="hero-stat-label">متجر</div></div>
          <div class="hero-stat"><div class="hero-stat-num">${state.orders.length}+</div><div class="hero-stat-label">طلب منجز</div></div>
        </div>
      </div>
      <div class="hero-graphic">
        <div class="hero-graphic-inner">
          <div class="hero-chip"><i class="fa fa-tv"></i>كروت الشاشة</div>
          <div class="hero-chip"><i class="fa fa-microchip"></i>المعالجات</div>
          <div class="hero-chip"><i class="fa fa-laptop"></i>اللابتوبات</div>
          <div class="hero-chip"><i class="fa fa-gamepad"></i>الألعاب</div>
          <div class="hero-chip"><i class="fa fa-desktop"></i>الشاشات</div>
          <div class="hero-chip"><i class="fa fa-keyboard"></i>إكسسوارات</div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    ${pinned.length ? `
    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-thumbtack"></i> منتجات مثبتة</div>
      </div>
      <div class="product-grid">${pinned.map(productCard).join('')}</div>
    </section>` : ''}

    ${state.filterCat !== 'all' ? `
    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-filter"></i> نتائج التصفية (${byCat.length})</div>
        <a href="#" class="section-link" onclick="filterCategory('all')">الكل</a>
      </div>
      ${byCat.length ? `<div class="product-grid">${byCat.map(productCard).join('')}</div>` : emptyState('fa-search','لا توجد منتجات','لا يوجد منتجات في هذا القسم حالياً')}
    </section>` : `
    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-fire"></i> الأكثر مبيعاً</div>
        <a href="#" class="section-link">عرض الكل</a>
      </div>
      <div class="product-grid">${topSales.map(productCard).join('')}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-eye"></i> الأكثر مشاهدة</div>
      </div>
      <div class="product-grid">${topViews.map(productCard).join('')}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-star"></i> أحدث المنتجات</div>
      </div>
      <div class="product-grid">${newest.map(productCard).join('')}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title"><i class="fa fa-store"></i> المتاجر المميزة</div>
        <a href="#" class="section-link" onclick="navigate('stores')">جميع المتاجر</a>
      </div>
      <div class="stores-grid">${state.stores.slice(0,4).map(storeCard).join('')}</div>
    </section>`}
  </div>`;
}

function productCard(p) {
  const store = state.stores.find(s => s.id === p.storeId);
  const img = p.images && p.images.length ? `<img src="${p.images[0]}" alt="${p.name}" />` : `<i class="fa ${catIcon(p.category)}"></i>`;
  const rank = rankScore(p);
  return `
  <div class="product-card" onclick="viewProduct('${p.id}')">
    <span class="product-badge ${p.condition==='used'?'badge-used':p.pinned?'badge-top':'badge-new'}">${p.condition==='used'?'مستعمل':p.pinned?'مثبت':'جديد'}</span>
    <div class="product-card-img">${img}</div>
    <div class="product-card-body">
      <div class="product-card-title">${p.name}</div>
      ${store ? `<div class="product-card-shop"><i class="fa fa-store"></i>${store.name}</div>` : `<div class="product-card-shop"><i class="fa fa-user"></i>${getUser(p.sellerId)?.displayName||'مجهول'}</div>`}
      <div class="product-card-price">${fmtPrice(p.price)} <span>د.ع</span></div>
      <div class="product-card-footer">
        <div class="product-card-stats">
          <span><i class="fa fa-eye"></i>${p.views}</span>
          <span><i class="fa fa-shopping-cart"></i>${p.orders}</span>
          <span><i class="fa fa-star"></i>${p.rating||0}</span>
        </div>
        ${state.currentUser?.type==='buyer' ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();addToCart('${p.id}')"><i class="fa fa-cart-plus"></i></button>` : ''}
      </div>
    </div>
  </div>`;
}

function storeCard(st) {
  const owner = getUser(st.ownerId);
  const init = st.name[0];
  const logo = st.logo ? `<img src="${st.logo}" alt="${st.name}" style="width:100%;height:100%;object-fit:cover;" />` : init;
  return `
  <div class="store-card" onclick="navigate('store','${st.id}')">
    <div class="store-card-cover"></div>
    <div class="store-card-logo">${logo}</div>
    <div class="store-card-body">
      <div class="store-card-name">${st.name}</div>
      <div class="store-card-desc">${st.desc||''}</div>
      <div class="d-flex align-center gap-8 mb-16">
        <div class="stars">${starRating(st.rating)}</div>
        <span class="fs-12 text-gray">${st.rating||0}</span>
      </div>
      <div class="store-card-stats">
        <span><i class="fa fa-box"></i> ${st.products} منتج</span>
        <span><i class="fa fa-shopping-bag"></i> ${st.sales} بيعة</span>
      </div>
    </div>
  </div>`;
}

// ============================================================
// LOGIN / REGISTER
// ============================================================
function renderLogin() {
  return `
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <div class="logo-sq" style="margin:0 auto 8px;width:52px;height:52px;font-size:28px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;font-weight:900;">S</div>
        <h1>تسجيل الدخول</h1>
        <p>أهلاً بعودتك إلى سـوك</p>
      </div>
      <div class="form-group">
        <label>اسم المستخدم <span class="req">*</span></label>
        <input type="text" id="l-user" class="form-control" placeholder="أدخل اسم المستخدم" />
      </div>
      <div class="form-group">
        <label>كلمة المرور <span class="req">*</span></label>
        <input type="password" id="l-pass" class="form-control" placeholder="أدخل كلمة المرور" />
       
      </div>
      <button class="btn btn-primary btn-full" onclick="handleLogin()"><i class="fa fa-sign-in-alt"></i> دخول</button>
      <div class="auth-footer">ليس لديك حساب؟ <a href="#" onclick="navigate('register')">إنشاء حساب</a></div>
    </div>
  </div>`;
}

function handleLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value.trim();
  if (!u || !p) { toast('يرجى إدخال جميع البيانات', 'warning'); return; }
  loginUser(u, p);
}

function renderRegister() {
  return `
  <div class="auth-page">
    <div class="auth-card" style="max-width:500px;">
      <div class="auth-logo">
        <div class="logo-sq" style="margin:0 auto 8px;width:52px;height:52px;font-size:28px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;font-weight:900;">S</div>
        <h1>إنشاء حساب</h1>
        <p>انضم إلى مجتمع سـوك الإلكتروني</p>
      </div>

      <p style="font-size:13px;color:var(--gray);margin-bottom:14px;font-weight:600;">نوع الحساب</p>
      <div class="account-type-grid">
        <div class="account-type-btn active" id="type-buyer" onclick="selectRegType('buyer')">
          <i class="fa fa-shopping-bag"></i>
          <p>مشتري</p>
          <span>تصفح واشتري</span>
        </div>
        <div class="account-type-btn" id="type-seller" onclick="selectRegType('seller')">
          <i class="fa fa-store"></i>
          <p>بائع</p>
          <span>افتح متجرك</span>
        </div>
      </div>
      <input type="hidden" id="reg-type" value="buyer" />

      <div class="form-group">
        <label>الاسم الكامل <span class="req">*</span></label>
        <input type="text" id="reg-name" class="form-control" placeholder="اسمك الكامل" />
      </div>
      <div class="form-group">
        <label>اسم المستخدم <span class="req">*</span></label>
        <input type="text" id="reg-user" class="form-control" placeholder="يجب أن يكون فريداً" />
      </div>
      <div class="form-group">
        <label>كلمة المرور <span class="req">*</span></label>
        <input type="password" id="reg-pass" class="form-control" placeholder="٦ أحرف على الأقل" />
      </div>

      <div id="seller-fields" style="display:none;">
        <hr class="divider" style="margin:16px 0;" />
        <p style="font-size:13px;color:var(--blue-l);font-weight:700;margin-bottom:14px;"><i class="fa fa-store"></i> بيانات المتجر</p>
        <div class="form-group">
          <label>اسم المتجر <span class="req">*</span></label>
          <input type="text" id="reg-store" class="form-control" placeholder="اسم متجرك" />
        </div>
        <div class="form-group">
          <label>وصف المتجر</label>
          <textarea id="reg-desc" class="form-control" rows="3" placeholder="صف متجرك باختصار..."></textarea>
        </div>
      </div>

      <button class="btn btn-primary btn-full mt-16" onclick="handleRegister()"><i class="fa fa-user-plus"></i> إنشاء الحساب</button>
      <div class="auth-footer">لديك حساب؟ <a href="#" onclick="navigate('login')">تسجيل الدخول</a></div>
    </div>
  </div>`;
}

function selectRegType(t) {
  document.getElementById('reg-type').value = t;
  document.getElementById('type-buyer').classList.toggle('active', t==='buyer');
  document.getElementById('type-seller').classList.toggle('active', t==='seller');
  document.getElementById('seller-fields').style.display = t==='seller'?'block':'none';
}

function handleRegister() {
  const type = document.getElementById('reg-type').value;
  const name = document.getElementById('reg-name').value.trim();
  const user = document.getElementById('reg-user').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  if (!name||!user||!pass) { toast('يرجى ملء جميع الحقول المطلوبة', 'warning'); return; }
  if (pass.length < 4) { toast('كلمة المرور قصيرة جداً', 'warning'); return; }
  const data = { type, displayName: name, username: user, password: pass };
  if (type === 'seller') {
    data.storeName = document.getElementById('reg-store').value.trim();
    data.storeDesc = document.getElementById('reg-desc').value.trim();
    if (!data.storeName) { toast('يرجى إدخال اسم المتجر', 'warning'); return; }
  }
  registerUser(data);
}

// ============================================================
// DASHBOARD ROUTER
// ============================================================
function renderDashboard() {
  if (!state.currentUser) return `<div class="container" style="padding:60px 0;text-align:center;"><p>يجب تسجيل الدخول أولاً.</p><button class="btn btn-primary mt-20" onclick="navigate('login')">تسجيل الدخول</button></div>`;
  const u = state.currentUser;
  if (u.type === 'developer') return renderDevDashboard();
  if (u.type === 'seller') return renderSellerDashboard();
  return renderBuyerDashboard();
}

// ── DEV DASHBOARD ──────────────────────────────────────────
function renderDevDashboard() {
  const tab = state.devTab || 'stats';
  const completed = state.orders.filter(o=>o.status==='completed').length;
  const pending = state.orders.filter(o=>o.status==='pending').length;
  const revenue = state.orders.filter(o=>o.status==='completed').reduce((s,o)=>s+o.total,0);
  const usedCount = state.products.filter(p=>p.condition==='used').length;

  const tabs = [
    ['stats','fa-chart-bar','الإحصائيات'],
    ['accounts','fa-users','الحسابات'],
    ['stores','fa-store','المتاجر'],
    ['products','fa-box','المنتجات'],
    ['orders','fa-shopping-cart','الطلبات'],
    ['tickets','fa-ticket-alt','التذاكر'],
    ['settings','fa-cog','الإعدادات'],
  ];

  let content = '';
  if (tab === 'stats') {
    content = `
    <div class="stats-grid">
      ${statCard('fa-users','عدد المستخدمين',state.users.length,'stat-blue')}
      ${statCard('fa-store','البائعين',state.users.filter(u=>u.type==='seller').length,'stat-cyan')}
      ${statCard('fa-shopping-bag','المتاجر',state.stores.length,'stat-green')}
      ${statCard('fa-box','المنتجات',state.products.length,'stat-yellow')}
      ${statCard('fa-recycle','المستعمل',usedCount,'stat-yellow')}
      ${statCard('fa-shopping-cart','الطلبات',state.orders.length,'stat-blue')}
      ${statCard('fa-check','مكتملة',completed,'stat-green')}
      ${statCard('fa-clock','معلقة',pending,'stat-red')}
      ${statCard('fa-money-bill','الإيرادات',fmtPrice(revenue)+' د.ع','stat-cyan')}
      ${statCard('fa-ticket-alt','التذاكر',state.tickets.length,'stat-red')}
    </div>`;
  }
  else if (tab === 'accounts') {
    content = `
    <div class="table-wrap">
      <div class="table-header"><h3><i class="fa fa-users"></i> إدارة الحسابات</h3></div>
      <div style="overflow-x:auto;">
        <table>
          <thead><tr><th>المستخدم</th><th>النوع</th><th>المتجر</th><th>التسجيل</th><th>آخر دخول</th><th>الحالة</th><th>إجراءات</th></tr></thead>
          <tbody>
          ${state.users.map(u => `
            <tr>
              <td><div class="d-flex align-center gap-8"><div class="td-avatar">${u.displayName[0]}</div><div><div style="font-size:13px;font-weight:700;">${u.displayName}</div><div style="font-size:11px;color:var(--gray);">@${u.username}</div></div></div></td>
              <td><span class="tag ${u.type==='developer'?'tag-blue':u.type==='seller'?'tag-cyan':'tag-green'}">${u.type==='developer'?'مطور':u.type==='seller'?'بائع':'مشتري'}</span></td>
              <td>${u.storeId ? (state.stores.find(s=>s.id===u.storeId)?.name||'-') : '-'}</td>
              <td class="text-gray fs-12">${fmtDate(u.createdAt)}</td>
              <td class="text-gray fs-12">${fmtDate(u.lastLogin)}</td>
              <td><span class="tag ${u.banned?'tag-red':'tag-green'}">${u.banned?'محظور':'نشط'}</span></td>
              <td><div class="actions-cell">
                ${u.type!=='developer' ? `
                <button class="btn btn-sm ${u.banned?'btn-success':'btn-danger'}" onclick="toggleBan('${u.id}')">${u.banned?'إلغاء حظر':'حظر'}</button>
                <button class="btn btn-sm btn-secondary" onclick="promptChangePass('${u.id}')"><i class="fa fa-key"></i></button>
                <button class="btn btn-sm btn-danger" onclick="confirmDelete('${u.id}')"><i class="fa fa-trash"></i></button>` : '<span class="text-gray fs-12">محمي</span>'}
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  else if (tab === 'stores') {
    content = `
    <div class="table-wrap">
      <div class="table-header"><h3><i class="fa fa-store"></i> إدارة المتاجر</h3></div>
      <div style="overflow-x:auto;">
        <table>
          <thead><tr><th>الشعار</th><th>المتجر</th><th>المالك</th><th>المنتجات</th><th>المبيعات</th><th>الإيرادات</th><th>التقييم</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
          <tbody>
          ${state.stores.map(st => {
            const owner = getUser(st.ownerId);
            return `<tr>
              <td><div class="td-avatar" style="border-radius:8px;">${st.logo?`<img src="${st.logo}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`:st.name[0]}</div></td>
              <td><div style="font-weight:700;font-size:13px;">${st.name}</div><div style="font-size:11px;color:var(--gray);">${st.desc||''}</div></td>
              <td class="fs-13">${owner?.displayName||'-'}</td>
              <td class="fs-13">${st.products}</td>
              <td class="fs-13">${st.sales}</td>
              <td class="text-cyan fs-13">${fmtPrice(st.revenue)} د.ع</td>
              <td>${starRating(st.rating)} <span class="fs-12 text-gray">${st.rating||0}</span></td>
              <td class="text-gray fs-12">${fmtDate(st.createdAt)}</td>
              <td><div class="actions-cell">
                <button class="btn btn-sm btn-secondary" onclick="promptEditStore('${st.id}')"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteStore('${st.id}')"><i class="fa fa-trash"></i></button>
              </div></td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  else if (tab === 'products') {
    content = `
    <div class="table-wrap">
      <div class="table-header"><h3><i class="fa fa-box"></i> إدارة المنتجات</h3></div>
      <div style="overflow-x:auto;">
        <table>
          <thead><tr><th>المنتج</th><th>البائع</th><th>القسم</th><th>السعر</th><th>الكمية</th><th>المشاهدات</th><th>الطلبات</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
          <tbody>
          ${state.products.map(p => {
            const seller = getUser(p.sellerId);
            return `<tr>
              <td><div class="d-flex align-center gap-8"><div class="td-avatar" style="border-radius:6px;background:var(--bg3);color:var(--gray2);"><i class="fa ${catIcon(p.category)} fs-12"></i></div><div><div style="font-size:13px;font-weight:700;">${p.name}</div><span class="tag ${p.condition==='used'?'tag-yellow':'tag-blue'}">${p.condition==='used'?'مستعمل':'جديد'}</span></div></div></td>
              <td class="fs-13">${seller?.displayName||'-'}</td>
              <td>${catLabel(p.category)}</td>
              <td class="text-cyan fs-13">${fmtPrice(p.price)} د.ع</td>
              <td class="fs-13">${p.qty}</td>
              <td class="text-gray fs-12">${p.views}</td>
              <td class="text-gray fs-12">${p.orders}</td>
              <td class="text-gray fs-12">${fmtDate(p.createdAt)}</td>
              <td><div class="actions-cell">
                <button class="btn btn-sm ${p.pinned?'btn-success':'btn-secondary'}" onclick="togglePin('${p.id}')" title="تثبيت"><i class="fa fa-thumbtack"></i></button>
                <button class="btn btn-sm ${p.hidden?'btn-danger':'btn-secondary'}" onclick="toggleHide('${p.id}')" title="إخفاء"><i class="fa ${p.hidden?'fa-eye':'fa-eye-slash'}"></i></button>
                <button class="btn btn-sm btn-danger" onclick="adminDeleteProduct('${p.id}')"><i class="fa fa-trash"></i></button>
              </div></td>
            </tr>`;}).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  else if (tab === 'orders') {
    content = devOrdersHTML();
  }
  else if (tab === 'tickets') {
    content = devTicketsHTML();
  }
  else if (tab === 'settings') {
    content = `
    <div class="panel">
      <div class="panel-header"><h3><i class="fa fa-cog"></i> إعدادات الموقع</h3></div>
      <div class="panel-body">
        <div class="form-group"><label>اسم الموقع</label><input type="text" id="set-name" class="form-control" value="${state.settings.siteName}" /></div>
        <div class="form-group"><label>الأقسام (مفصولة بفاصلة)</label><input type="text" id="set-cats" class="form-control" value="${state.settings.categories.join(',')}" /></div>
        <div class="d-flex gap-12 mt-16">
          <button class="btn btn-primary" onclick="saveSettings()"><i class="fa fa-save"></i> حفظ الإعدادات</button>
          <button class="btn btn-danger" onclick="confirmReset()"><i class="fa fa-redo"></i> إعادة تعيين النظام</button>
        </div>
      </div>
    </div>`;
  }

  return dashboardLayout(tabs, tab, 'dev', content);
}

function devOrdersHTML() {
  return `
  <div class="table-wrap">
    <div class="table-header"><h3><i class="fa fa-shopping-cart"></i> جميع الطلبات</h3></div>
    <div style="overflow-x:auto;">
      <table>
        <thead><tr><th>#</th><th>المشتري</th><th>البائع</th><th>المجموع</th><th>الهاتف</th><th>المحافظة</th><th>الحالة</th><th>التاريخ</th><th>تحديث</th></tr></thead>
        <tbody>
        ${state.orders.map((o,i) => {
          const buyer = getUser(o.buyerId);
          const seller = getUser(o.sellerId);
          return `<tr>
            <td class="text-gray fs-12">${i+1}</td>
            <td class="fs-13">${buyer?.displayName||'-'}</td>
            <td class="fs-13">${seller?.displayName||'-'}</td>
            <td class="text-cyan fs-13">${fmtPrice(o.total)} د.ع</td>
            <td class="fs-12 text-gray">${o.phone}</td>
            <td class="fs-12 text-gray">${o.province||'-'}</td>
            <td><span class="order-status status-${o.status}">${statusLabel(o.status)}</span></td>
            <td class="text-gray fs-12">${fmtDate(o.createdAt)}</td>
            <td>
              <select onchange="updateOrderStatus('${o.id}',this.value)" style="background:var(--bg3);border:1px solid var(--border);color:var(--white);padding:5px 8px;border-radius:6px;font-size:12px;">
                <option value="pending" ${o.status==='pending'?'selected':''}>معلق</option>
                <option value="processing" ${o.status==='processing'?'selected':''}>جاري</option>
                <option value="completed" ${o.status==='completed'?'selected':''}>مكتمل</option>
                <option value="cancelled" ${o.status==='cancelled'?'selected':''}>ملغي</option>
              </select>
            </td>
          </tr>`;}).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function devTicketsHTML() {
  return `
  <div>
    ${state.tickets.map(t => {
      const u = getUser(t.userId);
      return `
      <div class="ticket-card">
        <div class="ticket-header">
          <div>
            <div class="ticket-title">${t.subject}</div>
            <div class="ticket-meta"><i class="fa fa-user"></i> ${u?.displayName||'-'} · ${fmtDate(t.createdAt)}</div>
          </div>
          <div class="d-flex gap-8">
            <span class="tag ${t.status==='open'?'tag-yellow':'tag-green'}">${t.status==='open'?'مفتوح':'مغلق'}</span>
            <button class="btn btn-sm btn-danger" onclick="deleteTicket('${t.id}')"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <p style="font-size:13px;color:var(--gray);margin:8px 0;">${t.body}</p>
        ${t.replies.map(r => `<div class="ticket-reply ${r.userId==='dev-1'?'admin-reply':''}"><div style="font-size:12px;font-weight:700;margin-bottom:4px;">${r.userId==='dev-1'?'المطور':getUser(r.userId)?.displayName||'-'}</div><div style="font-size:13px;">${r.body}</div></div>`).join('')}
        <div class="d-flex gap-8 mt-12">
          <input type="text" id="tr-${t.id}" class="form-control" placeholder="اكتب رداً..." style="font-size:13px;" />
          <button class="btn btn-primary btn-sm" onclick="replyTicket('${t.id}')"><i class="fa fa-reply"></i> رد</button>
          <button class="btn btn-sm ${t.status==='open'?'btn-success':'btn-secondary'}" onclick="toggleTicketStatus('${t.id}')">${t.status==='open'?'إغلاق':'إعادة فتح'}</button>
        </div>
      </div>`;}).join('')}
    ${!state.tickets.length ? emptyState('fa-ticket-alt','لا توجد تذاكر','لا توجد تذاكر دعم حالياً') : ''}
  </div>`;
}

// ── SELLER DASHBOARD ─────────────────────────────────────
function renderSellerDashboard() {
  const u = state.currentUser;
  const store = state.stores.find(s => s.id === u.storeId);
  const myProducts = state.products.filter(p => p.storeId === u.storeId);
  const myOrders = state.orders.filter(o => o.sellerId === u.id);
  const myTickets = state.tickets.filter(t => t.userId === u.id);
  const revenue = myOrders.filter(o=>o.status==='completed').reduce((s,o)=>s+o.total,0);
  const tab = state.selTab || 'overview';

  const tabs = [
    ['overview','fa-tachometer-alt','نظرة عامة'],
    ['products','fa-box','منتجاتي'],
    ['add-product','fa-plus-circle','إضافة منتج'],
    ['orders','fa-shopping-cart','الطلبات'],
    ['tickets','fa-ticket-alt','تذاكر الدعم'],
    ['settings','fa-cog','إعدادات المتجر'],
  ];

  let content = '';
  if (tab === 'overview') {
    content = `
    <div class="stats-grid">
      ${statCard('fa-box','منتجاتي',myProducts.length,'stat-blue')}
      ${statCard('fa-shopping-cart','الطلبات',myOrders.length,'stat-cyan')}
      ${statCard('fa-check','مكتملة',myOrders.filter(o=>o.status==='completed').length,'stat-green')}
      ${statCard('fa-money-bill','الإيرادات',fmtPrice(revenue)+' د.ع','stat-yellow')}
    </div>
    ${store ? `
    <div class="panel">
      <div class="panel-header"><h3><i class="fa fa-store"></i> معلومات متجري</h3></div>
      <div class="panel-body d-flex align-center gap-16">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff;">${store.name[0]}</div>
        <div>
          <div style="font-size:18px;font-weight:800;">${store.name}</div>
          <div style="font-size:13px;color:var(--gray);">${store.desc||''}</div>
          <div class="d-flex gap-12 mt-8 fs-12 text-gray">
            <span><i class="fa fa-star text-yellow"></i> ${store.rating||0}</span>
            <span><i class="fa fa-shopping-bag"></i> ${store.sales} بيعة</span>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" style="margin-right:auto;" onclick="navigate('store','${store.id}')"><i class="fa fa-eye"></i> عرض المتجر</button>
      </div>
    </div>` : ''}
    <div class="panel">
      <div class="panel-header"><h3><i class="fa fa-clock"></i> آخر الطلبات</h3></div>
      <div class="panel-body">
        ${myOrders.slice(0,5).map(o => orderCard(o,false)).join('')}
        ${!myOrders.length ? '<p class="text-gray fs-13">لا توجد طلبات بعد.</p>' : ''}
      </div>
    </div>`;
  }
  else if (tab === 'products') {
    content = `
    <div class="d-flex gap-12 mb-20">
      <button class="btn btn-primary" onclick="setTab('sel','add-product')"><i class="fa fa-plus"></i> إضافة منتج</button>
    </div>
    <div class="product-grid">
      ${myProducts.map(p => `
      <div class="product-card">
        <span class="product-badge ${p.condition==='used'?'badge-used':'badge-new'}">${p.condition==='used'?'مستعمل':'جديد'}</span>
        <div class="product-card-img" style="cursor:default;">${p.images?.length?`<img src="${p.images[0]}"/>`:`<i class="fa ${catIcon(p.category)}"></i>`}</div>
        <div class="product-card-body">
          <div class="product-card-title">${p.name}</div>
          <div class="product-card-price">${fmtPrice(p.price)} <span>د.ع</span></div>
          <div class="product-card-footer">
            <div class="product-card-stats"><span><i class="fa fa-eye"></i>${p.views}</span><span><i class="fa fa-box"></i>${p.qty}</span></div>
            <div class="d-flex gap-8">
              <button class="btn btn-sm btn-secondary" onclick="openEditProduct('${p.id}')"><i class="fa fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" onclick="sellerDeleteProduct('${p.id}')"><i class="fa fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>`).join('')}
      ${!myProducts.length ? emptyState('fa-box','لا توجد منتجات','أضف منتجاً للبدء','setTab(\'sel\',\'add-product\')','إضافة منتج') : ''}
    </div>`;
  }
  else if (tab === 'add-product') {
    content = addProductForm();
  }
  else if (tab === 'edit-product') {
    content = editProductForm(state.editProductId);
  }
  else if (tab === 'orders') {
    content = `
    <div class="panel">
      <div class="panel-header"><h3><i class="fa fa-shopping-cart"></i> طلبات المتجر</h3></div>
      <div class="panel-body">
        ${myOrders.map(o => orderCard(o,true)).join('')}
        ${!myOrders.length ? emptyState('fa-shopping-cart','لا توجد طلبات','ستظهر الطلبات هنا عند وصولها') : ''}
      </div>
    </div>`;
  }
  else if (tab === 'tickets') {
    content = `<div>${myTickets.map(t => ticketCard(t)).join('')}${!myTickets.length?emptyState('fa-ticket-alt','لا توجد تذاكر','تواصل مع الدعم إذا واجهت مشكلة'):''}
    <div class="panel mt-20">
      <div class="panel-header"><h3><i class="fa fa-plus"></i> تذكرة جديدة</h3></div>
      <div class="panel-body">${newTicketForm()}</div>
    </div></div>`;
  }
  else if (tab === 'settings') {
    content = storeSettingsForm(store);
  }

  return dashboardLayout(tabs, tab, 'sel', content);
}

// ── BUYER DASHBOARD ─────────────────────────────────────
function renderBuyerDashboard() {
  const u = state.currentUser;
  const myOrders = state.orders.filter(o => o.buyerId === u.id);
  const myTickets = state.tickets.filter(t => t.userId === u.id);
  const tab = state.buyTab || 'overview';

  const tabs = [
    ['overview','fa-tachometer-alt','نظرة عامة'],
    ['orders','fa-shopping-cart','طلباتي'],
    ['add-used','fa-plus-circle','بيع قطعة مستعملة'],
    ['tickets','fa-ticket-alt','تذاكر الدعم'],
  ];

  let content = '';
  if (tab === 'overview') {
    content = `
    <div class="stats-grid">
      ${statCard('fa-shopping-cart','طلباتي',myOrders.length,'stat-blue')}
      ${statCard('fa-check','مكتملة',myOrders.filter(o=>o.status==='completed').length,'stat-green')}
      ${statCard('fa-clock','معلقة',myOrders.filter(o=>o.status==='pending').length,'stat-yellow')}
      ${statCard('fa-recycle','قطع مباعة',state.products.filter(p=>p.sellerId===u.id&&p.condition==='used').length,'stat-cyan')}
    </div>
    <div class="panel">
      <div class="panel-header"><h3><i class="fa fa-clock"></i> آخر الطلبات</h3></div>
      <div class="panel-body">
        ${myOrders.slice(0,5).map(o => orderCard(o,false)).join('')}
        ${!myOrders.length ? '<p class="text-gray fs-13">لم تقم بأي طلب بعد. <a href="#" onclick="navigate(\'home\')">تصفح المنتجات</a></p>' : ''}
      </div>
    </div>`;
  }
  else if (tab === 'orders') {
    content = `<div class="panel"><div class="panel-header"><h3>طلباتي</h3></div><div class="panel-body">${myOrders.map(o=>orderCard(o,false)).join('')}${!myOrders.length?emptyState('fa-shopping-cart','لا توجد طلبات','ابدأ التسوق الآن','navigate(\'home\')','تصفح المنتجات'):''}</div></div>`;
  }
  else if (tab === 'add-used') {
    content = addUsedProductForm();
  }
  else if (tab === 'tickets') {
    content = `<div>${myTickets.map(t => ticketCard(t)).join('')}${!myTickets.length?emptyState('fa-ticket-alt','لا توجد تذاكر',''):''}<div class="panel mt-20"><div class="panel-header"><h3><i class="fa fa-plus"></i> تذكرة جديدة</h3></div><div class="panel-body">${newTicketForm()}</div></div></div>`;
  }

  return dashboardLayout(tabs, tab, 'buy', content);
}

// ── DASHBOARD LAYOUT ─────────────────────────────────────
function dashboardLayout(tabs, activeTab, prefix, content) {
  const u = state.currentUser;
  const typeLabel = u.type==='developer'?'مطور':u.type==='seller'?'بائع':'مشتري';
  const tabKey = prefix==='dev'?'devTab':prefix==='sel'?'selTab':'buyTab';
  return `
  <div class="container" style="padding-top:20px;">
    <div class="breadcrumb"><a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i><span>لوحة التحكم</span></div>
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-title">لوحة ${typeLabel} – ${u.displayName}</div>
        ${tabs.map(([key,icon,label]) => `<div class="sidebar-item ${activeTab===key?'active':''}" onclick="setTab('${prefix}','${key}')"><i class="fa ${icon}"></i>${label}</div>`).join('')}
        <hr class="sidebar-divider" />
        <div class="sidebar-item" onclick="navigate('home')"><i class="fa fa-home"></i> الرئيسية</div>
        <div class="sidebar-item" onclick="logoutUser()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</div>
      </aside>
      <div class="dashboard-content">
        <div style="margin-bottom:24px;">
          <h2 style="font-size:20px;font-weight:800;">${tabs.find(t=>t[0]===activeTab)?.[2]||''}</h2>
        </div>
        ${content}
      </div>
    </div>
  </div>`;
}

function setTab(prefix, tab) {
  if (prefix === 'dev') state.devTab = tab;
  else if (prefix === 'sel') state.selTab = tab;
  else state.buyTab = tab;
  render();
}

// ============================================================
// ADD / EDIT PRODUCT FORMS
// ============================================================
function addProductForm(editing) {
  const cats = [['gpu','كروت الشاشة'],['cpu','المعالجات'],['laptop','اللابتوبات'],['monitor','الشاشات'],['gaming','أجهزة الألعاب'],['accessories','إكسسوارات']];
  return `
  <div class="panel">
    <div class="panel-header"><h3><i class="fa fa-plus-circle"></i> ${editing?'تعديل المنتج':'إضافة منتج جديد'}</h3></div>
    <div class="panel-body">
      <div class="form-group"><label>اسم المنتج <span class="req">*</span></label><input type="text" id="ap-name" class="form-control" placeholder="اسم المنتج" /></div>
      <div class="form-group"><label>وصف المنتج <span class="req">*</span></label><textarea id="ap-desc" class="form-control" rows="4" placeholder="وصف تفصيلي..."></textarea></div>
      <div class="form-row">
        <div class="form-group">
          <label>القسم <span class="req">*</span></label>
          <select id="ap-cat" class="form-control">${cats.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>حالة المنتج <span class="req">*</span></label>
          <select id="ap-cond" class="form-control"><option value="new">جديد</option><option value="used">مستعمل</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>السعر (د.ع) <span class="req">*</span></label><input type="number" id="ap-price" class="form-control" placeholder="0" /></div>
        <div class="form-group"><label>الكمية <span class="req">*</span></label><input type="number" id="ap-qty" class="form-control" value="1" min="1" /></div>
      </div>
      <div class="form-group">
        <label>صور المنتج</label>
        <div class="img-upload-area" id="ap-upload-area">
          <input type="file" id="ap-imgs" multiple accept="image/*" onchange="previewImages('ap-imgs','ap-previews')" />
          <i class="fa fa-cloud-upload-alt"></i>
          <p>اضغط أو اسحب صوراً هنا (يمكن اختيار أكثر من صورة)</p>
        </div>
        <div class="img-previews" id="ap-previews"></div>
      </div>
      <button class="btn btn-primary" onclick="submitAddProduct()"><i class="fa fa-save"></i> ${editing?'حفظ التعديلات':'إضافة المنتج'}</button>
    </div>
  </div>`;
}

function editProductForm(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return '<p>المنتج غير موجود.</p>';
  const cats = [['gpu','كروت الشاشة'],['cpu','المعالجات'],['laptop','اللابتوبات'],['monitor','الشاشات'],['gaming','أجهزة الألعاب'],['accessories','إكسسوارات']];
  return `
  <div class="panel">
    <div class="panel-header"><h3><i class="fa fa-edit"></i> تعديل: ${p.name}</h3></div>
    <div class="panel-body">
      <div class="form-group"><label>اسم المنتج</label><input type="text" id="ep-name" class="form-control" value="${p.name}" /></div>
      <div class="form-group"><label>الوصف</label><textarea id="ep-desc" class="form-control" rows="4">${p.desc}</textarea></div>
      <div class="form-row">
        <div class="form-group"><label>القسم</label><select id="ep-cat" class="form-control">${cats.map(([v,l])=>`<option value="${v}" ${p.category===v?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="form-group"><label>الحالة</label><select id="ep-cond" class="form-control"><option value="new" ${p.condition==='new'?'selected':''}>جديد</option><option value="used" ${p.condition==='used'?'selected':''}>مستعمل</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>السعر</label><input type="number" id="ep-price" class="form-control" value="${p.price}" /></div>
        <div class="form-group"><label>الكمية</label><input type="number" id="ep-qty" class="form-control" value="${p.qty}" /></div>
      </div>
      <div class="d-flex gap-12 mt-16">
        <button class="btn btn-primary" onclick="submitEditProduct('${pid}')"><i class="fa fa-save"></i> حفظ</button>
        <button class="btn btn-secondary" onclick="setTab('sel','products')">إلغاء</button>
      </div>
    </div>
  </div>`;
}

async function submitAddProduct() {
  const u = state.currentUser;
  const name = document.getElementById('ap-name').value.trim();
  const desc = document.getElementById('ap-desc').value.trim();
  const cat = document.getElementById('ap-cat').value;
  const cond = document.getElementById('ap-cond').value;
  const price = parseFloat(document.getElementById('ap-price').value);
  const qty = parseInt(document.getElementById('ap-qty').value)||1;
  if (!name||!price) { toast('يرجى ملء الحقول المطلوبة','warning'); return; }
  const imgs = Array.from(document.querySelectorAll('#ap-previews img')).map(i=>i.src);
  const p = { id:'p-'+Date.now(), storeId:u.storeId, sellerId:u.id, sellerName:u.displayName, name, price, image:imgs[0]||'', images:imgs, description:desc, desc, category:cat, qty, condition:cond, views:0, orders:0, rating:0, pinned:false, hidden:false, createdAt:Date.now() };
  const saved = await addProductToFirestore(p);
  if (!saved) return;
  const st = state.stores.find(s=>s.id===u.storeId);
  if (st) st.products++;
  saveState();
  toast('تمت إضافة المنتج بنجاح','success');
  addNotif(`منتج جديد: ${name}`,'fa-box');
  setTab('sel','products');
}

async function submitEditProduct(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return;
  const desc = document.getElementById('ep-desc').value.trim();
  const saved = await updateProductInFirestore(pid, {
    name: document.getElementById('ep-name').value.trim()||p.name,
    description: desc,
    desc,
    category: document.getElementById('ep-cat').value,
    condition: document.getElementById('ep-cond').value,
    price: parseFloat(document.getElementById('ep-price').value)||p.price,
    qty: parseInt(document.getElementById('ep-qty').value)||p.qty
  });
  if (!saved) return;
  toast('تم تحديث المنتج','success');
  setTab('sel','products');
}

function openEditProduct(pid) {
  state.editProductId = pid;
  state.selTab = 'edit-product';
  render();
}

function addUsedProductForm() {
  const provinces = ['بغداد','البصرة','الموصل','أربيل','كركوك','النجف','كربلاء','الديوانية','الحلة','الكوت','العمارة','الناصرية','السماوة','الرمادي','بعقوبة','تكريت','الفلوجة','السليمانية','دهوك','الحي','المقدادية'];
  return `
  <div class="panel">
    <div class="panel-header"><h3><i class="fa fa-recycle"></i> بيع قطعة مستعملة</h3></div>
    <div class="panel-body">
      <div class="form-group"><label>عنوان المنتج <span class="req">*</span></label><input type="text" id="up-title" class="form-control" placeholder="مثال: كرت شاشة GTX 1080 مستعملة" /></div>
      <div class="form-group"><label>الوصف <span class="req">*</span></label><textarea id="up-desc" class="form-control" rows="4" placeholder="وصف حالة القطعة بالتفصيل..."></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>السعر (د.ع) <span class="req">*</span></label><input type="number" id="up-price" class="form-control" /></div>
        <div class="form-group"><label>المحافظة <span class="req">*</span></label><select id="up-prov" class="form-control">${provinces.map(p=>`<option>${p}</option>`).join('')}</select></div>
      </div>
      <div class="form-group">
        <label>القسم</label>
        <select id="up-cat" class="form-control">
          <option value="gpu">كروت الشاشة</option>
          <option value="cpu">المعالجات</option>
          <option value="laptop">اللابتوبات</option>
          <option value="monitor">الشاشات</option>
          <option value="gaming">أجهزة الألعاب</option>
          <option value="accessories">إكسسوارات</option>
        </select>
      </div>
      <div class="form-group">
        <label>صور القطعة</label>
        <div class="img-upload-area">
          <input type="file" id="up-imgs" multiple accept="image/*" onchange="previewImages('up-imgs','up-previews')" />
          <i class="fa fa-cloud-upload-alt"></i>
          <p>أضف صوراً واضحة للقطعة</p>
        </div>
        <div class="img-previews" id="up-previews"></div>
      </div>
      <button class="btn btn-primary" onclick="submitUsedProduct()"><i class="fa fa-plus-circle"></i> نشر الإعلان</button>
    </div>
  </div>`;
}

async function submitUsedProduct() {
  const u = state.currentUser;
  const name = document.getElementById('up-title').value.trim();
  const desc = document.getElementById('up-desc').value.trim();
  const price = parseFloat(document.getElementById('up-price').value);
  const province = document.getElementById('up-prov').value;
  const cat = document.getElementById('up-cat').value;
  if (!name||!price) { toast('يرجى ملء الحقول المطلوبة','warning'); return; }
  const imgs = Array.from(document.querySelectorAll('#up-previews img')).map(i=>i.src);
  const p = { id:'u-'+Date.now(), storeId:null, sellerId:u.id, sellerName:u.displayName, name, price, image:imgs[0]||'', images:imgs, description:desc, desc, category:cat, qty:1, condition:'used', province, views:0, orders:0, rating:0, pinned:false, hidden:false, createdAt:Date.now() };
  const saved = await addProductToFirestore(p);
  if (!saved) return;
  saveState();
  toast('تم نشر إعلانك بنجاح','success');
  navigate('used');
}

// ============================================================
// PRODUCT PAGE
// ============================================================
function renderProductPage(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return '<div class="container" style="padding:60px 0;">'+emptyState('fa-box','المنتج غير موجود','')+'</div>';
  p.views++;
  updateProductInFirestore(pid, { views: p.views });
  const store = state.stores.find(s=>s.id===p.storeId);
  const seller = getUser(p.sellerId);
  const reviews = state.orders.filter(o=>o.items.some(i=>i.productId===pid)&&o.review);

  return `
  <div class="container">
    <div class="breadcrumb">
      <a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i>
      <a href="#" onclick="filterCategory('${p.category}')">${catLabel(p.category)}</a><i class="fa fa-chevron-left"></i>
      <span>${p.name}</span>
    </div>
    <div class="product-page">
      <div>
        <div class="product-gallery">
          <div class="gallery-main" id="gallery-main">
            ${p.images?.length ? `<img src="${p.images[0]}" id="main-img" alt="${p.name}" />` : `<div class="no-img"><i class="fa ${catIcon(p.category)}"></i></div>`}
          </div>
          ${p.images?.length>1 ? `<div class="gallery-thumbs">${p.images.map((img,i)=>`<div class="gallery-thumb ${i===0?'active':''}" onclick="switchThumb(${i},'${img}',this)"><img src="${img}" /></div>`).join('')}</div>` : ''}
        </div>

        <div class="panel mt-16">
          <div class="panel-header"><h3><i class="fa fa-info-circle"></i> تفاصيل المنتج</h3></div>
          <div class="panel-body">
            <p style="font-size:14px;color:var(--gray);line-height:1.8;">${p.desc}</p>
            <div class="d-flex gap-12 mt-16 flex-wrap">
              <span class="tag tag-blue"><i class="fa ${catIcon(p.category)}"></i> ${catLabel(p.category)}</span>
              <span class="tag ${p.condition==='new'?'tag-cyan':'tag-yellow'}">${p.condition==='new'?'جديد':'مستعمل'}</span>
              ${p.province?`<span class="tag tag-green"><i class="fa fa-map-marker"></i> ${p.province}</span>`:''}
            </div>
            <div class="d-flex gap-24 mt-16">
              <div style="font-size:13px;color:var(--gray);"><i class="fa fa-eye"></i> ${p.views} مشاهدة</div>
              <div style="font-size:13px;color:var(--gray);"><i class="fa fa-shopping-cart"></i> ${p.orders} طلب</div>
              <div style="font-size:13px;color:var(--gray);"><i class="fa fa-star text-yellow"></i> ${p.rating||0} تقييم</div>
            </div>
          </div>
        </div>

        ${store ? `
        <div class="panel mt-16" onclick="navigate('store','${store.id}')" style="cursor:pointer;">
          <div class="panel-body d-flex align-center gap-16">
            <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#fff;">${store.name[0]}</div>
            <div><div style="font-weight:700;">${store.name}</div><div class="d-flex gap-8 mt-4"><div class="stars">${starRating(store.rating)}</div><span class="fs-12 text-gray">${store.rating||0}</span></div></div>
            <button class="btn btn-outline btn-sm" style="margin-right:auto;">عرض المتجر</button>
          </div>
        </div>` : seller ? `
        <div class="panel mt-16"><div class="panel-body d-flex align-center gap-12"><div class="td-avatar" style="width:40px;height:40px;font-size:16px;">${seller.displayName[0]}</div><div><div style="font-weight:700;">${seller.displayName}</div><div class="fs-12 text-gray">بائع خاص</div></div></div></div>` : ''}

        <div class="panel mt-16">
          <div class="panel-header"><h3><i class="fa fa-star"></i> التقييمات</h3></div>
          <div class="panel-body">
            ${reviews.length ? reviews.map(o=>reviewCard(o,pid)).join('') : '<p class="text-gray fs-13">لا توجد تقييمات بعد.</p>'}
            ${state.currentUser?.type==='buyer' ? ratingForm(pid) : ''}
          </div>
        </div>
      </div>

      <div class="product-info">
        <div class="product-info-card">
          <div class="product-price-big">${fmtPrice(p.price)} <span>د.ع</span></div>
          <div class="d-flex align-center gap-8 mt-8 mb-12">
            <span class="tag ${p.qty>0?'tag-green':'tag-red'}">${p.qty>0?`متوفر (${p.qty})`:'نفد المخزون'}</span>
          </div>
          ${p.qty>0 && state.currentUser?.type==='buyer' ? `
          <div class="form-group">
            <label>الكمية</label>
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(-1)">−</button>
              <span class="qty-display" id="qty-display">1</span>
              <button class="qty-btn" onclick="changeQty(1)">+</button>
            </div>
          </div>
          <button class="btn btn-primary btn-full mt-12" onclick="addToCartQty('${p.id}')"><i class="fa fa-cart-plus"></i> إضافة للسلة</button>
          <button class="btn btn-outline btn-full mt-8" onclick="buyNow('${p.id}')"><i class="fa fa-bolt"></i> شراء الآن</button>
          ` : !state.currentUser ? `<button class="btn btn-secondary btn-full mt-12" onclick="navigate('login')"><i class="fa fa-sign-in-alt"></i> سجل دخول للشراء</button>` : ''}
        </div>

        <div class="product-info-card">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px;"><i class="fa fa-shield-alt text-blue"></i> ضمان المتجر</div>
          <div style="font-size:12px;color:var(--gray);line-height:1.9;">
            <div><i class="fa fa-check text-green"></i> دفع عند الاستلام</div>
            <div><i class="fa fa-check text-green"></i> توصيل لجميع المحافظات</div>
            <div><i class="fa fa-check text-green"></i> إمكانية الإرجاع خلال 3 أيام</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

let currentQty = 1;
function changeQty(d) {
  currentQty = Math.max(1, currentQty + d);
  const el = document.getElementById('qty-display');
  if (el) el.textContent = currentQty;
}
function addToCartQty(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return;
  for (let i = 0; i < currentQty; i++) addToCart(pid, false);
  toast(`تمت إضافة ${currentQty} قطعة للسلة`, 'success');
  updateCartBadge();
}
function viewProduct(pid) {
  navigate('product', pid);
}

function reviewCard(o, pid) {
  const buyer = getUser(o.buyerId);
  // Use normal closing tags (no escaping like <\/div>) to avoid broken HTML / DOM
  return `<div class="review-item">
    <div class="review-header">
      <div class="review-author">
        <div class="td-avatar" style="width:28px;height:28px;font-size:11px;">${buyer?.displayName?.[0] || '?'}</div>
        ${buyer?.displayName || 'مجهول'}
      </div>
    </div>
    <div class="review-text">${o.review?.text || ''}</div>
  </div>`;
}



function ratingForm(pid) {
  return `
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
      <textarea id="rev-text" class="form-control" rows="3" placeholder="اكتب تعليقك..."></textarea>
      <button class="btn btn-primary btn-sm mt-12" onclick="submitReview('${pid}')"><i class="fa fa-comment-dots"></i> إرسال التعليق</button>
    </div>`;
}

function submitReview(pid) {
  const text = document.getElementById('rev-text').value.trim();
  if (!text) { toast('يرجى كتابة تعليق','warning'); return; }
  const u = state.currentUser;
  const ord = state.orders.find(o=>o.buyerId===u.id&&o.items.some(i=>i.productId===pid));
  if (ord) { ord.review = { text }; }
  saveState();
  toast('شكراً على تعليقك!','success');
  navigate('product',pid);
}


// ============================================================
// STORE PAGE
// ============================================================
function renderStorePage(storeId) {
  const store = state.stores.find(s=>s.id===storeId);
  if (!store) return '<div class="container"><p>المتجر غير موجود.</p></div>';
  const products = state.products.filter(p=>p.storeId===storeId&&!p.hidden);
  const owner = getUser(store.ownerId);

  return `
  <div class="container" style="padding-top:20px;">
    <div class="store-cover"></div>
    <div class="store-cover-logo">${store.name[0]}</div>
    <div class="d-flex align-center gap-16 mb-24">
      <div>
        <h1 style="font-size:24px;font-weight:900;">${store.name}</h1>
        <p style="color:var(--gray);font-size:14px;">${store.desc||''}</p>
        <div class="d-flex gap-16 mt-8 fs-12 text-gray">
          <span>${starRating(store.rating)} ${store.rating||0}</span>
          <span><i class="fa fa-shopping-bag"></i> ${store.sales} بيعة</span>
          <span><i class="fa fa-box"></i> ${products.length} منتج</span>
          <span><i class="fa fa-calendar"></i> منذ ${fmtDate(store.createdAt)}</span>
        </div>
      </div>
    </div>
    <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;"><i class="fa fa-box text-blue"></i> منتجات المتجر</h3>
    ${products.length ? `<div class="product-grid">${products.map(productCard).join('')}</div>` : emptyState('fa-box','لا توجد منتجات','لم يضف هذا المتجر أي منتجات بعد')}
  </div>`;
}

function renderStoresList() {
  return `
  <div class="container" style="padding:28px 0;">
    <h2 style="font-size:22px;font-weight:900;margin-bottom:24px;"><i class="fa fa-store text-blue"></i> جميع المتاجر</h2>
    <div class="stores-grid">${state.stores.map(storeCard).join('')}</div>
  </div>`;
}

// ============================================================
// CART
// ============================================================
function addToCart(pid, showToast=true) {
  if (!state.currentUser || state.currentUser.type !== 'buyer') {
    toast('يجب تسجيل الدخول كمشتري','warning'); return;
  }
  const p = state.products.find(x=>x.id===pid);
  if (!p||p.qty<=0) { toast('المنتج غير متوفر','error'); return; }
  const existing = state.cart.find(i=>i.productId===pid);
  if (existing) existing.qty++;
  else state.cart.push({ productId:pid, qty:1, price:p.price });
  saveState();
  if (showToast) toast('تمت الإضافة للسلة','success');
  updateCartBadge();
}

function buyNow(pid) {
  addToCart(pid, false);
  navigate('cart');
}

function renderCart() {
  if (!state.currentUser || state.currentUser.type!=='buyer') return `<div class="container" style="padding:60px 0;text-align:center;"><p>يجب تسجيل الدخول كمشتري</p><button class="btn btn-primary mt-16" onclick="navigate('login')">تسجيل الدخول</button></div>`;
  const items = state.cart;
  const total = items.reduce((s,i)=>s+(i.price*i.qty),0);

  return `
  <div class="container">
    <div class="breadcrumb"><a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i><span>سلة المشتريات</span></div>
    ${items.length ? `
    <div class="cart-page">
      <div>
        <div class="panel">
          <div class="panel-header"><h3><i class="fa fa-shopping-cart"></i> سلة المشتريات (${items.length} منتج)</h3></div>
          <div class="panel-body">
            ${items.map(item => {
              const p = state.products.find(x=>x.id===item.productId);
              if (!p) return '';
              return `
              <div class="cart-item">
                <div class="cart-item-img">${p.images?.length?`<img src="${p.images[0]}" />`:`<i class="fa ${catIcon(p.category)}"></i>`}</div>
                <div class="cart-item-info">
                  <div class="cart-item-title">${p.name}</div>
                  <div class="cart-item-price">${fmtPrice(p.price)} د.ع</div>
                  <div class="qty-control mt-8">
                    <button class="qty-btn" onclick="updateCartQty('${p.id}',-1)">−</button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${p.id}',1)">+</button>
                  </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${p.id}')"><i class="fa fa-times-circle"></i></button>
              </div>`;}).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="cart-summary">
          <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;">ملخص الطلب</h3>
          <div class="summary-row"><span>المجموع الفرعي</span><span>${fmtPrice(total)} د.ع</span></div>
          <div class="summary-row"><span>التوصيل</span><span class="text-green">مجاني</span></div>
          <div class="summary-row summary-total"><span>المجموع الكلي</span><span>${fmtPrice(total)} د.ع</span></div>
          <button class="btn btn-primary btn-full mt-16" onclick="navigate('checkout')"><i class="fa fa-credit-card"></i> إتمام الشراء</button>
          <button class="btn btn-secondary btn-full mt-8" onclick="navigate('home')">متابعة التسوق</button>
        </div>
      </div>
    </div>` : `
    <div class="section">${emptyState('fa-shopping-cart','السلة فارغة','لم تضف أي منتجات بعد','navigate(\'home\')','تصفح المنتجات')}</div>`}
  </div>`;
}

function updateCartQty(pid, d) {
  const item = state.cart.find(i=>i.productId===pid);
  if (!item) return;
  item.qty = Math.max(1, item.qty+d);
  saveState();
  render();
}
function removeFromCart(pid) {
  state.cart = state.cart.filter(i=>i.productId!==pid);
  saveState();
  render();
  updateCartBadge();
}

// ============================================================
// CHECKOUT
// ============================================================
function renderCheckout() {
  if (!state.cart.length) { navigate('cart'); return ''; }
  const provinces = ['بغداد','البصرة','الموصل','أربيل','كركوك','النجف','كربلاء','الديوانية','الحلة','الكوت','العمارة','الناصرية','السماوة','الرمادي','بعقوبة','تكريت','الفلوجة','السليمانية','دهوك','الحي','المقدادية'];
  const total = state.cart.reduce((s,i)=>s+(i.price*i.qty),0);

  return `
  <div class="container" style="max-width:600px;padding:28px 20px;">
    <div class="breadcrumb"><a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i><a href="#" onclick="navigate('cart')">السلة</a><i class="fa fa-chevron-left"></i><span>إتمام الطلب</span></div>
    <div class="checkout-step">
      <h3 style="font-size:16px;font-weight:800;margin-bottom:18px;"><i class="fa fa-map-marker-alt text-blue"></i> بيانات التوصيل</h3>
      <div class="form-group"><label>رقم الهاتف <span class="req">*</span></label><input type="tel" id="co-phone" class="form-control" placeholder="07XXXXXXXXX" /></div>
      <div class="form-group"><label>العنوان الكامل <span class="req">*</span></label><textarea id="co-addr" class="form-control" rows="3" placeholder="المحلة، الزقاق، رقم الدار..."></textarea></div>
      <div class="form-group"><label>المحافظة <span class="req">*</span></label><select id="co-prov" class="form-control">${provinces.map(p=>`<option>${p}</option>`).join('')}</select></div>
    </div>
    <div class="checkout-step">
      <h3 style="font-size:16px;font-weight:800;margin-bottom:14px;"><i class="fa fa-list text-blue"></i> ملخص الطلب</h3>
      ${state.cart.map(item=>{const p=state.products.find(x=>x.id===item.productId);return p?`<div class="summary-row"><span>${p.name} × ${item.qty}</span><span>${fmtPrice(p.price*item.qty)} د.ع</span></div>`:'';}).join('')}
      <div class="summary-row summary-total"><span>المجموع</span><span>${fmtPrice(total)} د.ع</span></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="placeOrder()"><i class="fa fa-check-circle"></i> تأكيد الطلب</button>
  </div>`;
}

function placeOrder() {
  const phone = document.getElementById('co-phone').value.trim();
  const addr = document.getElementById('co-addr').value.trim();
  const prov = document.getElementById('co-prov').value;
  if (!phone||!addr) { toast('يرجى إدخال جميع بيانات التوصيل','warning'); return; }

  const u = state.currentUser;
  // Group by seller
  const bySeller = {};
  state.cart.forEach(item => {
    const p = state.products.find(x=>x.id===item.productId);
    if (!p) return;
    const key = p.sellerId||'unknown';
    if (!bySeller[key]) bySeller[key] = { sellerId:p.sellerId, storeId:p.storeId, items:[] };
    bySeller[key].items.push({ productId:item.productId, qty:item.qty, price:item.price });
  });

  Object.values(bySeller).forEach(group => {
    const total = group.items.reduce((s,i)=>s+(i.price*i.qty),0);
    const ord = { id:'ord-'+Date.now()+Math.random().toString(36).slice(2), buyerId:u.id, sellerId:group.sellerId, storeId:group.storeId, items:group.items, total, phone, address:addr, province:prov, status:'pending', createdAt:Date.now() };
    state.orders.push(ord);
    // Update product orders count
    group.items.forEach(item => {
      const p = state.products.find(x=>x.id===item.productId);
      if (p) {
        p.orders += item.qty;
        p.qty = Math.max(0, p.qty-item.qty);
        updateProductInFirestore(p.id, { orders: p.orders, qty: p.qty });
      }
    });
    const st = state.stores.find(s=>s.id===group.storeId);
    if (st) st.sales++;
  });

  state.cart = [];
  saveState();
  toast('تم تقديم طلبك بنجاح! سيتم التواصل معك قريباً','success');
  addNotif('تم تأكيد طلبك! سيصل قريباً','fa-check-circle');
  navigate('orders');
}

// ============================================================
// ORDERS PAGE
// ============================================================
function renderOrders() {
  if (!state.currentUser) return `<div class="container" style="padding:60px 0;text-align:center;"><button class="btn btn-primary" onclick="navigate('login')">تسجيل الدخول</button></div>`;
  const u = state.currentUser;
  const myOrders = state.orders.filter(o => u.type==='buyer' ? o.buyerId===u.id : o.sellerId===u.id);

  return `
  <div class="container" style="padding:28px 0;">
    <div class="breadcrumb"><a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i><span>الطلبات</span></div>
    <h2 style="font-size:20px;font-weight:800;margin-bottom:20px;"><i class="fa fa-shopping-cart text-blue"></i> ${u.type==='buyer'?'طلباتي':'طلبات المتجر'}</h2>
    ${myOrders.map(o=>orderCard(o,u.type!=='buyer')).join('')}
    ${!myOrders.length ? emptyState('fa-shopping-cart','لا توجد طلبات','') : ''}
  </div>`;
}

function orderCard(o, showContact=false) {
  const total = fmtPrice(o.total);
  return `
  <div class="order-card">
    <div class="order-header">
      <div>
        <div style="font-size:13px;font-weight:700;">#${o.id.slice(-6)}</div>
        <div class="fs-12 text-gray">${fmtDate(o.createdAt)}</div>
      </div>
      <span class="order-status status-${o.status}">${statusLabel(o.status)}</span>
    </div>
    <div class="d-flex flex-wrap gap-12 fs-13">
      ${o.items.map(item=>{const p=state.products.find(x=>x.id===item.productId);return p?`<span><i class="fa fa-box text-blue"></i> ${p.name} × ${item.qty}</span>`:''}).join('')}
    </div>
    <div class="d-flex justify-between align-center mt-12">
      <div class="fs-13 text-cyan fw-700">${total} د.ع</div>
      ${showContact ? `<div class="fs-12 text-gray"><i class="fa fa-phone"></i> ${o.phone} | <i class="fa fa-map-marker"></i> ${o.province}</div>` : ''}
    </div>
  </div>`;
}

// ============================================================
// TICKETS
// ============================================================
function renderTickets() {
  if (!state.currentUser) return `<div class="container" style="padding:60px 0;text-align:center;"><button class="btn btn-primary" onclick="navigate('login')">تسجيل الدخول</button></div>`;
  const u = state.currentUser;
  const myTickets = state.tickets.filter(t=>t.userId===u.id);

  return `
  <div class="container" style="padding:28px 0;">
    <h2 style="font-size:20px;font-weight:800;margin-bottom:20px;"><i class="fa fa-ticket-alt text-blue"></i> تذاكر الدعم</h2>
    ${myTickets.map(t=>ticketCard(t)).join('')}
    ${!myTickets.length ? emptyState('fa-ticket-alt','لا توجد تذاكر','') : ''}
    <div class="panel mt-20"><div class="panel-header"><h3>تذكرة جديدة</h3></div><div class="panel-body">${newTicketForm()}</div></div>
  </div>`;
}

function ticketCard(t) {
  return `
  <div class="ticket-card">
    <div class="ticket-header">
      <div><div class="ticket-title">${t.subject}</div><div class="ticket-meta">${fmtDate(t.createdAt)}</div></div>
      <span class="tag ${t.status==='open'?'tag-yellow':'tag-green'}">${t.status==='open'?'مفتوح':'مغلق'}</span>
    </div>
    <p class="fs-13 text-gray mt-8">${t.body}</p>
    ${t.replies.map(r=>`<div class="ticket-reply ${r.userId==='dev-1'?'admin-reply':''}"><div class="fs-12 fw-700 mb-4">${r.userId==='dev-1'?'المطور':getUser(r.userId)?.displayName||'-'}</div><div class="fs-13">${r.body}</div></div>`).join('')}
  </div>`;
}

function newTicketForm() {
  return `
  <div class="form-group"><label>الموضوع <span class="req">*</span></label><input type="text" id="tck-sub" class="form-control" placeholder="موضوع التذكرة" /></div>
  <div class="form-group"><label>الرسالة <span class="req">*</span></label><textarea id="tck-body" class="form-control" rows="4" placeholder="اشرح مشكلتك..."></textarea></div>
  <button class="btn btn-primary" onclick="submitTicket()"><i class="fa fa-paper-plane"></i> إرسال التذكرة</button>`;
}

function submitTicket() {
  const sub = document.getElementById('tck-sub')?.value.trim();
  const body = document.getElementById('tck-body')?.value.trim();
  if (!sub||!body) { toast('يرجى ملء جميع الحقول','warning'); return; }
  const u = state.currentUser;
  const t = { id:'tck-'+Date.now(), userId:u.id, subject:sub, body, status:'open', replies:[], createdAt:Date.now() };
  state.tickets.push(t);
  saveState();
  toast('تم إرسال تذكرتك بنجاح','success');
  navigate('tickets');
}

// ============================================================
// USED PRODUCTS
// ============================================================
function renderUsed() {
  const used = state.products.filter(p=>p.condition==='used'&&!p.hidden);
  return `
  <div class="used-hero">
    <div class="container">
      <h1><i class="fa fa-recycle"></i> قسم <span>المستعمل</span></h1>
      <p>قطع إلكترونية مستعملة من أهل العراق بأسعار مناسبة</p>
    </div>
  </div>
  <div class="container section">
    <div class="d-flex justify-between align-center mb-20">
      <span class="fs-13 text-gray">${used.length} منتج مستعمل</span>
      ${state.currentUser?.type==='buyer'?`<button class="btn btn-primary btn-sm" onclick="state.buyTab='add-used';navigate('dashboard')"><i class="fa fa-plus"></i> بيع قطعتك</button>`:''}
    </div>
    ${used.length ? `<div class="product-grid">${used.map(productCard).join('')}</div>` : emptyState('fa-recycle','لا توجد قطع مستعملة حالياً','كن أول من يبيع قطعته!','state.buyTab=\'add-used\';navigate(\'dashboard\')','بيع قطعتك')}
  </div>`;
}

// ============================================================
// SEARCH PAGE
// ============================================================
function renderSearchPage() {
  const q = state.searchQuery.toLowerCase();
  const results = state.products.filter(p => !p.hidden && (p.name.toLowerCase().includes(q)||p.desc?.toLowerCase().includes(q)||catLabel(p.category).toLowerCase().includes(q)));
  return `
  <div class="container section">
    <h2 style="font-size:20px;font-weight:800;margin-bottom:8px;"><i class="fa fa-search text-blue"></i> نتائج البحث: "${state.searchQuery}"</h2>
    <p class="text-gray fs-13 mb-20">${results.length} نتيجة</p>
    ${results.length ? `<div class="product-grid">${results.map(productCard).join('')}</div>` : emptyState('fa-search','لا توجد نتائج',`لم يُعثر على شيء لـ "${state.searchQuery}"`,'navigate(\'home\')','الرئيسية')}
  </div>`;
}

// ============================================================
// STORE SETTINGS
// ============================================================
function storeSettingsForm(store) {
  if (!store) return '<p class="text-gray">لا يوجد متجر.</p>';
  return `
  <div class="panel">
    <div class="panel-header"><h3><i class="fa fa-cog"></i> إعدادات المتجر</h3></div>
    <div class="panel-body">
      <div class="form-group"><label>اسم المتجر</label><input type="text" id="ss-name" class="form-control" value="${store.name}" /></div>
      <div class="form-group"><label>وصف المتجر</label><textarea id="ss-desc" class="form-control" rows="3">${store.desc||''}</textarea></div>
      <div class="form-group">
        <label>شعار المتجر</label>
        <div class="img-upload-area">
          <input type="file" id="ss-logo" accept="image/*" onchange="previewSingleImage('ss-logo','ss-preview')" />
          <i class="fa fa-camera"></i>
          <p>ارفع شعار متجرك</p>
        </div>
        <div id="ss-preview"></div>
      </div>
      <button class="btn btn-primary mt-16" onclick="saveStoreSettings('${store.id}')"><i class="fa fa-save"></i> حفظ الإعدادات</button>
    </div>
  </div>`;
}

function saveStoreSettings(storeId) {
  const st = state.stores.find(s=>s.id===storeId);
  if (!st) return;
  st.name = document.getElementById('ss-name').value.trim()||st.name;
  st.desc = document.getElementById('ss-desc').value.trim();
  const previewImg = document.querySelector('#ss-preview img');
  if (previewImg) st.logo = previewImg.src;
  saveState();
  toast('تم حفظ إعدادات المتجر','success');
}

// ============================================================
// ADMIN ACTIONS
// ============================================================
function toggleBan(uid) {
  const u = state.users.find(x=>x.id===uid);
  if (!u||u.type==='developer') return;
  u.banned = !u.banned;
  saveState();
  toast(`تم ${u.banned?'حظر':'إلغاء حظر'} ${u.displayName}`,'info');
  render();
}

function confirmDelete(uid) {
  const u = state.users.find(x=>x.id===uid);
  if (!u||u.type==='developer') { toast('لا يمكن حذف حساب المطور','error'); return; }
  showConfirm(`هل تريد حذف حساب ${u.displayName}؟`, () => deleteUser(uid));
}

function deleteUser(uid) {
  const u = state.users.find(x=>x.id===uid);
  if (!u||u.type==='developer') return;
  state.users = state.users.filter(x=>x.id!==uid);
  if (u.storeId) state.stores = state.stores.filter(s=>s.id!==u.storeId);
  state.products = state.products.filter(p=>p.sellerId!==uid);
  saveState();
  toast('تم حذف الحساب','success');
  render();
}

function promptChangePass(uid) {
  const u = state.users.find(x=>x.id===uid);
  if (!u) return;
  openModal(`<div class="modal-inner"><div class="modal-header"><h3>تغيير كلمة مرور: ${u.displayName}</h3><button class="modal-close" onclick="closeModal()"><i class="fa fa-times"></i></button></div><div class="form-group"><label>كلمة المرور الجديدة</label><input type="password" id="new-pass" class="form-control" /></div><button class="btn btn-primary btn-full mt-12" onclick="changePass('${uid}')">تغيير</button></div>`);
}

function changePass(uid) {
  const p = document.getElementById('new-pass').value.trim();
  if (!p) { toast('يرجى إدخال كلمة المرور','warning'); return; }
  const u = state.users.find(x=>x.id===uid);
  if (u) { u.password=p; saveState(); toast('تم تغيير كلمة المرور','success'); closeModal(); }
}

function confirmDeleteStore(storeId) {
  showConfirm('هل تريد حذف هذا المتجر؟', () => {
    state.stores = state.stores.filter(s=>s.id!==storeId);
    state.products = state.products.filter(p=>p.storeId!==storeId);
    saveState(); toast('تم حذف المتجر','success'); render();
  });
}

function promptEditStore(storeId) {
  const st = state.stores.find(s=>s.id===storeId);
  if (!st) return;
  openModal(`<div class="modal-inner"><div class="modal-header"><h3>تعديل المتجر</h3><button class="modal-close" onclick="closeModal()"><i class="fa fa-times"></i></button></div><div class="form-group"><label>اسم المتجر</label><input type="text" id="est-name" class="form-control" value="${st.name}" /></div><div class="form-group"><label>الوصف</label><textarea id="est-desc" class="form-control" rows="3">${st.desc||''}</textarea></div><button class="btn btn-primary btn-full mt-12" onclick="saveEditStore('${storeId}')">حفظ</button></div>`);
}

function saveEditStore(storeId) {
  const st = state.stores.find(s=>s.id===storeId);
  if (!st) return;
  st.name = document.getElementById('est-name').value.trim()||st.name;
  st.desc = document.getElementById('est-desc').value.trim();
  saveState(); toast('تم تحديث المتجر','success'); closeModal(); render();
}

async function togglePin(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return;
  const pinned = !p.pinned;
  const saved = await updateProductInFirestore(pid, { pinned });
  if (!saved) return;
  p.pinned = pinned;
  saveState(); toast(`${p.pinned?'تم تثبيت':'تم إلغاء تثبيت'} المنتج`,'info'); render();
}
async function toggleHide(pid) {
  const p = state.products.find(x=>x.id===pid);
  if (!p) return;
  const hidden = !p.hidden;
  const saved = await updateProductInFirestore(pid, { hidden });
  if (!saved) return;
  p.hidden = hidden;
  saveState(); toast(`${p.hidden?'تم إخفاء':'تم إظهار'} المنتج`,'info'); render();
}
function adminDeleteProduct(pid) {
  showConfirm('هل تريد حذف هذا المنتج؟', async ()=>{
    const saved = await deleteProductFromFirestore(pid);
    if (!saved) return;
    toast('تم حذف المنتج','success'); render();
  });
}
function sellerDeleteProduct(pid) {
  showConfirm('هل تريد حذف هذا المنتج؟', async ()=>{
    const saved = await deleteProductFromFirestore(pid);
    if (!saved) return;
    toast('تم حذف المنتج','success'); setTab('sel','products');
  });
}
function updateOrderStatus(ordId, status) {
  const o = state.orders.find(x=>x.id===ordId);
  if (o) { o.status=status; saveState(); toast('تم تحديث حالة الطلب','info'); }
}
function deleteTicket(tid) {
  state.tickets = state.tickets.filter(t=>t.id!==tid);
  saveState(); toast('تم حذف التذكرة','info'); render();
}
function replyTicket(tid) {
  const inp = document.getElementById('tr-'+tid);
  if (!inp||!inp.value.trim()) { toast('يرجى كتابة رد','warning'); return; }
  const t = state.tickets.find(x=>x.id===tid);
  if (t) { t.replies.push({ userId:'dev-1', body:inp.value.trim(), createdAt:Date.now() }); saveState(); toast('تم إرسال الرد','success'); render(); }
}
function toggleTicketStatus(tid) {
  const t = state.tickets.find(x=>x.id===tid);
  if (t) { t.status = t.status==='open'?'closed':'open'; saveState(); render(); }
}
function saveSettings() {
  state.settings.siteName = document.getElementById('set-name').value.trim()||state.settings.siteName;
  const cats = document.getElementById('set-cats').value.split(',').map(c=>c.trim()).filter(Boolean);
  if (cats.length) state.settings.categories = cats;
  saveState(); toast('تم حفظ الإعدادات','success');
}
function confirmReset() {
  showConfirm('هل تريد إعادة تعيين النظام؟ ستُحذف جميع البيانات!', ()=>{
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
function showConfirm(msg, onConfirm) {
  openModal(`<div class="modal-inner"><div class="modal-header"><h3><i class="fa fa-exclamation-triangle text-yellow"></i> تأكيد</h3><button class="modal-close" onclick="closeModal()"><i class="fa fa-times"></i></button></div><p style="color:var(--gray);font-size:14px;margin-bottom:20px;">${msg}</p><div class="d-flex gap-12"><button class="btn btn-danger" onclick="(${onConfirm.toString()})();closeModal()">تأكيد</button><button class="btn btn-secondary" onclick="closeModal()">إلغاء</button></div></div>`);
}

// ============================================================
// IMAGE HELPERS
// ============================================================
function previewImages(inputId, previewsId) {
  const input = document.getElementById(inputId);
  const previews = document.getElementById(previewsId);
  if (!input||!previews) return;
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'img-preview-item';
      div.innerHTML = `<img src="${e.target.result}" /><button class="remove-img" onclick="this.parentElement.remove()"><i class="fa fa-times"></i></button>`;
      previews.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function previewSingleImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input||!preview||!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => { preview.innerHTML = `<img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-top:10px;" />`; };
  reader.readAsDataURL(input.files[0]);
}

function switchThumb(idx, src, el) {
  const mainImg = document.getElementById('main-img');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

// ============================================================
// HELPERS / UTILS
// ============================================================
function getUser(id) { return state.users.find(u=>u.id===id); }
function fmtPrice(n) { return Number(n).toLocaleString('ar-IQ'); }
function fmtDate(ts) { return new Date(ts).toLocaleDateString('ar-IQ'); }
function rankScore(p) { return (p.views * 0.3) + (p.orders * 0.5) + ((p.rating||0) * 0.2 * 100); }
function statusLabel(s) { return {pending:'معلق',processing:'جاري',completed:'مكتمل',cancelled:'ملغي'}[s]||s; }
function catLabel(c) { return {gpu:'كروت الشاشة',cpu:'المعالجات',laptop:'اللابتوبات',monitor:'الشاشات',gaming:'أجهزة الألعاب',accessories:'إكسسوارات'}[c]||c; }
function catIcon(c) { return {gpu:'fa-tv',cpu:'fa-microchip',laptop:'fa-laptop',monitor:'fa-desktop',gaming:'fa-gamepad',accessories:'fa-keyboard'}[c]||'fa-box'; }
function starRating(r) { const n = Math.round(r||0); return '★'.repeat(n)+'☆'.repeat(5-n); }
function emptyState(icon, title, subtitle, action, actionLabel) {
  return `<div class="empty-state"><i class="fa ${icon}"></i><h3>${title}</h3><p>${subtitle}</p>${action&&actionLabel?`<button class="btn btn-primary" onclick="${action}">${actionLabel}</button>`:''}</div>`;
}
function statCard(icon, label, value, cls) {
  return `<div class="stat-card ${cls}"><div class="stat-card-icon"><i class="fa ${icon}"></i></div><div class="stat-card-val">${value}</div><div class="stat-card-label">${label}</div></div>`;
}

function renderInfoPage(title, key, active) {
  // Simple static pages to support footer links.
  // key: info|privacy|terms|support
  const content = {
    info: {
      icon: 'fa-info-circle',
      body: `
        <p style="color:var(--gray);line-height:1.9;">
          مرحباً بك في سـوك. للتواصل معنا بخصوص أي استفسار أو مشكلة، افتح تذكرة دعم أو تواصل عبر قنواتنا.
        </p>
        <div class="panel mt-16">
          <div class="panel-header"><h3><i class="fa fa-ticket-alt"></i> تواصل عبر التذاكر</h3></div>
          <div class="panel-body">
            <p class="text-gray">اضغط <b>تذاكر الدعم</b> لإرسال طلبك، وسيتم الرد في أقرب وقت.</p>
            <button class="btn btn-primary" onclick="navigate('tickets')"><i class="fa fa-ticket-alt"></i> تذاكر الدعم</button>
          </div>
        </div>
      `
    },
    privacy: {
      icon: 'fa-shield-alt',
      body: `
        <p style="color:var(--gray);line-height:1.9;">
          سياسة الخصوصية توضح كيف نجمع ونعالج بيانات المستخدمين عند استخدام سـوك.
        </p>
        <ul style="color:var(--gray);line-height:1.9;">
          <li>نستخدم بياناتك لتحسين الخدمة وتقديم الدعم.</li>
          <li>لا نبيع بياناتك لطرف ثالث.</li>
          <li>قد نستخدم معلومات عامة لتتبع أداء الموقع.</li>
        </ul>
      `
    },
    terms: {
      icon: 'fa-file-contract',
      body: `
        <p style="color:var(--gray);line-height:1.9;">
          الشروط والأحكام تحدد قواعد استخدام المنصة وإجراءات التعامل بين المستخدمين.
        </p>
        <ul style="color:var(--gray);line-height:1.9;">
          <li>الالتزام بالقوانين وعدم إساءة الاستخدام.</li>
          <li>كل بائع مسؤول عن معلومات منتجاته.</li>
          <li>قد يتم تعليق/حذف الحسابات المخالفة.</li>
        </ul>
      `
    },
    support: {
      icon: 'fa-headset',
      body: `
        <p style="color:var(--gray);line-height:1.9;">
          فريق الدعم موجود للمساعدة في حال واجهت مشكلة أو كان لديك استفسار.
        </p>
        <div class="d-flex gap-12" style="flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="navigate('tickets')"><i class="fa fa-ticket-alt"></i> افتح تذكرة دعم</button>
          <button class="btn btn-secondary" onclick="navigate('home')"><i class="fa fa-store"></i> تصفح المنتجات</button>
        </div>
      `
    }
  };

  const page = content[key] || content.info;
  return `
    <div class="container" style="padding-top:28px;">
      <div class="breadcrumb"><a href="#" onclick="navigate('home')">الرئيسية</a><i class="fa fa-chevron-left"></i><span>${title}</span></div>
      <div class="panel mt-16">
        <div class="panel-header"><h3><i class="fa ${page.icon}"></i> ${title}</h3></div>
        <div class="panel-body">${page.body}</div>
      </div>
    </div>
  `;
}

// Registered once at startup; avoids accumulating listeners on every render.
let _docClickHandlerRegistered = false;
let _searchHandlerRegistered = false;
let _modalOverlayHandlerRegistered = false;

function normalizeCurrentUserSession() {
  if (!state.currentUser) return;

  const freshUser = state.users.find(u => u.id === state.currentUser.id);
  if (!freshUser || freshUser.banned) {
    state.currentUser = null;
    saveState();
    return;
  }

  state.currentUser = freshUser;
}


function attachEvents() {
  // Close notif panel when clicking outside – registered only once globally
  if (!_docClickHandlerRegistered) {
    _docClickHandlerRegistered = true;
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('notif-panel');
      const btn = document.getElementById('notif-btn');
      if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
        panel.classList.add('hidden');
      }
    });
  }

  // Search on Enter
  const si = document.getElementById('search-input');
  if (si && !_searchHandlerRegistered) {
    _searchHandlerRegistered = true;
    si.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(); });
  }

  // Modal overlay click
  const mo = document.getElementById('modal-overlay');
  if (mo && !_modalOverlayHandlerRegistered) {
    _modalOverlayHandlerRegistered = true;
    mo.addEventListener('click', e => { if (e.target===mo) closeModal(); });
  }
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  seedData();

  normalizeCurrentUserSession();

  // Ensure cart exists even if older saved state is missing it.
  if (!Array.isArray(state.cart)) state.cart = [];
  startProductsRealtimeSync();

  renderUserNav();
  render();
  updateCartBadge();
  updateNotifBadge();
});
