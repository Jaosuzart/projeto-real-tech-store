document.addEventListener("DOMContentLoaded", () => {
    const productData = [
        { name: "Fones de Ouvido da JBL", image: "images/fone de ouvido.jpg", description: ["Fones de ouvido de ótima qualidade e durabilidade.", "Melhor preço em relação aos competidores.", "Modelos premium de fones de ouvido."], price: 360.00, stock: 2, sales: 120 },
        { name: "Celular da Xiaomi", image: "images/celular.jpg", description: ["Celulares de alta qualidade e performance.", "Melhor preço em relação aos competidores.", "Modelos premium de celulares."], price: 2500.00, stock: 0, sales: 80 },
        { name: "Computador da Dell", image: "images/computador.png", description: ["Computador de alta qualidade e performance.", "Melhor preço em relação aos competidores.", "Modelos premium de PC."], price: 3500.00, stock: 0, sales: 45 }
    ];

    const formFields = [
        { type: 'text', id: 'name', label: 'Nome:', required: true },
        { type: 'email', id: 'email', label: 'Digite seu email válido:', required: true, placeholder: 'seu.email@exemplo.com' },
        { type: 'textarea', id: 'message', label: 'Mensagem:', required: true }
    ];

    let stock = Object.fromEntries(productData.map(p => [p.name, p.stock]));
    let cart = [];

    const renderBestSeller = (products) => {
        const wrapper = document.getElementById("mais-vendidos-wrapper");
        if (!wrapper) {
            return;
        }

        const topProduct = [...products].sort((a, b) => b.sales - a.sales)[0];
        wrapper.innerHTML = `
            <div class="best-seller-card">
                <img src="${topProduct.image}" alt="${topProduct.name}" class="best-seller-image">
                <h3 class="best-seller-title">${topProduct.name}</h3>
                <p class="best-seller-sales">${topProduct.sales} unidades vendidas</p>
                <button class="best-seller-button">Ver Produto</button>
            </div>
        `;
        wrapper.addEventListener("click", (e) => e.target.classList.contains("best-seller-button") && (window.location.href = "servico.html"));
    };

    const createProductCard = (product) => {
        const card = document.createElement('article');
        card.classList.add('servico-card');
        card.dataset.name = product.name;
        if (product.stock === 0) {
            card.classList.add('out-of-stock');
        }

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="service-image">
            <h3>${product.name}${product.name.includes('JBL') ? ' <span>ORIGINAL!</span>' : ''}</h3>
            <ul>${product.description.map(desc => `<li>${desc}</li>`).join('')}</ul>
            <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" ${product.stock === 0 ? 'disabled' : ''}>${product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}</button>
            <button class="remove-from-cart" data-name="${product.name}">Remover do Carrinho</button>
            ${product.stock === 0 ? '<div class="stock-overlay"><span>Sem Estoque</span></div>' : ''}
        `;
        return card;
    };

    const renderProducts = (products) => {
        const container = document.getElementById("products-container");
        if (!container) {return;
        }

        container.append(...products.map(createProductCard));
    };

    const updateCart = () => {
        const cartItems = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const cartTotalPrice = document.getElementById("cart-total-price");

        if (!cartItems) {return;
        }

        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `<div>${item.name} - R$ ${item.price.toFixed(2)} (x${item.qty})</div>`;
        }).join('');

        if (cartCount) {cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        }
        if (cartTotalPrice) {cartTotalPrice.textContent = total.toFixed(2);
        }
    };

    const handleCartAction = (e) => {
        if (!e.target.matches('.add-to-cart, .remove-from-cart')) {return;
        }

        const name = e.target.dataset.name;
        const isAdd = e.target.classList.contains('add-to-cart');
        const price = parseFloat(e.target.dataset.price);
        const item = cart.find(i => i.name === name);

        if (isAdd) {
            if (stock[name] <= 0) {return alert("Produto fora de estoque!");
            }
            if (item){ 
                item.qty++;
            }
            else {
                cart.push({ name, price, qty: 1 });
        }
            stock[name]--;
            if (stock[name] === 0) {
                e.target.disabled = true;
                e.target.textContent = "Esgotado";
            }
        } else if (item) {
            item.qty--;
            if (item.qty === 0) { cart = cart.filter(i => i.name !== name);
            }
        }

        updateCart();
    };

    const renderForm = (fields) => {
        const container = document.getElementById("form-container");
        if (!container) {return;
        }

        const form = document.createElement('form');
        form.action = "mailto:joaomarcelosuzartcastro@gmail.com";
        form.method = "post";
        form.enctype = "text/plain";
        form.id = "contact-form";

        fields.forEach(field => {
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            form.appendChild(label);

            const input = field.type === 'textarea' ? document.createElement('textarea') : Object.assign(document.createElement('input'), { type: field.type });
            Object.assign(input, { id: field.id, name: field.id, required: field.required });
            if (field.placeholder) {input.placeholder = field.placeholder;
            }
            form.appendChild(input);
        });

        const submit = document.createElement('button');
        submit.type = "submit";
        submit.textContent = "Enviar mensagem";
        form.appendChild(submit);

        container.appendChild(form);

        form.addEventListener("submit", (e) => {
            if (!form.checkValidity()) {
                alert("Por favor, preencha todos os campos corretamente.");
                e.preventDefault();
            } else {
                alert("Mensagem preparada para envio! Clique em OK para abrir seu cliente de email.");
            }
        });
    };

    renderBestSeller(productData);
    renderProducts(productData);
    renderForm(formFields);

    document.addEventListener('click', handleCartAction);

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const overlay = document.getElementById("overlay");

    menuToggle?.addEventListener("click", () => {
        navMenu.classList.add("active");
        overlay.classList.add("active");
    });

    closeMenuBtn?.addEventListener("click", () => {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay?.addEventListener("click", () => {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    const openSearchBtn = document.getElementById("open-search-btn");
    const searchModal = document.getElementById("search-modal");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const searchInput = document.getElementById("search-input-modal");

    openSearchBtn?.addEventListener("click", () => searchModal.style.display = "block");
    closeSearchBtn?.addEventListener("click", () => searchModal.style.display = "none");

    searchInput?.addEventListener("keyup", () => {
        const query = searchInput.value.toLowerCase().trim();
        document.querySelectorAll(".servico-card").forEach(card => {
            card.style.display = card.dataset.name.toLowerCase().includes(query) ? "block" : "none";
        });
        if (query && !document.querySelectorAll(".servico-card").length) {
            window.location.href = `servico.html?search=${encodeURIComponent(query)}`;
        }
    });

    const cartBtn = document.getElementById("show-cart-btn");
    const cartWindow = document.getElementById("cart-window");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    cartBtn?.addEventListener("click", () => cartWindow.classList.add("active"));
    closeCartBtn?.addEventListener("click", () => cartWindow.classList.remove("active"));

    checkoutBtn?.addEventListener("click", () => {
        if (!cart.length) {
            return alert("Carrinho vazio!");
        }

        document.getElementById('cart-items').style.display = 'none';
        document.querySelector('.cart-total').style.display = 'none';
        checkoutBtn.style.display = 'none';

        const paymentSection = document.getElementById('payment-section');
        paymentSection.style.display = 'flex';

        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        document.getElementById('payment-total').textContent = total.toFixed(2);

        const fakeApiResponse = `https://api.placeholder.com/payment/${Date.now()}?amount=${total.toFixed(2)}&merchant=Techstore&method=PIX`;
        new QRCode(document.getElementById("qrcode"), {
            text: fakeApiResponse,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    });

    const track = document.querySelector(".carousel-track");
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector(".carousel-button.next");
        const prevButton = document.querySelector(".carousel-button.prev");
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            currentIndex = (targetIndex + slides.length) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextButton?.addEventListener("click", () => moveToSlide(currentIndex + 1));
        prevButton?.addEventListener("click", () => moveToSlide(currentIndex - 1));
        setInterval(() => moveToSlide(currentIndex + 1), 5000);
    }

    document.querySelectorAll(".faq-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".faq-item.active").forEach(other => other !== item && other.classList.remove("active"));
            item.classList.toggle("active");
        });
    });

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    const checkAnimations = () => animatedElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {el.classList.add("fade-in");
        }
    });
    window.addEventListener("scroll", checkAnimations);
    checkAnimations();

    const cookieBtn = document.getElementById("cookie-preferences-btn");
    const cookieModal = document.getElementById("cookie-preferences-modal");
    const saveBtn = document.getElementById("save-cookie-preferences");
    const acceptAllBtn = document.getElementById("accept-all-cookies");

    cookieBtn?.addEventListener("click", () => {
        if (cookieModal) {
            cookieModal.style.display = "block";
        }
    });

    saveBtn?.addEventListener("click", () => {
        if (cookieModal) { 
            cookieModal.style.display = "none";
        }
    });

    acceptAllBtn?.addEventListener("click", () => {
        if (cookieModal) {
            cookieModal.style.display = "none";
        }
    });
});