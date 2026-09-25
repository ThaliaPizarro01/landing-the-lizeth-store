// =========================
// VISTA DE DETALLE DEL PRODUCTO
// Cards clickeables + carrusel + relacionados
// =========================

(function () {

    const WHATSAPP_NUMBER = "51907134693";

    const productModal = document.getElementById('productModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.querySelector('.product-modal-content');

    const modalImg1 = document.getElementById('modalImg1');
    const modalImg2 = document.getElementById('modalImg2');
    const modalName = document.getElementById('modalName');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalConsultar = document.getElementById('modalConsultar');
    const relatedGrid = document.getElementById('relatedGrid');

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


    // Lee los datos de un producto directamente desde su card en el DOM
    function readProductFromCard(card) {

        return {
            id: card.dataset.id,
            type: card.dataset.type,
            name: card.dataset.name,
            price: card.dataset.price,
            desc: card.dataset.desc,
            img1: card.dataset.img1,
            img2: card.dataset.img2 || card.dataset.img1
        };

    }


    // Arma la lista de "también te puede interesar"
    // (misma categoría: joya con joyas, fragancia con fragancias)
    function renderRelated(product) {

        relatedGrid.innerHTML = '';

        const allCards = document.querySelectorAll('.product-card');

        allCards.forEach(card => {

            if (card.dataset.type !== product.type) return;
            if (card.dataset.id === product.id) return;

            const related = readProductFromCard(card);

            const relCard = document.createElement('div');
            relCard.className = 'related-card';

            relCard.innerHTML = `
                <img src="${related.img1}" alt="${related.name}">
                <div class="related-name">${related.name}</div>
                <div class="related-price">${related.price}</div>
            `;

            relCard.addEventListener('click', () => {
                openProductDetail(related);
            });

            relatedGrid.appendChild(relCard);

        });

    }


    function openProductDetail(product) {

        modalImg1.src = product.img1;
        modalImg2.src = product.img2;
        modalImg1.alt = product.name;
        modalImg2.alt = product.name;

        modalName.textContent = product.name;
        modalDesc.textContent = product.desc;
        modalPrice.textContent = product.price;

        const message = `Hola ✨🩷, quiero saber más sobre este producto: ${product.name}`;
        modalConsultar.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        renderRelated(product);

        showModalSlide(0);
        startModalAutoplay();

        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Siempre empieza mostrando desde arriba
        if (modalContent) {
            modalContent.scrollTop = 0;
        }

    }


    function closeModal() {

        productModal.classList.remove('active');
        document.body.style.overflow = '';

        clearInterval(modalInterval);

    }


    // Toda la card es clickeable
    document.querySelectorAll('.product-card').forEach(card => {

        card.addEventListener('click', () => {
            openProductDetail(readProductFromCard(card));
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


    // Cerrar
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

})();