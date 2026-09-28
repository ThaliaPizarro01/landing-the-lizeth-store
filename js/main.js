/* =========================
   MENÚ HAMBURGUESA
========================= */

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cierra el menú al hacer clic en un link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


/* =========================
   COPIAR DATOS DE PAGO
========================= */

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');

        navigator.clipboard.writeText(text).then(() => {
            btn.classList.add('copied');
            alert('¡Información copiada!');

            setTimeout(() => {
                btn.classList.remove('copied');
            }, 1500);
        }).catch(() => {
            alert('No se pudo copiar. Intenta seleccionar el texto manualmente.');
        });
    });
});


/* =========================
   CARRUSEL DEL HERO
========================= */

const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

const heroMainContent = document.querySelector('.hero-main-content');
const heroNewCollection = document.querySelector('.hero-new-collection');
const heroDiscount = document.querySelector('.hero-discount');

const heroContentByIndex = [heroMainContent, heroNewCollection, heroDiscount];

let currentSlide = 0;


function showSlide(index) {

    /* Cambiar imagen */

    heroSlides.forEach(slide => {
        slide.classList.remove('active');
    });

    heroSlides[index].classList.add('active');


    /* Cambiar puntito */

    heroDots.forEach(dot => {
        dot.classList.remove('active');
    });

    heroDots[index].classList.add('active');


    /* Cambiar texto: se muestra solo el bloque que
       corresponde al slide actual */

    heroContentByIndex.forEach((content, i) => {

        if (!content) return;

        content.style.display = (i === index) ? 'block' : 'none';

    });


    currentSlide = index;

}


/* =========================
   CAMBIO AUTOMÁTICO
   CADA 3 SEGUNDOS
========================= */

let heroInterval = setInterval(() => {

    let nextSlide = currentSlide + 1;

    if (nextSlide >= heroSlides.length) {
        nextSlide = 0;
    }

    showSlide(nextSlide);

}, 3000);


/* =========================
   CAMBIO CON LOS PUNTITOS
========================= */

heroDots.forEach(dot => {

    dot.addEventListener('click', () => {

        const slideIndex = Number(
            dot.getAttribute('data-slide')
        );

        showSlide(slideIndex);


        /* Reiniciar contador */

        clearInterval(heroInterval);

        heroInterval = setInterval(() => {

            let nextSlide = currentSlide + 1;

            if (nextSlide >= heroSlides.length) {
                nextSlide = 0;
            }

            showSlide(nextSlide);

        }, 3000);

    });

});

// =========================================
// FILTRO DE JOYAS
// =========================================

document.addEventListener('DOMContentLoaded', function () {

    var jewelryFilters = document.querySelectorAll('.jewelry-filter');
    var jewelryProducts = document.querySelectorAll('#joyas .product-card');

    if (!jewelryFilters.length || !jewelryProducts.length) {
        return;
    }

    jewelryFilters.forEach(function (button) {

        button.addEventListener('click', function () {

            var selectedFilter = this.getAttribute('data-filter');

            // Cambiar botón activo
            jewelryFilters.forEach(function (filterButton) {
                filterButton.classList.remove('active');
            });

            this.classList.add('active');

            // Filtrar productos
            jewelryProducts.forEach(function (product) {

                var categories = product.getAttribute('data-category') || '';

                categories = categories.toLowerCase().split(' ');

                if (
                    selectedFilter === 'todos' ||
                    categories.indexOf(selectedFilter) !== -1
                ) {
                    product.classList.remove('jewelry-product-hidden');
                } else {
                    product.classList.add('jewelry-product-hidden');
                }

            });

        });

    });

});