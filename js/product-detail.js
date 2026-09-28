// =========================
// VISTA DE DETALLE DEL PRODUCTO
// Cards clickeables + carrusel + relacionados
// =========================

(function () {

    const WHATSAPP_NUMBER = "51904130802";

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
    const relatedSection = document.querySelector('.related-section');

    const modalSlides = document.querySelectorAll('.modal-slide');
    const modalDots = document.querySelectorAll('.modal-dot');

    let modalCurrentSlide = 0;
    let modalInterval = null;


    // =========================
    // CARRUSEL DEL MODAL
    // =========================

    function showModalSlide(index) {

        modalSlides.forEach(slide => slide.classList.remove('active'));
        modalDots.forEach(dot => dot.classList.remove('active'));

        if (modalSlides[index]) {
            modalSlides[index].classList.add('active');
        }

        if (modalDots[index]) {
            modalDots[index].classList.add('active');
        }

        modalCurrentSlide = index;

    }


    function startModalAutoplay() {

        clearInterval(modalInterval);

        modalInterval = setInterval(() => {

            const next = modalCurrentSlide === 0 ? 1 : 0;

            showModalSlide(next);

        }, 3000);

    }


    // =========================
    // LEER PRODUCTO
    // =========================

    function readProductFromCard(card) {

        return {
            id: card.dataset.id,
            type: card.dataset.type,
            category: card.dataset.category || '',
            name: card.dataset.name,
            price: card.dataset.price,
            desc: card.dataset.desc,
            img1: card.dataset.img1,
            img2: card.dataset.img2 || card.dataset.img1
        };

    }


    // =========================
    // VERIFICAR CATEGORÍA
    // =========================

    function productHasCategory(card, selectedCategory) {

        const categories = (card.dataset.category || '')
            .toLowerCase()
            .split(/\s+/);

        return categories.indexOf(selectedCategory.toLowerCase()) !== -1;

    }


    // =========================
    // CARRUSEL DE RELACIONADOS
    // =========================

    function setupRelatedCarousel() {

        if (!relatedGrid) {
            return;
        }

        const leftButton = relatedSection.querySelector('.related-arrow-left');
        const rightButton = relatedSection.querySelector('.related-arrow-right');

        if (!leftButton || !rightButton) {
            return;
        }

        function updateArrows() {

            const maxScroll =
                relatedGrid.scrollWidth - relatedGrid.clientWidth;

            if (maxScroll <= 5) {

                leftButton.classList.remove('visible');
                rightButton.classList.remove('visible');

                return;
            }

            if (relatedGrid.scrollLeft <= 5) {
                leftButton.classList.remove('visible');
            } else {
                leftButton.classList.add('visible');
            }

            if (relatedGrid.scrollLeft >= maxScroll - 5) {
                rightButton.classList.remove('visible');
            } else {
                rightButton.classList.add('visible');
            }

        }


        leftButton.addEventListener('click', function () {

            relatedGrid.scrollBy({
                left: -relatedGrid.clientWidth,
                behavior: 'smooth'
            });

        });


        rightButton.addEventListener('click', function () {

            relatedGrid.scrollBy({
                left: relatedGrid.clientWidth,
                behavior: 'smooth'
            });

        });


        relatedGrid.addEventListener('scroll', updateArrows);

        window.addEventListener('resize', updateArrows);

        updateArrows();

    }


    // =========================
    // PRODUCTOS RELACIONADOS
    // =========================

    function renderRelated(product) {

        if (!relatedGrid) {
            return;
        }

        relatedGrid.innerHTML = '';


        // Buscamos todos los productos
        const allCards = document.querySelectorAll('.product-card');

        const relatedProducts = [];


        allCards.forEach(card => {

            // No mezclar joyas con fragancias
            if (card.dataset.type !== product.type) {
                return;
            }


            // No mostrar el producto que estamos viendo
            if (card.dataset.id === product.id) {
                return;
            }


            // Si tiene categoría, debe coincidir
            if (product.category) {

                if (!productHasCategory(card, product.category)) {
                    return;
                }

            }


            relatedProducts.push(readProductFromCard(card));

        });


        // Máximo 5 productos
        const productsToShow = relatedProducts.slice(0, 5);


        // Si no hay relacionados, ocultamos la sección
        if (!productsToShow.length) {

            relatedSection.style.display = 'none';

            return;

        }


        relatedSection.style.display = 'block';


        productsToShow.forEach(related => {

            const relCard = document.createElement('div');

            relCard.className = 'related-card';


            const relatedPriceHTML = window.PriceDiscount
                ? window.PriceDiscount.renderPriceHTML(related.price)
                : related.price;


            relCard.innerHTML = `
                
                <div class="related-image-wrapper">

                    <img 
                        class="related-product-image"
                        src="${related.img1}" 
                        alt="${related.name}"
                    >

                    <img 
                        class="related-discount-badge"
                        src="imagenes/redes/10-por-ciento.png"
                        alt="10% de descuento"
                    >

                </div>

                <div class="related-name">
                    ${related.name}
                </div>

                <div class="related-price">
                    ${relatedPriceHTML}
                </div>

            `;


            relCard.addEventListener('click', function (event) {

                event.stopPropagation();

                openProductDetail(related);

            });


            relatedGrid.appendChild(relCard);

        });


        // Actualizar flechas después de crear las cards
        setTimeout(function () {
            setupRelatedCarousel();
        }, 50);

    }


    // =========================
    // ABRIR DETALLE
    // =========================

    function openProductDetail(product) {

        modalImg1.src = product.img1;
        modalImg2.src = product.img2;

        modalImg1.alt = product.name;
        modalImg2.alt = product.name;

        modalName.textContent = product.name;
        modalDesc.textContent = product.desc;


        modalPrice.innerHTML = window.PriceDiscount
            ? window.PriceDiscount.renderPriceHTML(product.price)
            : product.price;


        const modalGallery = document.querySelector('.modal-gallery');


        if (window.PriceDiscount) {

            window.PriceDiscount.applyDiscountBadge(modalGallery);

        }


        const message =
            `Hola, quiero saber más sobre este producto: ${product.name}`;


        modalConsultar.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


        // Productos relacionados
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


    // =========================
    // CERRAR MODAL
    // =========================

    function closeModal() {

        productModal.classList.remove('active');

        document.body.style.overflow = '';

        clearInterval(modalInterval);

    }


    // =========================
    // TODA LA CARD ES CLICKEABLE
    // =========================

    document.querySelectorAll('.product-card').forEach(card => {

        card.addEventListener('click', function () {

            openProductDetail(
                readProductFromCard(card)
            );

        });

    });


    // =========================
    // PUNTITOS DEL CARRUSEL
    // =========================

    modalDots.forEach(dot => {

        dot.addEventListener('click', function () {

            const index =
                Number(dot.getAttribute('data-slide'));

            showModalSlide(index);

            startModalAutoplay();

        });

    });


    // =========================
    // CERRAR
    // =========================

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', closeModal);


    document.addEventListener('keydown', function (e) {

        if (e.key === 'Escape') {

            closeModal();

        }

    });


})();