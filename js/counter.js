// =========================
// CONTADOR DE VISITAS - FIREBASE
// =========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
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

    // Primera vez en esta sesión: suma 1 de forma segura
    // (transacción, evita conflictos si hay varias visitas
    // al mismo tiempo)
    runTransaction(visitsRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then((result) => {

        if (counterEl) {
            counterEl.textContent = result.snapshot.val();
        }

        sessionStorage.setItem("visitaContada", "true");

    }).catch((error) => {
        console.error("Error al actualizar el contador:", error);

        // Aunque falle la suma, intentamos mostrar el número actual
        // para que nunca se quede en "..."
        get(visitsRef).then((snapshot) => {
            if (counterEl) {
                counterEl.textContent = snapshot.val() || 0;
            }
        });
    });

} else {

    // Ya se contó en esta sesión (por ejemplo, recargaste la página):
    // solo LEEMOS el número actual, sin intentar escribir nada
    get(visitsRef).then((snapshot) => {

        if (counterEl) {
            counterEl.textContent = snapshot.val() || 0;
        }

    }).catch((error) => {
        console.error("Error al leer el contador:", error);
    });

}