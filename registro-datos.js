// 1. Configuración de la conexión (Asegúrate que estos datos sean los tuyos)
const SUPABASE_URL = "https://oiqxotvntoohugsrutwu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXhvdHZudG9vaHVnc3J1dHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTA0OTMsImV4cCI6MjA5MTcyNjQ5M30.5GF32foP17OtbSFsjVX3T_yPaHm7sZPVbZUcBWT9C0I";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const btnFinalizar = document.querySelector('button[type="submit"]');

// 2. Control visual del botón
async function checkSession() {
  const {
    data: { session },
  } = await _supabase.auth.getSession();
  if (session) {
    btnFinalizar.disabled = false;
    btnFinalizar.innerText = "FINALIZAR REGISTRO";
  } else {
    btnFinalizar.disabled = true;
    btnFinalizar.innerText = "ESPERANDO SESIÓN...";
    // Si no hay sesión, lo mandamos al login
    window.location.href = "login.html";
  }
}
checkSession();

// 3. Proceso de guardado
document
  .getElementById("registroForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await _supabase.auth.getSession();
    if (!session) return alert("No hay sesión activa");

    // Estado "Trabajando"
    btnFinalizar.innerText = "GUARDANDO...";
    btnFinalizar.disabled = true;

    // IMPORTANTE: Los nombres de la izquierda deben ser IGUALES a tus columnas en Supabase
    const datos = {
      id: session.user.id,
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      fecha_nacimiento: document.getElementById("fechaNac").value, // Nombre exacto de la columna
      sexo: document.getElementById("sexo").value,
      pais: document.getElementById("pais").value,
      email: session.user.email,
      rol: "socio", // O "fan" si prefieres
    };

    try {
      // Guardamos en la tabla 'usuarios'
      const { error } = await _supabase.from("usuarios").insert([datos]);

      if (error) throw error;

      console.log("¡Datos guardados con éxito!");

      // REDIRECCIÓN AL INDEX
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error de Supabase:", error.message);
      btnFinalizar.disabled = false;
      btnFinalizar.innerText = "REINTENTAR REGISTRO";
      alert("Error al registrar: " + error.message);
    }
  });
