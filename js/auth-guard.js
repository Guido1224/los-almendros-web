// =========================================================
// 🛡️ GUARDIA DE SEGURIDAD CENTRAL - MANDO PRESIDENCIAL
// =========================================================
console.log("👮‍♂️ Guardia Central: Patrullando el área...");

async function guardiaDeSeguridad() {
  try {
    // 1. Verificamos la sesión en la bóveda
    const {
      data: { session },
      error: authError,
    } = await _supabase.auth.getSession();

    if (authError || !session) {
      alert("🛑 IDENTIFICACIÓN REQUERIDA: No tienes sesión activa.");
      window.location.replace("../login.html");
      return;
    }

    // 2. Traemos el rango (usamos maybeSingle para que NO explote si el usuario es nuevo)
    const { data: perfil, error: dbError } = await _supabase
      .from("usuarios")
      .select("rol")
      .eq("id", session.user.id)
      .maybeSingle();

    if (dbError) throw dbError;

    // Confiamos ciegamente en el rol que venga de la base de datos
    const rol = perfil?.rol || "socio";
    const paginaActual = window.location.pathname.toLowerCase();

    console.log(
      `👤 Usuario: ${session.user.email} | Rango: ${rol} | Intentando entrar a: ${paginaActual}`,
    );

    // ==========================================
    // 🚦 REGLAS DE ACCESO ESTRICTAS
    // ==========================================

    if (rol === "socio") {
      alert(
        "🛑 ACCESO DENEGADO: Tu credencial de 'Socio' no tiene permisos administrativos.",
      );
      window.location.replace("../index.html");
      return;
    }

    if (rol === "super_admin") {
      revelarPantalla(); // Luz verde total
      return;
    }

    if (rol === "admin") {
      if (paginaActual.includes("permisos-admin.html")) {
        alert(
          "🛑 ÁREA CLASIFICADA: Solo el Super Admin puede otorgar permisos.",
        );
        window.location.replace("admin.html");
        return;
      }
      revelarPantalla(); // Luz verde parcial
      return;
    }

    if (rol === "editor") {
      const zonasPermitidas = ["admin.html", "noticias.html", "historia.html"];
      const tienePermiso = zonasPermitidas.some((zona) =>
        paginaActual.includes(zona),
      );

      if (!tienePermiso) {
        alert(
          "🛑 CREDENCIAL INVÁLIDA: El Editor de Prensa no puede acceder a este módulo.",
        );
        window.location.replace("admin.html");
        return;
      }
      revelarPantalla(); // Luz verde parcial
      return;
    }

    // Si ocurre un error raro con los roles, lo sacamos por seguridad
    window.location.replace("../index.html");
  } catch (err) {
    console.error("🔥 Error crítico de seguridad:", err);
    window.location.replace("../index.html");
  }
}

// 💡 FUNCIÓN DE INVISIBILIDAD: Solo muestra la página si el guardia lo ordena
function revelarPantalla() {
  const cuerpo = document.getElementById("cuerpo-protegido");
  if (cuerpo) {
    cuerpo.classList.remove("opacity-0");
  }
}

// Ejecutar el guardia al instante
guardiaDeSeguridad();
