const db = firebase.firestore();
const auth = firebase.auth();

// 1. Verificamos la sesión apenas carga la página
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("✅ Sesión detectada:", user.email);
    console.log("🆔 Tu UID es:", user.uid);
  } else {
    console.warn("❌ NO HAY SESIÓN. Por eso falla.");
    alert("Tu sesión expiró. Por favor, inicia sesión de nuevo.");
    window.location.href = "login.html";
  }
});

document.getElementById("partidoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 2. Extraer el usuario actual justo antes de enviar
  const user = auth.currentUser;

  if (!user) {
    alert("Error: No se detectó tu cuenta. Inicia sesión de nuevo.");
    return;
  }

  const partido = {
    rival: document.getElementById("rival").value,
    fecha: document.getElementById("fechaPartido").value,
    golesAlmendros: parseInt(document.getElementById("golesAlmendros").value),
    golesRival: parseInt(document.getElementById("golesRival").value),
    fechaPublicacion: new Date(),
    autor: user.uid, // Guardamos quién lo subió para asegurar el permiso
  };

  try {
    console.log("🚀 Intentando subir con el UID:", user.uid);
    await db.collection("partidos").add(partido);
    alert("Resultado guardado con exito!✅");
    document.getElementById("partidoForm").reset();
  } catch (error) {
    console.error("❌ ERROR DETALLADO:", error.code, error.message);
    alert("ERROR : No se pudo agregar resultado " + error.message);
  }
});
