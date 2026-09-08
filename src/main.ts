import './style.css';

// ─── Product Data ───
interface Variant { size: string; price: number }
interface Product {
  id: string; name: string; tagline: string; badge: string;
  image: string; description: string; benefits: string[]; variants: Variant[];
}

const products: Product[] = [
  {
    id: 'ghee', name: 'Desi Ghee', tagline: 'Pure & Authentic',
    badge: 'Best Seller', image: '/product-ghee.png',
    description: 'Our premium Desi Ghee is made from the finest quality milk using traditional bilona method. Rich in flavor and aroma, it brings the authentic taste of homemade ghee to your kitchen.',
    benefits: ['Rich in Vitamins A, D, E & K', 'Boosts Immunity & Digestion', 'Traditional Bilona Method', '100% Pure — No Additives'],
    variants: [{ size: '400ml', price: 850 }, { size: '800ml', price: 1600 }]
  },
  {
    id: 'honey', name: 'Pure Honey', tagline: 'Raw & Unfiltered',
    badge: 'Premium', image: '/product-honey.png',
    description: 'Sourced from the pristine valleys, our honey is raw, unfiltered, and packed with natural enzymes. Every spoonful delivers pure sweetness and health benefits.',
    benefits: ['Raw & Unprocessed', 'Rich in Antioxidants', 'Natural Energy Booster', 'Supports Immune System'],
    variants: [{ size: '250ml', price: 550 }, { size: '500ml', price: 1000 }, { size: '1000ml', price: 1850 }]
  },
  {
    id: 'mustard-oil', name: 'Mustard Oil', tagline: 'Cold-Pressed & Pure',
    badge: 'Traditional', image: '/product-mustard-oil.png',
    description: 'Cold-pressed using traditional wooden ghani, our mustard oil retains all natural nutrients and the authentic pungent flavor that elevates every dish.',
    benefits: ['Cold-Pressed (Kachi Ghani)', 'Rich in Omega-3 Fatty Acids', 'Heart-Healthy Cooking Oil', 'Natural Preservative Properties'],
    variants: [{ size: '500ml', price: 450 }, { size: '1000ml', price: 850 }, { size: '2000ml', price: 1600 }]
  },
  {
    id: 'hair-oil', name: 'Herbal Hair Oil', tagline: 'Nourish & Strengthen',
    badge: 'New', image: '/product-hair-oil.png',
    description: 'A powerful blend of traditional herbs including Amla, Bhringraj, Brahmi, and Rosemary. This herbal elixir nourishes roots, reduces hair fall, and promotes thick, shiny hair.',
    benefits: ['Reduces Hair Fall', 'Promotes Hair Growth', 'Natural Herb Infusion', 'Chemical-Free Formula'],
    variants: [{ size: '100ml', price: 350 }, { size: '200ml', price: 600 }]
  }
];

// ─── Cart State ───
interface CartItem { productId: string; variantIdx: number; qty: number }
let cart: CartItem[] = JSON.parse(localStorage.getItem('gg_cart') || '[]');

function saveCart() {
  localStorage.setItem('gg_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount')!;
  const itemsEl = document.getElementById('cartItems')!;
  const footerEl = document.getElementById('cartFooter')!;
  const totalEl = document.getElementById('cartTotal')!;
  const checkoutBtn = document.getElementById('checkoutWhatsApp') as HTMLAnchorElement;
  const total = cart.reduce((s, i) => {
    const p = products.find(x => x.id === i.productId)!;
    return s + p.variants[i.variantIdx].price * i.qty;
  }, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = String(count);
  countEl.style.display = count > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Your cart is empty</p></div>`;
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map((item, idx) => {
      const p = products.find(x => x.id === item.productId)!;
      const v = p.variants[item.variantIdx];
      return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"/><div class="cart-item-info"><h4>${p.name}</h4><span>${v.size}</span><div class="cart-item-qty"><button onclick="window._cartQty(${idx},-1)">−</button><span>${item.qty}</span><button onclick="window._cartQty(${idx},1)">+</button></div></div><div class="cart-item-right"><span class="cart-item-price">Rs. ${v.price * item.qty}</span><button class="cart-item-remove" onclick="window._cartRemove(${idx})">×</button></div></div>`;
    }).join('');
    footerEl.style.display = 'block';
    totalEl.textContent = `Rs. ${total.toLocaleString()}`;
    const msg = cart.map(i => {
      const p = products.find(x => x.id === i.productId)!;
      return `${p.name} (${p.variants[i.variantIdx].size}) x${i.qty} = Rs.${p.variants[i.variantIdx].price * i.qty}`;
    }).join('%0A');
    checkoutBtn.href = `https://wa.me/923001234567?text=Hi%20Grain%20Glow!%20I'd%20like%20to%20order:%0A${msg}%0A%0ATotal:%20Rs.${total}`;
  }
}

(window as any)._cartQty = (idx: number, d: number) => {
  cart[idx].qty = Math.max(1, cart[idx].qty + d);
  saveCart();
};
(window as any)._cartRemove = (idx: number) => {
  cart.splice(idx, 1);
  saveCart();
};

// ─── Render Products ───
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card reveal" data-id="${p.id}">
      <div class="product-badge">${p.badge}</div>
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"/></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.tagline}</p>
        <div class="product-price">From <strong>Rs. ${p.variants[0].price}</strong></div>
        <button class="btn btn-primary btn-sm product-view-btn">View Details</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = (card as HTMLElement).dataset.id!;
      openModal(id);
    });
  });
}

// ─── Product Modal ───
let modalProduct: Product | null = null;
let modalVariant = 0;
let modalQty = 1;

function openModal(id: string) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  modalProduct = p;
  modalVariant = 0;
  modalQty = 1;

  const modal = document.getElementById('productModal')!;
  (document.getElementById('modalImg') as HTMLImageElement).src = p.image;
  document.getElementById('modalBadge')!.textContent = p.badge;
  document.getElementById('modalTitle')!.textContent = p.name;
  document.getElementById('modalDesc')!.textContent = p.description;
  document.getElementById('modalBenefits')!.innerHTML = p.benefits.map(b => `<div class="benefit-item"><span class="benefit-check">✓</span>${b}</div>`).join('');
  document.getElementById('variantBtns')!.innerHTML = p.variants.map((v, i) => `<button class="variant-btn${i === 0 ? ' active' : ''}" data-idx="${i}">${v.size}<br/><small>Rs. ${v.price}</small></button>`).join('');
  document.getElementById('qtyValue')!.textContent = '1';
  updateModalPrice();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.getElementById('variantBtns')!.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalVariant = parseInt((btn as HTMLElement).dataset.idx!);
      document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateModalPrice();
    });
  });
}

function updateModalPrice() {
  if (!modalProduct) return;
  const price = modalProduct.variants[modalVariant].price * modalQty;
  document.getElementById('modalPrice')!.textContent = `Rs. ${price.toLocaleString()}`;
}

function showToast(msg: string) {
  const t = document.getElementById('toast')!;
  document.getElementById('toastMsg')!.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── Event Listeners ───
function initEvents() {
  // Cart sidebar
  document.getElementById('cartBtn')?.addEventListener('click', () => {
    document.getElementById('cartSidebar')!.classList.add('open');
    document.getElementById('cartOverlay')!.classList.add('open');
  });
  const closeCart = () => {
    document.getElementById('cartSidebar')!.classList.remove('open');
    document.getElementById('cartOverlay')!.classList.remove('open');
  };
  document.getElementById('closeCart')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Modal
  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('productModal')!.classList.remove('active');
    document.body.style.overflow = '';
  });
  document.getElementById('productModal')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'productModal') {
      document.getElementById('productModal')!.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    modalQty = Math.max(1, modalQty - 1);
    document.getElementById('qtyValue')!.textContent = String(modalQty);
    updateModalPrice();
  });
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    modalQty++;
    document.getElementById('qtyValue')!.textContent = String(modalQty);
    updateModalPrice();
  });
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    if (!modalProduct) return;
    const existing = cart.find(i => i.productId === modalProduct!.id && i.variantIdx === modalVariant);
    if (existing) existing.qty += modalQty;
    else cart.push({ productId: modalProduct.id, variantIdx: modalVariant, qty: modalQty });
    saveCart();
    showToast(`${modalProduct.name} added to cart!`);
    document.getElementById('productModal')!.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle')!;
  const navLinks = document.getElementById('navLinks')!;
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Navbar scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar')!;
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = (s as HTMLElement).offsetTop - 100;
      if (window.scrollY >= top) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  });

  // Back to top
  const btt = document.getElementById('backToTop')!;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully!');
    (e.target as HTMLFormElement).reset();
  });

  // Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// ─── Animations ───
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.target || '0');
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = String(current);
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

// ─── Testimonials Slider ───
function initSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  const total = cards.length;

  dotsContainer.innerHTML = Array.from({ length: total }, (_, i) =>
    `<button class="dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`
  ).join('');

  function goTo(idx: number) {
    current = idx;
    track!.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer!.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.getElementById('prevTestimonial')?.addEventListener('click', () => goTo((current - 1 + total) % total));
  document.getElementById('nextTestimonial')?.addEventListener('click', () => goTo((current + 1) % total));
  dotsContainer.querySelectorAll('.dot').forEach(d => {
    d.addEventListener('click', () => goTo(parseInt((d as HTMLElement).dataset.idx!)));
  });

  setInterval(() => goTo((current + 1) % total), 5000);
}

// ─── Preloader ───
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 800);
  });
}

// ─── Hero Particles ───
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;animation-delay:${Math.random()*5}s;animation-duration:${3+Math.random()*4}s;`;
    container.appendChild(p);
  }
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  renderProducts();
  updateCartUI();
  initEvents();
  initReveal();
  initCounters();
  initSlider();
  initParticles();
});
