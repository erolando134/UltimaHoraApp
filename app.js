document.addEventListener("DOMContentLoaded", function () {
  // CONSTANTES GLOBALES
  const APP_NAME = "Última Hora R.M.K.";
  const CUP_SYMBOL = "CUP";
  
  // 1. RECARGA DE SALDO (Con validación mejorada)
  const initRecarga = () => {
    const formRecarga = document.getElementById("formRecarga");
    const saldoActual = document.getElementById("saldoActual");
    const montoInput = document.getElementById("montoRecarga");

    if (formRecarga && saldoActual && montoInput) {
      formRecarga.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const monto = parseInt(montoInput.value);
        if (isNaN(monto) {
          showAlert("⚠️ Ingrese un monto válido", "error");
          return;
        }

        let saldo = parseInt(saldoActual.textContent) || 0;
        saldo += monto;
        saldoActual.textContent = saldo;
        
        showAlert(`✅ Recarga exitosa: +${monto} ${CUP_SYMBOL}`, "success");
        formRecarga.reset();
        
        // Guardar en localStorage
        localStorage.setItem('saldoActual', saldo);
      });
    }
  };

  // 2. FORMULARIO INTERPROVINCIAL (Con template string)
  const initInterprovincial = () => {
    const form = document.getElementById("formInterprovincial");
    const historial = document.getElementById("historialInterprovincial");

    if (form && historial) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const [origen, destino, salida, llegada, precio] = [
          "origen", "destino", "salida", "llegada", "precio"
        ].map(id => document.getElementById(id).value);

        if (!validateTrip(origen, destino, salida, llegada, precio)) return;

        const viaje = `
          <li class="viaje-item">
            <strong>${origen} → ${destino}</strong><br>
            <small>Salida: ${formatDate(salida)}</small><br>
            <small>Llegada: ${formatDate(llegada)}</small><br>
            <span class="precio">${precio} ${CUP_SYMBOL}</span>
          </li>
        `;
        
        historial.insertAdjacentHTML("afterbegin", viaje);
        form.reset();
        showAlert("Viaje interprovincial registrado", "success");
      });
    }
  };

  // 3. FORMULARIO DE CARGA (Con validación de tipo)
  const initCarga = () => {
    const form = document.getElementById("formCarga");
    const historial = document.getElementById("historialCarga");

    if (form && historial) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const [origen, destino, fecha, tipo, precio] = [
          "origenCarga", "destinoCarga", "fechaCarga", "tipoCarga", "precioCarga"
        ].map(id => document.getElementById(id).value);

        if (!validateCargo(tipo, precio)) return;

        const carga = `
          <li class="carga-item">
            <div class="carga-header">
              <span class="tipo-carga ${tipo.toLowerCase()}">${tipo}</span>
              <span class="precio">${precio} ${CUP_SYMBOL}</span>
            </div>
            <div class="carga-ruta">${origen} → ${destino}</div>
            <div class="carga-fecha">${formatDate(fecha)}</div>
          </li>
        `;
        
        historial.insertAdjacentHTML("afterbegin", carga);
        form.reset();
      });
    }
  };

  // 4. FORMULARIO DE EXCURSIONES (Con validación de fecha)
  const initExcursiones = () => {
    const form = document.getElementById("formExcursion");
    const historial = document.getElementById("historialExcursion");

    if (form && historial) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const [destino, fecha, hora, precio] = [
          "destinoExcursion", "fechaExcursion", "horaExcursion", "precioExcursion"
        ].map(id => document.getElementById(id).value);

        if (!validateExcursion(fecha)) return;

        const excursion = `
          <li class="excursion-item">
            <h4>${destino}</h4>
            <div class="excursion-fecha">
              ${formatDate(fecha)} a las ${hora}
            </div>
            <div class="excursion-precio">
              ${precio} ${CUP_SYMBOL} <small>/persona</small>
            </div>
          </li>
        `;
        
        historial.insertAdjacentHTML("afterbegin", excursion);
        form.reset();
      });
    }
  };

  // FUNCIONES DE APOYO
  const showAlert = (message, type) => {
    const alert = document.createElement("div");
    alert.className = `alert ${type}`;
    alert.innerHTML = `
      <p>${message}</p>
      <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const validateTrip = (origen, destino, salida, llegada, precio) => {
    if (!origen || !destino) {
      showAlert("❌ Origen y destino son requeridos", "error");
      return false;
    }
    if (new Date(salida) > new Date(llegada)) {
      showAlert("⚠️ La fecha de llegada debe ser posterior a la salida", "warning");
      return false;
    }
    return true;
  };

  const validateCargo = (tipo, precio) => {
    const tiposValidos = ["Paquete", "Mudanza", "Mercancía", "Otros"];
    if (!tiposValidos.includes(tipo)) {
      showAlert(`Tipo de carga inválido. Use: ${tiposValidos.join(", ")}`, "error");
      return false;
    }
    return true;
  };

  const validateExcursion = (fecha) => {
    if (new Date(fecha) < new Date()) {
      showAlert("⚠️ La fecha de excursión debe ser futura", "warning");
      return false;
    }
    return true;
  };

  // INICIALIZACIÓN
  console.log(`${APP_NAME} - JS cargado correctamente`);
  initRecarga();
  initInterprovincial();
  initCarga();
  initExcursiones();

  // Cargar saldo guardado
  const savedBalance = localStorage.getItem('saldoActual');
  if (savedBalance) {
    const saldoActual = document.getElementById("saldoActual");
    if (saldoActual) saldoActual.textContent = savedBalance;
  }
});
