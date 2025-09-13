document.addEventListener("DOMContentLoaded", () => {
    const stock = {
        "Fones de Ouvido da JBL": 2,
        "Celular da Xiaomi": 0,
        "Computador da Dell": 0
    };

    const vendas = {
        "Fones de Ouvido da JBL": 120,
        "Celular da Xiaomi": 80,
        "Computador da Dell": 45
    };

    const imagensProdutos = {
        "Fones de Ouvido da JBL": "images/fone de ouvido.jpg",
        "Celular da Xiaomi": "images/celular.jpg",
        "Computador da Dell": "images/computador.png"
    };

    let cart = [];

    const elements = {
        cartItems: document.getElementById("cart-items"),
        cartCount: document.getElementById("cart-count"),
        cartTotalPrice: document.getElementById("cart-total-price"),
        menuToggle: document.getElementById("menu-toggle"),
        navMenu: document.getElementById("nav-menu"),
        closeMenuBtn: document.getElementById("close-menu-btn"),
        openSearchBtn: document.getElementById("open-search-btn"),
        searchModal: document.getElementById("search-modal"),
        closeSearchBtn: document.getElementById("close-search-btn"),
        searchInput: document.getElementById("search-input-modal"),
        cartBtn: document.getElementById("show-cart-btn"),
        cartWindow: document.getElementById("cart-window"),
        closeCartBtn: document.getElementById("close-cart-btn"),
        checkoutBtn: document.getElementById("checkout-btn"),
        paymentSection: document.getElementById("payment-section"),
        paymentTotal: document.getElementById("payment-total"),
        qrcode: document.getElementById("qrcode"),
        maisVendidosWrapper: document.getElementById("mais-vendidos-wrapper"),
        track: document.querySelector(".carousel-track"),
        cookiePreferencesBtn: document.getElementById("cookie-preferences-btn"),
        cookiePreferencesModal: document.getElementById("cookie-preferences-modal"),
        saveCookiePreferences: document.getElementById("save-cookie-preferences"),
        acceptAllCookies: document.getElementById("accept-all-cookies")
    };

    const updateCart = () => {
        if (!elements.cartItems || !elements.cartCount || !elements.cartTotalPrice) { 
            return;
        }

        elements.cartItems.innerHTML = "";
        const total = cart.reduce((sum, item) => {
            const div = document.createElement("div");
            div.textContent = `${item.name} - R$ ${item.price.toFixed(2)} (x${item.qty})`;
            elements.cartItems.appendChild(div);
            return sum + item.price * item.qty;
        }, 0);

        elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        elements.cartTotalPrice.textContent = total.toFixed(2);
    };

    const toggleClass = (element, className, add = true) => 
        element?.classList[add ? "add" : "remove"](className);

    const toggleDisplay = (element, show = true) => 
        element && (element.style.display = show ? "block" : "none");

    const handleSearch = () => {
        const query = elements.searchInput?.value.toLowerCase() || "";
        const cards = document.querySelectorAll(".servico-card");

        cards.length > 0
            ? cards.forEach(card => {
                card.style.display = card.dataset.name.toLowerCase().includes(query) ? "block" : "none";
            })
            : query.trim() && (window.location.href = `servico.html?search=${encodeURIComponent(query)}`);
    };

    const addToCart = (button) => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        if (stock[name] <= 0) {
            console.error("Produto fora de estoque!");
            return;
        }

        const existingItem = cart.find(item => item.name === name);
        existingItem ? existingItem.qty++ : cart.push({ name, price, qty: 1 });
        stock[name]--;
        updateCart();

        if (stock[name] === 0) {
            button.disabled = true;
            button.textContent = "Esgotado";
        }
    };

    const removeFromCart = (button) => {
        const name = button.dataset.name;
        const itemIndex = cart.findIndex(item => item.name === name);

        if (itemIndex === -1)  {
            return;
        }

        cart[itemIndex].qty > 1 ? cart[itemIndex].qty-- : cart.splice(itemIndex, 1);
        updateCart();
    };

    const handleCheckout = () => {
        if (!cart.length) {
            console.error("Carrinho vazio!");
            return;
        }

        toggleDisplay(elements.cartItems, false);
        toggleDisplay(document.querySelector(".cart-total"), false);
        toggleDisplay(elements.checkoutBtn, false);
        toggleDisplay(elements.paymentSection, true);

        elements.paymentTotal.textContent = elements.cartTotalPrice.textContent;

        if (elements.qrcode) {
            new QRCode(elements.qrcode, {
                text: "https://www.asaas.com/c/ufl4af1r158at163",
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            console.error("Elemento QRCode não encontrado!");
        }
    };

    const renderMaisVendidos = () => {
        if (!elements.maisVendidosWrapper) { return;
        }

        const [[nome, qtd]] = Object.entries(vendas).sort((a, b) => b[1] - a[1]);
        const imagemUrl = imagensProdutos[nome] || "images/default.png";

        elements.maisVendidosWrapper.innerHTML = `
            <div class="best-seller-card">
                <img src="${imagemUrl}" alt="${nome}" class="best-seller-image">
                <h3 class="best-seller-title">${nome}</h3>
                <p class="best-seller-sales">${qtd} unidades vendidas</p>
                <button class="best-seller-button">Ver Produto</button>
            </div>
        `;
    };

    const handleCarousel = () => {
        if (!elements.track) { return;
        }

        const slides = Array.from(elements.track.children);
        const nextButton = document.querySelector(".carousel-button.next");
        const prevButton = document.querySelector(".carousel-button.prev");
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            currentIndex = targetIndex % slides.length;
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }
            elements.track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextButton?.addEventListener("click", () => moveToSlide(currentIndex + 1));
        prevButton?.addEventListener("click", () => moveToSlide(currentIndex - 1));
        setInterval(() => moveToSlide(currentIndex + 1), 5000);
    };

    const handleFAQ = () => {
        document.querySelectorAll(".faq-item").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".faq-item").forEach(otherItem => {
                    if (otherItem !== item) {
                        toggleClass(otherItem, "active", false);
                    }
                });
                toggleClass(item, "active");
            });
        });
    };

    const handleAnimations = () => {
        const animatedElements = document.querySelectorAll(".animate-on-scroll");
        const checkAnimations = () => {
            animatedElements.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                    toggleClass(el, "fade-in");
                }
            });
        };
        window.addEventListener("scroll", checkAnimations);
        checkAnimations();
    };

    const handleContactForm = () => {
        const contactForm = document.getElementById("contact-form");
        contactForm?.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                console.error("Por favor, preencha todos os campos corretamente.");
                return;
            }

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            object.access_key = "2bf85802-afc6-4739-9b22-b3d1f75f3541"; 
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let resJson = await response.json();
                if (response.status === 200) {
                console.error(resJson.message);
                } else {
                    console.error(resJson);
                    console.error(resJson.message);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .then(() => {
                contactForm.reset();
            });
        });
    };

    const handleCookies = () => {
        const showCookieModal = () => toggleDisplay(document.getElementById("cookie-preferences-modal"), true);

        if (!localStorage.getItem("cookiesAccepted")) {
            window.addEventListener("load", showCookieModal);
        }

        document.getElementById("cookie-preferences-btn")?.addEventListener("click", showCookieModal);

        const saveCookiePreferences = document.getElementById("save-cookie-preferences");
        if (saveCookiePreferences) {
            saveCookiePreferences.addEventListener("click", () => {
                const analytics = document.getElementById("analytics-cookies").checked;
                const marketing = document.getElementById("marketing-cookies").checked;
                localStorage.setItem("cookiesAccepted", JSON.stringify({
                    essential: true,
                    analytics,
                    marketing
                }));
                toggleDisplay(document.getElementById("cookie-preferences-modal"), false);
                console.log("Preferências de cookies salvas!");
            });
        }

        const acceptAllCookies = document.getElementById("accept-all-cookies");
        if (acceptAllCookies) {
            acceptAllCookies.addEventListener("click", () => {
                localStorage.setItem("cookiesAccepted", JSON.stringify({
                    essential: true,
                    analytics: true,
                    marketing: true
                }));
                toggleDisplay(document.getElementById("cookie-preferences-modal"), false);
                console.error("Todos os cookies aceitos!")
            });
        }
        const acceptCookies = document.getElementById("accept-cookies");
        const rejectCookies = document.getElementById("reject-cookies");
        const cookieModal = document.getElementById("cookie-modal");

        if (acceptCookies) {
            acceptCookies.addEventListener("click", () => {
                localStorage.setItem("cookiesAccepted", JSON.stringify({
                    essential: true,
                    analytics: true,
                    marketing: true
                }));
                toggleDisplay(cookieModal, false);
                console.error("Todos os cookies aceitos!");
            });
        }

        if (rejectCookies) {
            rejectCookies.addEventListener("click", () => {
                localStorage.setItem("cookiesAccepted", JSON.stringify({
                    essential: true,
                    analytics: false,
                    marketing: false
                }));
                toggleDisplay(cookieModal, false);
                console.error("Cookies essenciais aceitos apenas!");
            });
        }
    };

    elements.menuToggle?.addEventListener("click", () => toggleClass(elements.navMenu, "active"));
    elements.closeMenuBtn?.addEventListener("click", () => toggleClass(elements.navMenu, "active", false));
    elements.openSearchBtn?.addEventListener("click", () => toggleDisplay(elements.searchModal));
    elements.closeSearchBtn?.addEventListener("click", () => toggleDisplay(elements.searchModal, false));
    elements.searchInput?.addEventListener("keyup", handleSearch);
    elements.cartBtn?.addEventListener("click", () => toggleClass(elements.cartWindow, "active"));
    elements.closeCartBtn?.addEventListener("click", () => toggleClass(elements.cartWindow, "active", false));
    elements.checkoutBtn?.addEventListener("click", handleCheckout);

    document.querySelectorAll(".add-to-cart:not([disabled])").forEach(button => 
        button.addEventListener("click", () => addToCart(button))
    );

    document.querySelectorAll(".remove-from-cart:not([disabled])").forEach(button => 
        button.addEventListener("click", () => removeFromCart(button))
    );

    elements.maisVendidosWrapper?.addEventListener("click", (e) => {
        if (e.target.classList.contains("best-seller-button")) {
            window.location.href = "servico.html";
        }
    });

    renderMaisVendidos();
    handleCarousel();
    handleFAQ();
    handleAnimations();
    handleContactForm();
    handleCookies();
});