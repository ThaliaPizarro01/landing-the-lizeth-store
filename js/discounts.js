// =========================
// DESCUENTOS
// =========================

// 👉 Para activar o desactivar la oferta del 10% en TODO el sitio,
// solo cambia este valor a true o false y sube el archivo de nuevo.
const DISCOUNT_ACTIVE = true;

const DISCOUNT_PERCENT = 0.10;
const DISCOUNT_BADGE_SRC = "imagenes/redes/10-por-ciento.png";


// Convierte "S/ 28.00" -> 28.00
function parsePrice(str) {
    const clean = str.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(clean);
}


// Convierte 28.00 -> "S/ 28.00"
function formatPrice(num) {
    return `S/ ${num.toFixed(2)}`;
}


// Devuelve el HTML del precio (con o sin descuento, según la constante)
function renderPriceHTML(originalPriceStr) {

    if (!DISCOUNT_ACTIVE) {
        return originalPriceStr;
    }

    const original = parsePrice(originalPriceStr);
    const discounted = original * (1 - DISCOUNT_PERCENT);

    return `
        <span class="price-original">${formatPrice(original)}</span>
        <span class="price-discounted">${formatPrice(discounted)}</span>
    `;

}


// Agrega el ícono de descuento a la esquina superior derecha
// del contenedor que se le pase (una card o el modal-gallery)
function applyDiscountBadge(container) {

    if (!DISCOUNT_ACTIVE || !container) return;

    // Evita duplicar el ícono si ya existe uno ahí
    const existing = container.querySelector('.discount-badge');
    if (existing) existing.remove();

    const badge = document.createElement('img');
    badge.src = DISCOUNT_BADGE_SRC;
    badge.alt = '10% de descuento';
    badge.className = 'discount-badge';

    container.appendChild(badge);

}


// Aplica el descuento a cada card del catálogo (joyas y fragancias)
document.querySelectorAll('.product-card').forEach(card => {

    const priceEl = card.querySelector('.price');

    if (priceEl) {
        priceEl.innerHTML = renderPriceHTML(card.dataset.price);
    }

    applyDiscountBadge(card);

});


// Se exponen estas funciones para que product-detail.js
// también las use al abrir la vista de detalle del producto
window.PriceDiscount = {
    active: DISCOUNT_ACTIVE,
    renderPriceHTML,
    applyDiscountBadge
};