const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

closeMenuBtn.addEventListener("click", () => {
  navMenu.classList.remove("active");
  menuToggle.classList.remove("active");
});

// Animações on Scroll
const animateElements = document.querySelectorAll(".animate-on-scroll");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
});

animateElements.forEach((el) => observer.observe(el));

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

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    moveToSlide(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
    moveToSlide(currentIndex);
  });
}

// Chatbot
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const closeChatbot = document.getElementById("close-chatbot");
const userInput = document.getElementById("user-input");
const sendMessage = document.getElementById("send-message");
const chatbotMessages = document.getElementById("chatbot-messages");

chatbotToggle.addEventListener("click", () => {
  chatbotWindow.classList.toggle("active");
});

closeChatbot.addEventListener("click", () => {
  chatbotWindow.classList.remove("active");
});

const addMessage = (text, className) => {
  const message = document.createElement("div");
  message.classList.add("message", className);
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

function apiGetResponse(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("quem somos")) {
    return "Somos especialistas em Inteligência Artificial (AI). Trabalhamos para encontrar soluções tecnologicamente inteligentes para todas as áreas empresariais.";
  } else if (
    lowerQuery.includes("serviços") ||
    lowerQuery.includes("servicos") ||
    lowerQuery.includes("nossos serviços")
  ) {
    return "Oferecemos soluções de Machine Learning, Visão Computacional e Processamento de Linguagem Natural.";
  } else if (
    lowerQuery.includes("contato") ||
    lowerQuery.includes("contatos")
  ) {
    return "Entre em contato via email: email@ia.com ou telefone: +55 71 91234-5678.";
  } else {
    return 'Desculpe, não entendi. Tente "Quem somos", "Serviços" ou "Contato".';
  }
}

sendMessage.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (input) {
    addMessage(input, "user-message");
    userInput.value = "";
    const response = apiGetResponse(input);
    setTimeout(() => addMessage(response, "bot-message"), 500);
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage.click();
  }
});
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((clickedItem) => {
  clickedItem.addEventListener("click", () => {
    faqItems.forEach((item) => {
      if (item !== clickedItem) {
        item.classList.remove("active");
      }
    });
    clickedItem.classList.toggle("active");
  });
});

const botaoPayPal = document.getElementById('botaoPayPal');
if (botaoPayPal) {
  botaoPayPal.addEventListener('click', () => {
    window.location.href = 'https://www.paypal.com/ncp/payment/RAECRX5MSZH58';
  });
}

