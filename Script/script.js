document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const removeToCartButtons = document.querySelectorAll('.remove-to-cart');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.getElementById('cart-count');
    const showCartBtn = document.getElementById('show-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const qrcodeDiv = document.getElementById('qrcode-asaas');
    const cartWindow = document.getElementById('cart-window');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCart();
        });
    });

    removeToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const itemIndex = cart.findIndex(item => item.name === name);
            if (itemIndex > -1) {
                cart[itemIndex].quantity -= 1;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                updateCart();
            }
        });
    });

    const updateCart = () => {
        if (!cartItemsElement) {
            return;
        }
        cartItemsElement.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = `${item.name} - Qtd: ${item.quantity} - Total: R$ ${(item.price * item.quantity).toFixed(2)}`;
            cartItemsElement.appendChild(itemDiv);
            total += item.price * item.quantity;
        });
        cartTotalPrice.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    if (showCartBtn) {
        showCartBtn.addEventListener('click', () => {
            cartWindow.classList.add('active');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartWindow.classList.remove('active');
            if (qrcodeDiv) {
                qrcodeDiv.innerHTML = '';
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            let asaasURL = `https://www.asaas.com/c/hh9qc8usb4l00esn`;
            if (qrcodeDiv) {
                qrcodeDiv.innerHTML = '';
                const canvas = document.createElement('canvas');
                if (typeof QRCode !== 'undefined') {
                    QRCode.toCanvas(canvas, asaasURL, { width: 200 }, function (error) {
                        if (error) {
                            console.error(error);
                            qrcodeDiv.innerHTML = 'Erro ao gerar QR Code.';
                        } else {
                            qrcodeDiv.appendChild(canvas);
                        }
                    });
                } else {
                    qrcodeDiv.innerHTML = 'Biblioteca QR Code não encontrada.';
                }
            }
        });
    }

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".container-navegacao");
    const closeMenuBtn = document.getElementById("close-menu-btn");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    if (closeMenuBtn && navMenu) {
        closeMenuBtn.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    }

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                }
            });
        }, { threshold: 0.1 });
        animateElements.forEach((el) => {
            observer.observe(el);
        });
    }

    const carouselTrack = document.querySelector(".carousel-track");
    if (carouselTrack) {
        const carouselSlides = Array.from(carouselTrack.children);
        const prevBtn = document.querySelector(".carousel-prev");
        const nextBtn = document.querySelector(".carousel-next");
        let currentIndex = 0;

        const moveToSlide = (index) => {
            if (carouselSlides.length > 0) {
                const slideWidth = carouselSlides[0].getBoundingClientRect().width;
                carouselTrack.style.transform = `translateX(-${index * slideWidth}px)`;
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % carouselSlides.length;
                moveToSlide(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
                moveToSlide(currentIndex);
            });
        }
    }

    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChatbot = document.getElementById("close-chatbot");
    const userInput = document.getElementById("user-input");
    const sendMessage = document.getElementById("send-message");
    const chatbotMessages = document.getElementById("chatbot-messages");

    if (chatbotToggle) {
        chatbotToggle.addEventListener("click", () => {
            chatbotWindow.classList.toggle("active");
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener("click", () => {
            chatbotWindow.classList.remove("active");
        });
    }

    const addMessage = (text, className) => {
        if (!chatbotMessages) {
            return;
        }
        const message = document.createElement("div");
        message.classList.add("message", className);
        message.textContent = text;
        chatbotMessages.appendChild(message);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const apiGetResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("quem somos")) {
            return "Somos especialistas em venda de produtos eletrônicos e de serviços tecnológicos. Trabalhamos para encontrar soluções tecnologicamente inteligentes para todas as áreas empresariais.";
        } else if (lowerQuery.includes("serviços") || lowerQuery.includes("servicos") || lowerQuery.includes("nossos serviços")) {
            return "Oferecemos vendas de produtos eletrônicos e de serviços tecnológicos.";
        } else if (lowerQuery.includes("contato") || lowerQuery.includes("contatos")) {
            return "Entre em contato via email: [email@techstore.com](mailto:email@techstore.com) ou telefone: +55 71 91234-5678.";
        } else {
            return 'Desculpe, não entendi. Tente "Quem somos", "Serviços" ou "Contato".';
        }
    };

    const handleSendMessage = () => {
        const input = userInput.value.trim();
        if (input) {
            addMessage(input, "user-message");
            userInput.value = "";
            const response = apiGetResponse(input);
            setTimeout(() => {
                addMessage(response, "bot-message");
            }, 500);
        }
    };

    if (sendMessage) {
        sendMessage.addEventListener("click", handleSendMessage);
    }

    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        });
    }

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.addEventListener("click", () => {
            const isItemActive = item.classList.contains("active");
            faqItems.forEach((otherItem) => {
                otherItem.classList.remove("active");
            });
            if (!isItemActive) {
                item.classList.add("active");
            }
        });
    });

    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query === '') {
            if (window.location.pathname.endsWith('servico.html')) {
                productCards.forEach(card => {
                    card.classList.remove('hidden');
                });
            }
            return;
        }
        if (window.location.pathname.includes('servico.html')) {
            productCards.forEach(card => {
                const name = card.dataset.name.toLowerCase();
                if (name.includes(query)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        } else {
            window.location.href = 'servico.html?search=' + encodeURIComponent(query);
        }
    };

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (window.location.pathname.includes('servico.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('search');
        if (query) {
            searchInput.value = query;
            performSearch();
        }
    }
});
