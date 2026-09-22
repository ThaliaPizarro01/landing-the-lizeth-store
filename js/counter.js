// =========================
// CONTADOR DE VISITAS - FIREBASE
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getDatabase,
    ref,
    runTransaction
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBEb5gRjXKxoZd5TwLf3B-juMTp3fey1g",
    authDomain: "the-lizeth-store.firebaseapp.com",
    databaseURL: "https://the-lizeth-store-default-rtdb.firebaseio.com",
    projectId: "the-lizeth-store",
    storageBucket: "the-lizeth-store.firebasestorage.app",
    messagingSenderId: "763352413444",
    appId: "1:763352413444:web:7ca5fef948137b4fd84c51"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const visitsRef = ref(db, "visits/count");

const counterEl = document.getElementById("visitCount");

// Evita sumar varias veces si la persona recarga la página
// varias veces en la misma sesión del navegador
const yaContadaEnEstaSesion = sessionStorage.getItem("visitaContada");

if (!yaContadaEnEstaSesion) {

    // Suma 1 de forma segura (transacción, evita conflictos
    // si hay varias visitas al mismo tiempo)
    runTransaction(visitsRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then((result) => {

        if (counterEl) {
            counterEl.textContent = result.snapshot.val();
        }

        sessionStorage.setItem("visitaContada", "true");

    }).catch((error) => {
        console.error("Error al actualizar el contador:", error);
    });

} else {

    // Si ya se contó en esta sesión, solo mostramos
    // el número actual sin volver a sumar
    runTransaction(visitsRef, (currentValue) => {
        return currentValue; // no modifica el valor
    }).then((result) => {

        if (counterEl) {
            counterEl.textContent = result.snapshot.val() || 0;
        }

    });

}