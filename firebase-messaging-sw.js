// Importamos Firebase desde CDN
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// Configuración de tu app Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBuA8vYdEeoAhtTkYz1mPfu8l_e8eIpeFY",
  authDomain: "ultimahora-8cdd7.firebaseapp.com",
  projectId: "ultimahora-8cdd7",
  storageBucket: "ultimahora-8cdd7.firebasestorage.app",
  messagingSenderId: "64761922059",
  appId: "1:64761922059:web:97a111af73246f946e3d0e",
  measurementId: "G-E6QJLPFG3N"
});

// Inicializa Firebase Messaging
const messaging = firebase.messaging();

// Aquí manejamos las notificaciones recibidas en segundo plano
messaging.onBackgroundMessage(function(payload) {
  console.log("Notificación en segundo plano recibida: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // Puedes poner tu propio icono
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
