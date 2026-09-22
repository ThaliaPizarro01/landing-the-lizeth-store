// =========================
// MODAL DE PRODUCTO
// =========================

const productModal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

const modalImg1 = document.getElementById('modalImg1');
const modalImg2 = document.getElementById('modalImg2');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalConsultar = document.getElementById('modalConsultar');

const modalSlides = document.querySelectorAll('.modal-slide');
const modalDots = document.querySelectorAll('.modal-dot');

let modalCurrentSlide = 0;
let modalInterval = null;


function showModalSlide(index) {

    modalSlides.forEach(slide => slide.classList.remove('active'));
    modalDots.forEach(dot => dot.classList.remove('active'));

    modalSlides[index].classList.add('active');
    modalDots[index].classList.add('active');

    modalCurrentSlide = index;

}


function startModalAutoplay() {

    clearInterval(modalInterval);

    modalInterval = setInterval(() => {

        const next = modalCurrentSlide === 0 ? 1 : 0;
        showModalSlide(next);

    }, 3000);

}


const WHATSAPP_BASE = "https://wa.me/51907134693";

function openModal(data) {

    modalImg1.src = data.img1;
    modalImg2.src = data.img2;
    modalImg1.alt = data.name;
    modalImg2.alt = data.name;

    modalName.textContent = data.name;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;

    const message = `Hola, quiero saber más sobre este producto: ${data.name}`;
    modalConsultar.href = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

    showModalSlide(0);
    startModalAutoplay();

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';

}


function closeModal() {

    productModal.classList.remove('active');
    document.body.style.overflow = '';

    clearInterval(modalInterval);

}


// Abrir modal al hacer clic en "VER"
document.querySelectorAll('.view-button').forEach(btn => {

    btn.addEventListener('click', () => {

        openModal({
            name: btn.getAttribute('data-name'),
            desc: btn.getAttribute('data-desc'),
            price: btn.getAttribute('data-price'),
            img1: btn.getAttribute('data-img1'),
            img2: btn.getAttribute('data-img2'),
            whatsapp: btn.getAttribute('data-whatsapp')
        });

    });

});


// Cambiar de foto con los puntitos
modalDots.forEach(dot => {

    dot.addEventListener('click', () => {

        const index = Number(dot.getAttribute('data-slide'));
        showModalSlide(index);
        startModalAutoplay();

    });

});


// Cerrar modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});