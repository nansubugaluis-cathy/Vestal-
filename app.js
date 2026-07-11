/* ============================================
   VESTRA Storefront — Application Logic
   ============================================ */

(function() {
  'use strict';

  // --- State ---
  let cart = JSON.parse(localStorage.getItem('vestra_cart') || '[]');
  let activeCategory = 'All';

  // --- Helpers ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function formatUGX(amount) {
    return 'UGX ' + amount.toLocaleString('en-UG');
  }

  function getStockStatus(stock, threshold) {
    if (stock <= 0) return { class: '', text: 'Out of Stock', type: 'out' };
    if (stock <= threshold) return { class: 'low-stock', text: `Only ${stock} left — Low Stock`, type: 'low' };
    return { class: 'in-stock', text: 'In Stock', type: 'in' };
  }

  function starsHTML(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  // --- Toast ---
  function showToast(message, type = 'success') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Cart ---
  function saveCart() {
    localStorage.setItem('vestra_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const badge = $('#cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems > 0) {
      badge.style.display = 'flex';
      badge.textContent = totalItems;
    } else {
      badge.style.display = 'none';
    }
    renderCartItems();
  }

  function addToCart(productId, qty = 1) {
    const existing = cart.find(item => item.productId === productId);
    const product = VESTRA_DATA.products.find(p => p.id === productId);
    if (!product) return;

    const currentQty = existing ? existing.qty : 0;
    if (currentQty + qty > product.stock) {
      showToast(`Sorry, only ${product.stock} units available.`, 'error');
      return;
    }

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, qty, name: product.name, price: product.price, image: product.image });
    }
    saveCart();
    showToast(`${product.name} added to cart!`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
  }

  function updateCartQty(productId, qty) {
    if (qty <= 0) { removeFromCart(productId); return; }
    const item = cart.find(i => i.productId === productId);
    if (item) { item.qty = qty; saveCart(); }
  }

  function clearCart() {
    cart = [];
    saveCart();
    showToast('Cart cleared');
  }

  function checkoutWhatsApp() {
    if (cart.length === 0) return;
    const phone = VESTRA_DATA.brand.whatsapp.replace(/[^0-9]/g, '');
    let message = 'Hello VESTRA! I would like to order:%0A%0A';
    let total = 0;
    cart.forEach((item, i) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      message += `${i + 1}. ${item.name} x${item.qty} — ${formatUGX(subtotal)}%0A`;
    });
    message += `%0A*Total: ${formatUGX(total)}*%0A%0APlease confirm availability and delivery details.`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  function renderCartItems() {
    const container = $('#cartItems');
    const footer = $('#cartFooter');
    const totalEl = $('#cartTotal');

    if (cart.length === 0) {
      container.innerHTML = '<div class="cart-empty"><p>🛒</p><p>Your cart is empty</p></div>';
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';
    let total = 0;
    container.innerHTML = cart.map(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
          <div class="cart-item-info">
            <div class="ci-name">${item.name}</div>
            <div class="ci-price">${formatUGX(subtotal)}</div>
          </div>
          <div class="cart-item-qty">
            <button onclick="window._vestraUpdateQty(${item.productId}, ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="window._vestraUpdateQty(${item.productId}, ${item.qty + 1})">+</button>
          </div>
          <button class="cart-item-remove" onclick="window._vestraRemove(${item.productId})">🗑</button>
        </div>`;
    }).join('');
    totalEl.textContent = formatUGX(total);
  }

  // Expose cart functions globally for inline handlers
  window._vestraUpdateQty = updateCartQty;
  window._vestraRemove = removeFromCart;
  window._vestraAddToCart = addToCart;
  window._vestraOpenModal = openProductModal;

  // --- Render Products ---
  function renderProducts(category = 'All') {
    activeCategory = category;
    const grid = $('#productsGrid');
    let products = VESTRA_DATA.products;

    if (category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    grid.innerHTML = products.map(p => {
      const stock = getStockStatus(p.stock, p.lowStockThreshold);
      return `
        <div class="product-card${p.featured ? ' featured' : ''}" onclick="window._vestraOpenModal(${p.id})">
          <div class="pc-image-wrap">
            ${p.featured ? '<div class="pc-badge">Best Seller</div>' : ''}
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f1f5f9%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2216%22 fill=%22%2394a3b8%22>No Image</text></svg>'">
          </div>
          <div class="pc-body">
            <div class="pc-category">${p.category}</div>
            <div class="pc-name">${p.name}</div>
            <div class="pc-desc">${p.description}</div>
            <div class="pc-footer">
              <div class="pc-price">${formatUGX(p.price)} <small>${p.size}</small></div>
              <div class="pc-rating"><span class="stars">${starsHTML(p.rating)}</span> ${p.rating}</div>
            </div>
            <div class="pc-stock ${stock.class}">${stock.type === 'in' ? '🟢' : stock.type === 'low' ? '🟡' : '🔴'} ${stock.text}</div>
            <div class="pc-actions" onclick="event.stopPropagation()">
              ${stock.type !== 'out' ? `<button class="btn btn-primary" onclick="window._vestraAddToCart(${p.id})">Add to Cart</button>` : `<button class="btn btn-primary" disabled style="opacity:0.5">Out of Stock</button>`}
              <button class="btn btn-outline" onclick="window._vestraOpenModal(${p.id})">Details</button>
            </div>
          </div>
        </div>`;
    }).join('');

    // Update category filter buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });
  }

  function renderCategoryFilter() {
    const filter = $('#categoryFilter');
    filter.innerHTML = VESTRA_DATA.categories.map(cat =>
      `<button class="cat-btn${cat === 'All' ? ' active' : ''}" data-cat="${cat}" onclick="window._vestraFilter('${cat}')">${cat}</button>`
    ).join('');
  }
  window._vestraFilter = renderProducts;

  // --- Product Modal ---
  function openProductModal(productId) {
    const product = VESTRA_DATA.products.find(p => p.id === productId);
    if (!product) return;

    const stock = getStockStatus(product.stock, product.lowStockThreshold);
    const productReviews = VESTRA_DATA.reviews.filter(r => r.productId === productId);

    $('#modalBody').innerHTML = `
      <div class="modal-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
      </div>
      <div class="modal-info">
        <div class="mi-category">${product.category}</div>
        <div class="mi-name">${product.name}</div>
        <div class="mi-rating">
          <span style="color:var(--yellow);font-size:16px">${starsHTML(product.rating)}</span>
          <span style="font-weight:600">${product.rating}</span>
          <span style="color:var(--gray-400)">(${product.reviewsCount} reviews)</span>
        </div>
        <div class="mi-price">${formatUGX(product.price)}</div>
        <p class="mi-desc">${product.description}</p>
        ${product.benefits.length ? `<div class="mi-benefits">${product.benefits.map(b => `<span class="mi-benefit">✓ ${b}</span>`).join('')}</div>` : ''}
        ${product.stainsTarget.length ? `<p style="font-size:13px;color:var(--gray-500);margin-bottom:16px"><strong>Targets:</strong> ${product.stainsTarget.join(', ')}</p>` : ''}
        <div class="mi-details">
          <div class="mi-detail"><div class="val">${product.size}</div><div class="lbl">Size</div></div>
          <div class="mi-detail"><div class="val">${product.sku}</div><div class="lbl">SKU</div></div>
          <div class="mi-detail"><div class="val" style="color:${stock.type === 'in' ? 'var(--green)' : 'var(--yellow)'}">${stock.type === 'out' ? 'Sold Out' : stock.type === 'low' ? `Only ${product.stock}` : product.stock}</div><div class="lbl">In Stock</div></div>
        </div>
        <div class="mi-actions">
          ${stock.type !== 'out' ? `<button class="btn btn-primary" onclick="window._vestraAddToCart(${product.id});document.getElementById('modalOverlay').classList.remove('open')">🛒 Add to Cart — ${formatUGX(product.price)}</button>` : '<button class="btn btn-primary" disabled style="opacity:0.5">Out of Stock</button>'}
          <button class="btn btn-outline" onclick="document.getElementById('modalOverlay').classList.remove('open')">Close</button>
        </div>
        ${productReviews.length ? `
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--gray-200)">
            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Customer Reviews</h4>
            ${productReviews.map(r => `
              <div style="margin-bottom:12px;padding:12px;background:var(--gray-50);border-radius:8px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <strong style="font-size:13px">${r.customerName}</strong>
                  <span style="color:var(--yellow);font-size:12px">${'★'.repeat(r.rating)}</span>
                </div>
                <p style="font-size:13px;color:var(--gray-600);font-style:italic">"${r.comment}"</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>`;

    $('#modalOverlay').classList.add('open');
  }

  // --- Render Reviews ---
  function renderReviews() {
    const grid = $('#reviewsGrid');
    grid.innerHTML = VESTRA_DATA.reviews.map(r => {
      const product = VESTRA_DATA.products.find(p => p.id === r.productId);
      return `
        <div class="review-card">
          <div class="rc-header">
            <div class="rc-avatar">${getInitials(r.customerName)}</div>
            <div>
              <div class="rc-name">${r.customerName}</div>
              <div class="rc-date">${r.date}</div>
            </div>
          </div>
          <div class="rc-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <div class="rc-product">${product ? product.name : 'VESTRA Product'}</div>
          <p class="rc-text">"${r.comment}"</p>
        </div>`;
    }).join('');
  }

  function renderStats() {
    const grid = $('#statsGrid');
    grid.innerHTML = `
      <div class="stat-item"><div class="stat-num">${VESTRA_DATA.stats.productsSold}+</div><div class="stat-label">Products Sold</div></div>
      <div class="stat-item"><div class="stat-num">${VESTRA_DATA.stats.happyCustomers}+</div><div class="stat-label">Happy Customers</div></div>
      <div class="stat-item"><div class="stat-num">${VESTRA_DATA.stats.reviews}+</div><div class="stat-label">5-Star Reviews</div></div>
      <div class="stat-item"><div class="stat-num">${VESTRA_DATA.stats.yearsExp}+</div><div class="stat-label">Years Experience</div></div>
    `;
  }

  // --- Cart Drawer Toggle ---
  function toggleCart(force) {
    const drawer = $('#cartDrawer');
    const overlay = $('#cartOverlay');
    const open = force !== undefined ? force : !drawer.classList.contains('open');
    if (open) { drawer.classList.add('open'); overlay.classList.add('open'); }
    else { drawer.classList.remove('open'); overlay.classList.remove('open'); }
  }

  // --- Mobile Nav ---
  function toggleMobileNav(force) {
    const nav = $('#mobileNav');
    const open = force !== undefined ? force : !nav.classList.contains('open');
    if (open) nav.classList.add('open');
    else nav.classList.remove('open');
  }

  // --- Contact Form ---
  function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Open WhatsApp as fallback for contact
    const phone = VESTRA_DATA.brand.whatsapp.replace(/[^0-9]/g, '');
    const waMsg = `Hello VESTRA!%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject)}%0A%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${phone}?text=${waMsg}`, '_blank');

    showToast('Message sent! Redirecting to WhatsApp...');
    form.reset();
  }

  // --- Event Listeners ---
  $('#cartBtn').addEventListener('click', () => toggleCart(true));
  $('#cartClose').addEventListener('click', () => toggleCart(false));
  $('#cartOverlay').addEventListener('click', () => toggleCart(false));
  $('#checkoutBtn').addEventListener('click', checkoutWhatsApp);
  $('#clearCartBtn').addEventListener('click', clearCart);
  $('#hamburger').addEventListener('click', () => toggleMobileNav(true));
  $('#mobileClose').addEventListener('click', () => toggleMobileNav(false));

  // Close mobile nav on link click
  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  // Close modal
  $('#modalClose').addEventListener('click', () => $('#modalOverlay').classList.remove('open'));
  $('#modalOverlay').addEventListener('click', (e) => {
    if (e.target === $('#modalOverlay')) $('#modalOverlay').classList.remove('open');
  });

  // Contact form
  $('#messageForm').addEventListener('submit', handleContactSubmit);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleCart(false);
      toggleMobileNav(false);
      $('#modalOverlay').classList.remove('open');
    }
  });

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Init ---
  function init() {
    renderCategoryFilter();
    renderProducts('All');
    renderReviews();
    renderStats();
    updateCartUI();
  }

  init();

  console.log('🧺 VESTRA Storefront ready!');
  console.log(`   ${VESTRA_DATA.products.length} products loaded`);
  console.log(`   ${VESTRA_DATA.reviews.length} reviews loaded`);
})();
