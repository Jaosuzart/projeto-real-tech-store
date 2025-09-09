document.addEventListener("DOMContentLoaded", () => {
    const stock = {
        "Fones de Ouvido da JBL": 2,
        "Celular da Xiaomi": 0,
        "Computador da Dell": 0
    };

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.add("active");
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener("click", () => {
                navMenu.classList.remove("active");
            });
        }
    }

    const openSearchBtn = document.getElementById("open-search-btn");
    const searchModal = document.getElementById("search-modal");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const searchInput = document.getElementById("search-input-modal");

    if (openSearchBtn && searchModal) {
        openSearchBtn.addEventListener("click", () => {
            searchModal.style.display = "block";
        });
    }

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener("click", () => {
            searchModal.style.display = "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const query = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll(".servico-card");
            if (cards.length > 0) { 
                cards.forEach((card) => {
                    const name = card.dataset.name.toLowerCase();
                    if (name.includes(query)) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            } else if (query.trim()) {
                window.location.href = `servico.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    const cartBtn = document.getElementById("show-cart-btn");
    const cartWindow = document.getElementById("cart-window");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const checkoutBtn = document.getElementById("checkout-btn");
    
    let cart = [];

    const updateCart = () => {
        cartItems.innerHTML = "";
        let total = 0;
        
        cart.forEach((item) => {
            const div = document.createElement("div");
            div.textContent = `${item.name} - R$ ${item.price.toFixed(2)} (x${item.qty})`;
            cartItems.appendChild(div);
            total += item.price * item.qty;
        });
        
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        cartTotalPrice.textContent = total.toFixed(2);
    }
    
    if (cartBtn && cartWindow) {
        cartBtn.addEventListener("click", () => {
            cartWindow.classList.add("active");
        });
        
        if (closeCartBtn) {
            closeCartBtn.addEventListener("click", () => {
                cartWindow.classList.remove("active");
            });
        }
    }

    const addToCartButtons = document.querySelectorAll(".add-to-cart:not([disabled])");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            if (stock[name] > 0) {
                const existingItem = cart.find((item) => item.name === name);
                if (existingItem) {
                    existingItem.qty++;
                } else {
                    cart.push({ name, price, qty: 1 });
                }
                stock[name]--;
                updateCart();
                if (stock[name] === 0) {
                    button.disabled = true;
                    button.textContent = "Esgotado";
                }
            } else {
                alert("Produto fora de estoque!");
            }
        });
    });

    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart:not([disabled])");
    removeFromCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const itemIndex = cart.findIndex((item) => item.name === name);
            if (itemIndex !== -1) {
                if (cart[itemIndex].qty > 1) {
                    cart[itemIndex].qty--;
                } else {
                    cart.splice(itemIndex, 1);
                }
                updateCart();
            }
        });
    });

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Carrinho vazio!");
            return;
        }
        window.location.href = "https://www.asaas.com/c/ufl4af1r158at163";
    });
}
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

    const maisVendidosWrapper = document.getElementById("mais-vendidos-wrapper");

    const renderMaisVendidos = () => {
        if (!maisVendidosWrapper) {
            return;
        }

        const ranking = Object.entries(vendas).sort((a, b) => b[1] - a[1]);
        const [nome, qtd] = ranking[0];
        const imagemUrl = imagensProdutos[nome] || "images/default.png";

        maisVendidosWrapper.innerHTML = `
            <div class="best-seller-card">
                <img src="${imagemUrl}" alt="${nome}" class="best-seller-image">
                <h3 class="best-seller-title">${nome}</h3>
                <p class="best-seller-sales">${qtd} unidades vendidas</p>
                <button class="best-seller-button">Ver Produto</button>
            </div>
        `;
    };
    renderMaisVendidos();
    
    if (maisVendidosWrapper) {
        maisVendidosWrapper.addEventListener("click", (e) => {
            if (e.target.classList.contains("best-seller-button")) {
                window.location.href = "servico.html";
            }
        });
    }

    const track = document.querySelector(".carousel-track");
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector(".carousel-button.next");
        const prevButton = document.querySelector(".carousel-button.prev");
        
        let currentIndex = 0;
        
        const moveToSlide = (targetIndex) => {
            let newIndex = targetIndex;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            } else if (newIndex >= slides.length) {
                newIndex = 0;
            }

            track.style.transform = `translateX(-${newIndex * 100}%)`;
            currentIndex = newIndex;
        };

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                moveToSlide(currentIndex + 1);
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                moveToSlide(currentIndex - 1);
            });
        }

        setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000);
    }

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.addEventListener("click", () => {
            faqItems.forEach((otherItem) => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                }
            });
            item.classList.toggle("active");
        });
    });

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    const checkAnimations = () => {
        animatedElements.forEach((el) => {
            const position = el.getBoundingClientRect().top;
            if (position < window.innerHeight - 50) {
                el.classList.add("fade-in");
            }
        });
    };
    window.addEventListener("scroll", checkAnimations);
    checkAnimations(); 

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            if (!contactForm.checkValidity()) {
                alert("Por favor, preencha todos os campos corretamente.");
                e.preventDefault();
            } else {
                alert("Mensagem preparada para envio! Clique em OK para abrir seu cliente de email.");
            }
        });
    }
});