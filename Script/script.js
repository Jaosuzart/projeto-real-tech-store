
document.addEventListener("DOMContentLoaded", () => {
    const crcTable = new Array(256);
    for (let i = 0; i < 256; i++) {
        let r = i << 8;
        for (let j = 0; j < 8; j++) {
            if (r & 0x8000) {
                r = (r << 1) ^ 0x1021;
            } else {
                r <<= 1;
            }
            r &= 0xFFFF;
        }
        crcTable[i] = r;
    }

    const crc16 = (s) => {
        let crc = 0xFFFF;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            if (c > 255) throw new RangeError();
            let j = ((c ^ (crc >> 8)) & 0xFF);
            crc = (crcTable[j] ^ (crc << 8)) & 0xFFFF;
        }
        return crc;
    };

    const generatePixPayload = (total) => {
        const pixKey = "techstore@exemplo.com"; 
        const merchantName = "Techstore";
        const merchantCity = "Sao Paulo";
        const txid = Math.random().toString(36).substring(2, 27).toUpperCase().padEnd(25, 'A');

        let payload = "000201"; 
        payload += "010212"; 
        payload += "0014BR.GOV.BCB.PIX"; 
        const keyLen = pixKey.length.toString().padStart(2, "0");
        payload += keyLen + pixKey; 
        payload += "52040000"; 
        payload += "5303BRL"; 
        const amountCents = Math.round(total * 100).toString();
        const amountLen = amountCents.length.toString().padStart(2, "0");
        payload += "54" + amountLen + amountCents;
        payload += "5802BR";
        const nameLen = merchantName.length.toString().padStart(2, "0");
        payload += "59" + nameLen + merchantName; 
        const cityLen = merchantCity.length.toString().padStart(2, "0");
        payload += "60" + cityLen + merchantCity; 
        const txidLen = (2 + 2 + txid.length).toString().padStart(2, "0");
        payload += "62" + txidLen + "0525" + txid; 
        
        const tempPayload = payload + "6304";
        const crcValue = crc16(tempPayload);
        const crcHex = crcValue.toString(16).padStart(4, "0").toUpperCase();
        payload += "6304" + crcHex;
        
        return payload;
    };

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

    const simulatePaymentAPI = async (total) => {
        try {
            const bankResp = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            const bankData = await bankResp.json();
            const data = await new Promise((resolve) => {
                setTimeout(() => {
                    const paymentCode = generatePixPayload(total);
                    resolve({
                        paymentCode,
                        transactionId: bankData.id,
                        bankStatus: bankData.title.substring(0, 20) + '...',
                        message: `Pagamento simulado no banco fictício! Transação: ${bankData.id}`
                    });
                }, 1000);
            });
            console.log("Dados de pagamento via banco fictício:", data.message);
            return data;
        } catch (error) {
            console.error("Erro na simulação de API de pagamento:", error);
            throw error;
        }
    };

    const simulateEmailAPI = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await response.json();
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const email = randomUser.email;
            console.log(`Email fictício: ${email}`);
            return {
                email,
                message: "Email fictício obtido via API!"
            };
        } catch (error) {
            console.error("Erro na API de email:", error);
            throw error;
        }
    };

    const renderBestSeller = (products) => {
        const wrapper = document.getElementById("mais-vendidos-wrapper");
        if (!wrapper) return;
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
        if (product.stock === 0) card.classList.add('out-of-stock');
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
        if (!container) return;
        container.append(...products.map(createProductCard));
    };

    const updateCart = () => {
        const cartItems = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const cartTotalPrice = document.getElementById("cart-total-price");
        if (!cartItems) return;
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `<div>${item.name} - R$ ${item.price.toFixed(2)} (x${item.qty})</div>`;
        }).join('');
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartTotalPrice) cartTotalPrice.textContent = total.toFixed(2);
    };

    const handleCartAction = (e) => {
        if (!e.target.matches('.add-to-cart, .remove-from-cart')) return;
        const name = e.target.dataset.name;
        const isAdd = e.target.classList.contains('add-to-cart');
        const price = parseFloat(e.target.dataset.price);
        const item = cart.find(i => i.name === name);
        if (isAdd) {
            if (stock[name] <= 0) return alert("Produto fora de estoque!");
            if (item) {
                item.qty++;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            stock[name]--;
            if (stock[name] === 0) {
                e.target.disabled = true;
                e.target.textContent = "Esgotado";
            }
        } else if (item) {
            item.qty--;
            if (item.qty === 0) {
                cart = cart.filter(i => i.name !== name);
            }
        }
        updateCart();
    };

    const renderForm = (fields) => {
        const container = document.getElementById("form-container");
        if (!container) return;
        const form = document.createElement('form');
        form.id = "contact-form";
        fields.forEach(field => {
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            form.appendChild(label);
            const input = field.type === 'textarea' ? document.createElement('textarea') : Object.assign(document.createElement('input'), { type: field.type });
            Object.assign(input, { id: field.id, name: field.id, required: field.required });
            if (field.placeholder) input.placeholder = field.placeholder;
            form.appendChild(input);
        });
        const submit = document.createElement('button');
        submit.type = "submit";
        submit.textContent = "Enviar mensagem";
        form.appendChild(submit);
        container.appendChild(form);
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                console.error("Por favor, preencha todos os campos corretamente.");
                return;
            }
            try {
                const emailData = await simulateEmailAPI();
                console.log(`Mensagem enviada ficticiamente para: ${emailData.email}`);
                alert(`Mensagem enviada com sucesso para o email fictício: ${emailData.email}!`);
            } catch (error) {
                console.error("Erro ao simular envio de mensagem:", error);
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
        overlay?.classList.add("active");
    });

    closeMenuBtn?.addEventListener("click", () => {
        navMenu.classList.remove("active");
        overlay?.classList.remove("active");
    });

    overlay?.addEventListener("click", () => {
        navMenu.classList.remove("active");
        overlay?.classList.remove("active");
    });

    const openSearchBtn = document.getElementById("open-search-btn");
    const searchModal = document.getElementById("search-modal");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const searchInput = document.getElementById("search-input-modal");

    openSearchBtn?.addEventListener("click", () => searchModal.style.display = "block");
    closeSearchBtn?.addEventListener("click", () => searchModal.style.display = "none");

    searchInput?.addEventListener("keyup", () => {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        document.querySelectorAll(".servico-card").forEach(card => {
            const show = card.dataset.name.toLowerCase().includes(query);
            card.style.display = show ? "block" : "none";
            if (show) visibleCount++;
        });
        if (query && visibleCount === 0) {
            window.location.href = `servico.html?search=${encodeURIComponent(query)}`;
        }
    });

    const cartBtn = document.getElementById("show-cart-btn");
    const cartWindow = document.getElementById("cart-window");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    cartBtn?.addEventListener("click", () => cartWindow.classList.add("active"));
    closeCartBtn?.addEventListener("click", () => cartWindow.classList.remove("active"));

    checkoutBtn?.addEventListener("click", async () => {
        if (!cart.length) return alert("Carrinho vazio!");
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.querySelector('.cart-total');
        if (cartItemsEl) cartItemsEl.style.display = 'none';
        if (cartTotalEl) cartTotalEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) paymentSection.style.display = 'flex';
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const paymentTotalEl = document.getElementById('payment-total');
        if (paymentTotalEl) paymentTotalEl.textContent = total.toFixed(2);
        try {
            const paymentData = await simulatePaymentAPI(total);
            const qrcodeEl = document.getElementById("qrcode");
            try {
                if (qrcodeEl) {
                    new QRCode(qrcodeEl, {
                        text: paymentData.paymentCode,
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
                console.log("QR Code PIX fictício gerado! Escaneie para simular pagamento.");
            } catch (qrError) {
                console.error("Erro ao gerar QR Code (biblioteca não carregada):", qrError);
                if (qrcodeEl) {
                    qrcodeEl.innerHTML = `<div style="font-family: monospace; white-space: pre-wrap; background: #f5f5f5; padding: 10px; border: 1px solid #ccc;">Código PIX para copiar (simulação banco):<br>${paymentData.paymentCode}<br><small>Transação ID: ${paymentData.transactionId} | Status: ${paymentData.bankStatus}</small></div>`;
                }
            }
            console.error(`Transação simulada no banco: ID ${paymentData.transactionId}, Status: ${paymentData.bankStatus}`);
        } catch (error) {
            console.error("Erro ao gerar QR Code fictício:", error);
        }
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
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
            el.classList.add("fade-in");
        }
    });
    window.addEventListener("scroll", checkAnimations);
    checkAnimations();

    const cookieBtn = document.getElementById("cookie-preferences-btn");
    const cookieModal = document.getElementById("cookie-preferences-modal");
    const saveBtn = document.getElementById("save-cookie-preferences");
    const acceptAllBtn = document.getElementById("accept-all-cookies");

    cookieBtn?.addEventListener("click", () => cookieModal.style.display = "block");
    saveBtn?.addEventListener("click", () => cookieModal.style.display = "none");
    acceptAllBtn?.addEventListener("click", () => cookieModal.style.display = "none");
});