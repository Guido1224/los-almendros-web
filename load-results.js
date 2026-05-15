const db = firebase.firestore();

function cargarUltimoResultado() {
  // Traemos el partido con la 'fechaPublicacion' más reciente
  db.collection("partidos")
    .orderBy("fechaPublicacion", "desc")
    .limit(1)
    .onSnapshot((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const partido = doc.data();

          // Inyectamos los datos en los IDs que acabamos de crear en el HTML
          document.getElementById("score-almendros").innerText =
            partido.golesAlmendros;
          document.getElementById("score-rival").innerText = partido.golesRival;
          document.getElementById("nombre-rival").innerText = partido.rival;

          // Formateo de fecha pro
          const fechaObj = new Date(partido.fecha + "T00:00:00");
          const opciones = { day: "numeric", month: "long", year: "numeric" };
          document.getElementById("fecha-marcador").innerText =
            fechaObj.toLocaleDateString("es-ES", opciones);
        });
      } else {
        document.getElementById("fecha-marcador").innerText =
          "No hay partidos registrados";
      }
    });
}

cargarUltimoResultado();
