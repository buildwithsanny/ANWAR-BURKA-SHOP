const rupee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

let products = [
  {
    id: "AB-101",
    name: "Noor Black Embroidered Abaya",
    price: 2499,
    description: "Premium black abaya with elegant embroidery, breathable fabric, and a graceful daily-wear fit.",
    image: "assets/abaya-black.png",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "AB-102",
    name: "Zaina Navy Silver Abaya",
    price: 2799,
    description: "Navy blue modest wear with silver sleeve detail. Ideal for events, gifting, and festive orders.",
    image: "assets/abaya-navy.png",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "AB-103",
    name: "Ameera Cream Gold Abaya",
    price: 3199,
    description: "Soft cream abaya with tasteful gold work and a premium boutique finish.",
    image: "assets/abaya-cream.png",
    sizes: ["S", "M", "L"]
  },
  {
    id: "AB-104",
    name: "Safiya Matte Black Burka",
    price: 2299,
    description: "Minimal matte black burka for everyday wear with a clean fall and comfortable fit.",
    image: "assets/abaya-black.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "AB-105",
    name: "Mariam Navy Pearl Abaya",
    price: 2999,
    description: "Elegant navy abaya with pearl-inspired detailing for family functions and evening outings.",
    image: "assets/abaya-navy.png",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "AB-106",
    name: "Huda Cream Classic Abaya",
    price: 2599,
    description: "Soft cream abaya with graceful styling, perfect for festive gifting and premium reels.",
    image: "assets/abaya-cream.png",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "AB-107",
    name: "Aaliya Black Nida Burka",
    price: 1999,
    description: "Lightweight black nida burka designed for daily comfort and modest elegance.",
    image: "assets/abaya-black.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "AB-108",
    name: "Inaya Blue Sleeve Work Abaya",
    price: 2699,
    description: "Modern blue abaya with sleeve work that looks premium in short product reels.",
    image: "assets/abaya-navy.png",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "AB-109",
    name: "Rida Gold Touch Abaya",
    price: 3499,
    description: "Cream-gold premium abaya for special occasions, festive launches, and high-value orders.",
    image: "assets/abaya-cream.png",
    sizes: ["S", "M", "L"]
  },
  {
    id: "AB-110",
    name: "Sumayya Premium Black Farasha",
    price: 3799,
    description: "Premium farasha-style black abaya with a flowing silhouette and boutique finish.",
    image: "assets/abaya-black.png",
    sizes: ["M", "L", "XL"]
  }
];

let orders = JSON.parse(localStorage.getItem("anwarOrders") || "[]");
let likedProducts = JSON.parse(localStorage.getItem("anwarLikedProducts") || "[]");
let selectedProduct = products[0];
let selectedSize = "M";

const views = {
  home: document.getElementById("homeView"),
  shop: document.getElementById("shopView"),
  collections: document.getElementById("collectionsView"),
  offers: document.getElementById("offersView"),
  story: document.getElementById("storyView"),
  admin: document.getElementById("adminView"),
  orders: document.getElementById("ordersView")
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    Object.values(views).forEach((view) => view.classList.remove("active"));
    views[tab.dataset.view].classList.add("active");
  });
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`[data-view="${button.dataset.jump}"]`)?.click();
  });
});

document.querySelectorAll("[data-carousel]").forEach((button) => {
  button.addEventListener("click", () => {
    const carousel = document.getElementById(button.dataset.carousel);
    carousel.scrollBy({
      left: Number(button.dataset.dir) * carousel.clientWidth * 0.75,
      behavior: "smooth"
    });
  });
});

function renderReels() {
  const feed = document.getElementById("reelFeed");
  feed.innerHTML = products.map((product) => `
    <article class="reel" style="background-image:url('${product.image}')">
      <div class="reel-info">
        <span class="eyebrow">${product.id}</span>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="price">${rupee.format(product.price)}</div>
      </div>
      <div class="reel-actions">
        <button type="button" title="Like reel" data-like="${product.id}">${likedProducts.includes(product.id) ? "♥" : "♡"}</button>
        <button type="button" title="Share reel" data-share="${product.id}">↗</button>
        <button class="shop-now" type="button" data-product="${product.id}">Order</button>
      </div>
    </article>
  `).join("");

  feed.querySelectorAll("[data-like]").forEach((button) => {
    button.addEventListener("click", () => toggleLike(button.dataset.like));
  });

  feed.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", () => shareProduct(button.dataset.share));
  });

  feed.querySelectorAll("[data-product]").forEach((button) => {
    button.addEventListener("click", () => openProduct(button.dataset.product));
  });
}

function renderCarousels() {
  const carouselMarkup = products.map((product) => `
    <article class="carousel-product" style="background-image:url('${product.image}')">
      <div>
        <span class="eyebrow">${product.id}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <button class="primary" type="button" data-product-card="${product.id}">${rupee.format(product.price)} · Order</button>
      </div>
    </article>
  `).join("");

  document.getElementById("homeCarousel").innerHTML = carouselMarkup;
  document.getElementById("collectionCarousel").innerHTML = carouselMarkup;

  document.querySelectorAll("[data-product-card]").forEach((button) => {
    button.addEventListener("click", () => openProduct(button.dataset.productCard));
  });
}

function toggleLike(id) {
  likedProducts = likedProducts.includes(id)
    ? likedProducts.filter((productId) => productId !== id)
    : [...likedProducts, id];
  localStorage.setItem("anwarLikedProducts", JSON.stringify(likedProducts));
  renderReels();
  renderLikes();
}

async function shareProduct(id) {
  const product = products.find((item) => item.id === id);
  const shareText = `Check this ${product.name} from Anwar Burka Shop - ${rupee.format(product.price)}`;
  const shareUrl = window.location.href;

  if (navigator.share) {
    await navigator.share({ title: product.name, text: shareText, url: shareUrl });
    return;
  }

  await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
  showToast("Product link copied");
}

function renderProducts() {
  document.getElementById("productList").innerHTML = products.map((product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <span class="badge">Live reel</span>
        <h4>${product.name}</h4>
        <p>${rupee.format(product.price)}</p>
        <p>${product.description}</p>
      </div>
    </div>
  `).join("");
}

function renderOrders() {
  const orderBox = document.getElementById("orders");
  const summary = document.getElementById("orderSummary");
  document.getElementById("metricOrders").textContent = orders.length;
  document.getElementById("bagCount").textContent = orders.length;

  if (!orders.length) {
    summary.textContent = "No orders yet";
    orderBox.innerHTML = `<div class="order-row"><span>Place an order from the reel view to see the owner dashboard update live.</span></div>`;
    return;
  }

  summary.textContent = `${orders.length} order${orders.length > 1 ? "s" : ""} ready for follow-up`;
  orderBox.innerHTML = orders.map((order, index) => `
    <div class="order-row">
      <div>
        <strong>${order.product}</strong>
        <p>${order.name} · ${order.phone}</p>
      </div>
      <div>Size ${order.size}<br>${order.note || "No note"}</div>
      <div><strong>${rupee.format(order.price)}</strong><br>${order.time}</div>
      <button class="ghost" type="button" data-status="${index}">${order.status}</button>
    </div>
  `).join("");

  orderBox.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const i = Number(button.dataset.status);
      orders[i].status = orders[i].status === "New" ? "Confirmed" : orders[i].status === "Confirmed" ? "Packed" : "New";
      saveOrders();
    });
  });
}

function renderLikes() {
  document.getElementById("metricLikes").textContent = likedProducts.length;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

function openProduct(id) {
  selectedProduct = products.find((product) => product.id === id) || products[0];
  selectedSize = selectedProduct.sizes[0];
  document.getElementById("modalImage").src = selectedProduct.image;
  document.getElementById("modalImage").alt = selectedProduct.name;
  document.getElementById("modalCode").textContent = selectedProduct.id;
  document.getElementById("modalName").textContent = selectedProduct.name;
  document.getElementById("modalDesc").textContent = selectedProduct.description;
  document.getElementById("modalPrice").textContent = rupee.format(selectedProduct.price);
  renderSizes();
  document.getElementById("productModal").showModal();
}

function renderSizes() {
  const sizePicker = document.getElementById("sizePicker");
  sizePicker.innerHTML = selectedProduct.sizes.map((size) => `
    <button class="size ${size === selectedSize ? "active" : ""}" type="button" data-size="${size}">${size}</button>
  `).join("");
  sizePicker.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      renderSizes();
    });
  });
}

function buildOrder() {
  const name = document.getElementById("customerName").value.trim() || "Walk-in Lead";
  const phone = document.getElementById("customerPhone").value.trim() || "+91 90000 00000";
  const note = document.getElementById("customerNote").value.trim();
  return {
    product: selectedProduct.name,
    price: selectedProduct.price,
    size: selectedSize,
    name,
    phone,
    note,
    status: "New",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
}

function saveOrders() {
  localStorage.setItem("anwarOrders", JSON.stringify(orders));
  renderOrders();
}

document.getElementById("placeOrder").addEventListener("click", () => {
  orders.unshift(buildOrder());
  saveOrders();
  document.getElementById("productModal").close();
  document.querySelector('[data-view="orders"]').click();
});

document.getElementById("orderWhatsApp").addEventListener("click", () => {
  const order = buildOrder();
  const text = `New order: ${order.product}%0ASize: ${order.size}%0APrice: ${rupee.format(order.price)}%0AName: ${order.name}%0APhone: ${order.phone}%0ANote: ${order.note || "-"}`;
  window.open(`https://wa.me/?text=${text}`, "_blank");
});

document.getElementById("ownerWhatsApp").addEventListener("click", () => {
  window.open("https://wa.me/?text=Hi%20Anwar%20Burka%20Shop%2C%20I%20want%20to%20know%20about%20your%20new%20abaya%20collection.", "_blank");
});

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  products.unshift({
    id: `AB-${100 + products.length + 1}`,
    name: data.get("name"),
    price: Number(data.get("price")),
    description: data.get("description"),
    image: data.get("image"),
    sizes: ["S", "M", "L", "XL", "XXL"]
  });
  renderReels();
  renderCarousels();
  renderProducts();
  document.querySelector('[data-view="shop"]').click();
});

document.getElementById("seedOrder").addEventListener("click", () => {
  orders.unshift({
    product: products[0].name,
    price: products[0].price,
    size: "L",
    name: "Ayesha Khan",
    phone: "+91 98765 43210",
    note: "Deliver near Mehdipatnam after 6 PM",
    status: "New",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });
  saveOrders();
});

document.getElementById("clearOrders").addEventListener("click", () => {
  orders = [];
  saveOrders();
});

document.getElementById("openCart").addEventListener("click", () => {
  document.querySelector('[data-view="orders"]').click();
});

renderReels();
renderCarousels();
renderProducts();
renderOrders();
renderLikes();
