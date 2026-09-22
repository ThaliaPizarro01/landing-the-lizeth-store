// =========================
// GENERA LOS LINKS DE WHATSAPP
// SEGÚN EL NOMBRE DE CADA PRODUCTO
// =========================

const WHATSAPP_BASE = "https://wa.me/51907134693";

document.querySelectorAll('.product-card').forEach(card => {

    const nameEl = card.querySelector('.product-name');
    const buyBtn = card.querySelector('.buy-button-item');

    if (!nameEl || !buyBtn) return;

    const productName = nameEl.textContent.trim();

    const message = `Hola, quiero saber más sobre este producto: ${productName}`;

    buyBtn.href = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

});