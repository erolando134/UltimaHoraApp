/**
 * Última Hora R.M.K. - Funcionalidad Principal
 * @file app.js
 * @description Controla todos los formularios y lógica de la aplicación
 */

document.addEventListener("DOMContentLoaded", function () {
  // ======================
  // CONFIGURACIÓN INICIAL
  // ======================
  const CONFIG = {
    appName: "Última Hora R.M.K.",
    currency: "CUP",
    minDeposit: 100,
    commissionRates: {
      urban: 0.10,
      intercity: 0.20,
      cargo: 0.20,
      excursions: 0.20
    }
  };

  // ======================
  // 1. RECARGA DE SALDO
  // ======================
  const setupBalanceRecharge = () => {
    const form = document.getElementById("formRecarga");
    const balanceDisplay = document.getElementById("saldoActual");
    const amountInput = document.getElementById("montoRecarga");

    if (!form || !balanceDisplay || !amountInput) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const amount = parseInt(amountInput.value);
      
      // Validaciones
      if (isNaN(amount)) {
        showAlert("❌ Ingrese un monto válido", "error");
        return;
      }
      
      if (amount < CONFIG.minDeposit) {
        showAlert(`⚠️ El monto mínimo es ${CONFIG.minDeposit} ${CONFIG.currency}`, "warning");
        return;
      }

      // Actualizar saldo
      let currentBalance = parseInt(balanceDisplay.textContent) || 0;
      currentBalance += amount;
      balanceDisplay.textContent = currentBalance;
      
      // Feedback y reset
      showAlert(`✅ Recarga exitosa: +${amount} ${CONFIG.currency}`, "success");
      form.reset();
      
      // Guardar en localStorage
      localStorage.setItem('userBalance', currentBalance);
    });
  };

  // ======================
  // 2. VIAJES INTERPROVINCIALES
  // ======================
  const setupIntercityTrips = () => {
    const form = document.getElementById("formInterprovincial");
    const historyList = document.getElementById("historialInterprovincial");

    if (!form || !historyList) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const tripData = {
        origin: document.getElementById("origen").value,
        destination: document.getElementById("destino").value,
        departure: document.getElementById("salida").value,
        arrival: document.getElementById("llegada").value,
        price: document.getElementById("precio").value
      };

      // Validaciones
      if (!tripData.origin || !tripData.destination) {
        showAlert("❌ Origen y destino son requeridos", "error");
        return;
      }

      if (new Date(tripData.departure) > new Date(tripData.arrival)) {
        showAlert("⚠️ La fecha de llegada debe ser posterior", "warning");
        return;
      }

      // Calcular comisión
      const commission = tripData.price * CONFIG.commissionRates.intercity;
      const driverEarnings = tripData.price - commission;

      // Crear elemento de historial
      const tripItem = document.createElement("li");
      tripItem.className = "trip-item";
      tripItem.innerHTML = `
        <div class="trip-route">
          <strong>${tripData.origin} → ${tripData.destination}</strong>
        </div>
        <div class="trip-dates">
          <span>Salida: ${formatDate(tripData.departure)}</span>
          <span>Llegada: ${formatDate(tripData.arrival)}</span>
        </div>
        <div class="trip-pricing">
          <span class="price">${tripData.price} ${CONFIG.currency}</span>
          <span class="commission">Comisión: ${commission} ${CONFIG.currency}</span>
          <span class="earnings">Ganancias: ${driverEarnings} ${CONFIG.currency}</span>
        </div>
      `;

      historyList.prepend(tripItem);
      form.reset();
      showAlert("Viaje registrado exitosamente", "success");
    });
  };

  // ======================
  // 3. TRANSPORTE DE CARGA
  // ======================
  const setupCargoTransport = () => {
    const form = document.getElementById("formCarga");
    const historyList = document.getElementById("historialCarga");

    if (!form || !historyList) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const cargoData = {
        origin: document.getElementById("origenCarga").value,
        destination: document.getElementById("destinoCarga").value,
        date: document.getElementById("fechaCarga").value,
        type: document.getElementById("tipoCarga").value,
        price: document.getElementById("precioCarga").value
      };

      // Validaciones
      const validCargoTypes = ["Paquete", "Mudanza", "Mercancía", "Equipaje", "Otros"];
      if (!validCargoTypes.includes(cargoData.type)) {
        showAlert(`Tipo de carga inválido. Use: ${validCargoTypes.join(", ")}`, "error");
        return;
      }

      // Calcular comisión
      const commission = cargoData.price * CONFIG.commissionRates.cargo;
      const driverEarnings = cargoData.price - commission;

      // Crear elemento de historial
      const cargoItem = document.createElement("li");
      cargoItem.className = "cargo-item";
      cargoItem.innerHTML = `
        <div class="cargo-header">
          <span class="cargo-type ${cargoData.type.toLowerCase()}">${cargoData.type}</span>
          <span class="cargo-price">${cargoData.price} ${CONFIG.currency}</span>
        </div>
        <div class="cargo-route">
          ${cargoData.origin} → ${cargoData.destination}
        </div>
        <div class="cargo-footer">
          <span>${formatDate(cargoData.date)}</span>
          <span class="earnings">Gana: ${driverEarnings} ${CONFIG.currency}</span>
        </div>
      `;

      historyList.prepend(cargoItem);
      form.reset();
    });
  };

  // ======================
  // 4. EXCURSIONES
  // ======================
  const setupExcursions = () => {
    const form = document.getElementById("formExcursion");
    const historyList = document.getElementById("historialExcursion");

    if (!form || !historyList) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const excursionData = {
        destination: document.getElementById("destinoExcursion").value,
        date: document.getElementById("fechaExcursion").value,
        time: document.getElementById("horaExcursion").value,
        price: document.getElementById("precioExcursion").value
      };

      // Validaciones
      if (new Date(excursionData.date) < new Date()) {
        showAlert("⚠️ La fecha debe ser futura", "warning");
        return;
      }

      // Calcular comisión
      const commission = excursionData.price * CONFIG.commissionRates.excursions;
      const driverEarnings = excursionData.price - commission;

      // Crear elemento de historial
      const excursionItem = document.createElement("li");
      excursionItem.className = "excursion-item";
      excursionItem.innerHTML = `
        <div class="excursion-header">
          <h4>${excursionData.destination}</h4>
          <span class="price">${excursionData.price} ${CONFIG.currency}</span>
        </div>
        <div class="excursion-date">
          ${formatDate(excursionData.date)} a las ${excursionData.time}
        </div>
        <div class="excursion-earnings">
          <span>Comisión: ${commission} ${CONFIG.currency}</span>
          <span>Ganancias: ${driverEarnings} ${CONFIG.currency}</span>
        </div>
      `;

      historyList.prepend(excursionItem);
      form.reset();
    });
  };

  // ======================
  // FUNCIONES DE APOYO
  // ======================
  const showAlert = (message, type) => {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
      <p>${message}</p>
      <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-eliminación después de 5 segundos
    setTimeout(() => {
      alert.classList.add('fade-out');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
    
    // Cierre manual
    alert.querySelector('.close-btn').addEventListener('click', () => {
      alert.remove();
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const loadInitialData = () => {
    // Cargar saldo desde localStorage
    const savedBalance = localStorage.getItem('userBalance');
    const balanceDisplay = document.getElementById("saldoActual");
    if (balanceDisplay && savedBalance) {
      balanceDisplay.textContent = savedBalance;
    }
    
    // Mostrar mensaje de inicio
    console.log(`${CONFIG.appName} - Sistema inicializado`);
    showAlert(`Bienvenido a ${CONFIG.appName}`, "info");
  };

  // ======================
  // INICIALIZACIÓN
  // ======================
  setupBalanceRecharge();
  setupIntercityTrips();
  setupCargoTransport();
  setupExcursions();
  loadInitialData();
});
