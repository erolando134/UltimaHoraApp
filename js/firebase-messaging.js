// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

// Tu configuración de Firebase (esto lo puedes cambiar si ya tienes uno personalizado)
const firebaseConfig = {
  apiKey: "AIzaSyBuA8vYdEeoAhtTkYz1mPfu8l_e8eIpeFY",
  authDomain: "ultimahora-8cdd7.firebaseapp.com",
  projectId: "ultimahora-8cdd7",
  storageBucket: "ultimahora-8cdd7.firebasestorage.app",
  messagingSenderId: "64761922059",
  appId: "1:64761922059:web:97a111af73246f946e3d0e",
  measurementId: "G-E6QJLPFG3N"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Obtiene el token
getToken(messaging, {
  vapidKey: "BD84CAHSl3se6cojKkNZC2xvGhAHlaTlxeQLuOgNTZyehg6VJ62n6jk4GB6F4BuOGS3ehYQh5Iyvb3shBr05LRg"
}).then((currentToken) => {
  if (currentToken) {
    console.log("Token generado:", currentToken);
    // Aquí puedes enviar el token a tu servidor si quieres
  } else {
    console.log("No se pudo obtener el token.");
  }
}).catch((err) => {
  console.log("Error al obtener el token:", err);
});

// Muestra mensajes cuando la app está en primer plano
onMessage(messaging, (payload) => {
  console.log("Mensaje recibido:", payload);
});
