const db = firebase.firestore();
const auth = firebase.auth();

// Seguridad: Si no está logueado, fuera
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

document.getElementById("jugadorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = e.target.querySelector("button");
  btn.disabled = true;
  btn.innerText = "REGISTRANDO...";

  const jugador = {
    nombre: document.getElementById("nombreJugador").value,
    dorsal: parseInt(document.getElementById("dorsal").value),
    posicion: document.getElementById("posicion").value,
    fechaAlta: new Date(),
    registradoPor: auth.currentUser.uid,
  };

  try {
    await db.collection("jugadores").add(jugador);
    alert("✅ Jugador registrado exitosamente.");
    document.getElementById("jugadorForm").reset();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al registrar: " + error.message);
  } finally {
    btn.disabled = false;
    btn.innerText = "REGISTRAR EN EL SISTEMA";
  }
});
