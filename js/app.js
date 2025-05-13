document.addEventListener("DOMContentLoaded", function () {
  // ======================
  // CONFIGURACIÓN INICIAL (Actualizada)
  // ======================
  const CONFIG = {
    appName: "Última Hora R.M.K.",
    currency: "CUP",
    currencyOptions: {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    },
    minDeposit: 100,
    commissionRates: {
      urban: 0.10,
      intercity: 0.20,
      cargo: 0.20,
      excursions: 0.20,
      eventual: 0.15 // Nueva tasa comisión
    }
  };

  // [Mantener módulos existentes...]

  // ======================
  // 5. SERVICIOS EVENTUALES (Nuevo módulo)
  // ======================
  const setupEventualServices = () => {
    const form = document.getElementById("formEventual");
    const historyList = document.getElementById("historialEventual");

    if (!form || !historyList) return;

    const formatCurrency = (amount) => {
      return amount.toLocaleString('es-CU', CONFIG.currencyOptions);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const serviceData = {
        nombre: document.getElementById("nombreCompleto").value.trim(),
        telefono: document.getElementById("telefono").value,
        tipo: document.getElementById("tipoServicio").value,
        horas: document.getElementById("horasDisponibles").value,
        fecha: new Date().toISOString()
      };

      // Validaciones
      if (!serviceData.tipo || serviceData.horas < 4) {
        showAlert("❌ Complete todos los campos requeridos", "error");
        return;
      }

      // Calcular comisión (ejemplo)
      const comision = 500 * CONFIG.commissionRates.eventual;
      
      // Crear elemento de registro
      const serviceItem = document.createElement("li");
      serviceItem.className = "eventual-item";
      serviceItem.innerHTML = `
        <div class="eventual-header">
          <span class="service-type">${serviceData.tipo}</span>
          <span class="service-hours">${serviceData.horas} horas</span>
        </div>
        <div class="eventual-details">
          <span>${formatDate(serviceData.fecha)}</span>
          <span class="price">Depósito: ${formatCurrency(500)}</span>
        </div>
        <div class="eventual-status">
          <span class="commission">Comisión: ${formatCurrency(comision)}</span>
          <span class="status pending">⏳ En revisión</span>
        </div>
      `;

      historyList.prepend(serviceItem);
      form.reset();
      showAlert("✅ Registro eventual enviado para aprobación", "success");
    });
  };

  // ======================
  // INICIALIZACIÓN (Actualizada)
  // ======================
  setupBalanceRecharge();
  setupIntercityTrips();
  setupCargoTransport();
  setupExcursions();
  setupEventualServices(); // Nueva inicialización
  loadInitialData();
});
