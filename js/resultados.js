const db = firebase.firestore();
const listaContenedor = document.getElementById("lista-resultados");

function mostrarResultados() {
  // Escuchamos la colección de partidos
  db.collection("partidos")
    .orderBy("fecha", "desc")
    .onSnapshot((querySnapshot) => {
      listaContenedor.innerHTML = ""; // Limpiamos el cargando...

      if (querySnapshot.empty) {
        listaContenedor.innerHTML =
          '<p class="text-center text-gray-400 italic">Aún no hay partidos registrados.</p>';
        return;
      }

      querySnapshot.forEach((doc) => {
        const p = doc.data();

        // Formateamos la fecha para que se vea como en tu diseño
        const fechaObj = new Date(p.fecha + "T00:00:00");
        const opciones = {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        };
        const fechaLegible = fechaObj.toLocaleDateString("es-ES", opciones);

        // Inyectamos la tarjeta con los datos de Firestore
        listaContenedor.innerHTML += `
                <div class="bg-white rounded-xl shadow-md border-l-8 border-[#006633] overflow-hidden transition-transform hover:scale-[1.01]">
                    <div class="grid grid-cols-1 md:grid-cols-3 items-center p-8">
                        <div class="flex flex-col items-center space-y-3">
                            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-[#006633]">AL</div>
                            <span class="font-black text-lg text-center uppercase">CD Los Almendros</span>
                        </div>

                        <div class="flex flex-col items-center py-6 md:py-0">
                            <span class="text-xs font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">Finalizado</span>
                            <div class="flex items-center space-x-6">
                                <span class="text-5xl font-black bg-black text-white w-16 h-20 flex items-center justify-center rounded-lg shadow-inner">${p.golesAlmendros}</span>
                                <span class="text-3xl font-bold text-gray-300">-</span>
                                <span class="text-5xl font-black bg-gray-200 text-black w-16 h-20 flex items-center justify-center rounded-lg shadow-inner">${p.golesRival}</span>
                            </div>
                            <span class="mt-4 text-sm font-semibold text-[#006633] uppercase">${fechaLegible}</span>
                        </div>

                        <div class="flex flex-col items-center space-y-3">
                            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-gray-300 text-gray-400 italic">RV</div>
                            <span class="font-black text-lg text-center uppercase text-gray-600">${p.rival}</span>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-8 py-3 flex justify-between items-center border-t border-gray-100">
                        <span class="text-xs text-gray-400 font-bold uppercase">
                            <i class="fa-solid fa-location-dot mr-1"></i> Estadio Municipal Riberalta
                        </span>
                        <a href="#" class="text-[#006633] text-xs font-black hover:underline uppercase italic">
                            Ver Crónica <i class="fa-solid fa-chevron-right ml-1"></i>
                        </a>
                    </div>
                </div>
            `;
      });
    });
}

mostrarResultados();
