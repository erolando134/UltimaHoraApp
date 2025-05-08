document.addEventListener("DOMContentLoaded", function () {
  // Recarga de saldo
  const formRecarga = document.getElementById("formRecarga");
  const saldoActual = document.getElementById("saldoActual");

  if (formRecarga && saldoActual) {
    formRecarga.addEventListener("submit", function (e) {
      e.preventDefault();
      const monto = parseInt(document.getElementById("montoRecarga").value);
      let saldo = parseInt(saldoActual.textContent);
      saldo += monto;
      saldoActual.textContent = saldo;
      formRecarga.reset();
    });
  }

  // Formulario Interprovincial
  const formInterprovincial = document.getElementById("formInterprovincial");
  const historialInterprovincial = document.getElementById("historialInterprovincial");

  if (formInterprovincial && historialInterprovincial) {
    formInterprovincial.addEventListener("submit", function (e) {
      e.preventDefault();
      const origen = document.getElementById("origen").value;
      const destino = document.getElementById("destino").value;
      const salida = document.getElementById("salida").value;
      const llegada = document.getElementById("llegada").value;
      const precio = document.getElementById("precio").value;

      const li = document.createElement("li");
      li.textContent = `De ${origen} a ${destino}, salida: ${salida}, llegada estimada: ${llegada}, precio: ${precio} CUP`;
      historialInterprovincial.appendChild(li);
      formInterprovincial.reset();
    });
  }

  // Formulario de Carga
  const formCarga = document.getElementById("formCarga");
  const historialCarga = document.getElementById("historialCarga");

  if (formCarga && historialCarga) {
    formCarga.addEventListener("submit", function (e) {
      e.preventDefault();
      const origenCarga = document.getElementById("origenCarga").value;
      const destinoCarga = document.getElementById("destinoCarga").value;
      const fechaCarga = document.getElementById("fechaCarga").value;
      const tipoCarga = document.getElementById("tipoCarga").value;
      const precioCarga = document.getElementById("precioCarga").value;

      const li = document.createElement("li");
      li.textContent = `Carga: ${tipoCarga}, de ${origenCarga} a ${destinoCarga}, fecha: ${fechaCarga}, precio: ${precioCarga} CUP`;
      historialCarga.appendChild(li);
      formCarga.reset();
    });
  }

  // Formulario de Excursiones
  const formExcursion = document.getElementById("formExcursion");
  const historialExcursion = document.getElementById("historialExcursion");

  if (formExcursion && historialExcursion) {
    formExcursion.addEventListener("submit", function (e) {
      e.preventDefault();
      const destino = document.getElementById("destinoExcursion").value;
      const fecha = document.getElementById("fechaExcursion").value;
      const hora = document.getElementById("horaExcursion").value;
      const precio = document.getElementById("precioExcursion").value;

      const li = document.createElement("li");
      li.textContent = `Excursión a ${destino} el ${fecha} a las ${hora}, precio por persona: ${precio} CUP`;
      historialExcursion.appendChild(li);
      formExcursion.reset();
    });
  }
});
