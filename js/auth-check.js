// ==========================================
// 🎟️ PORTERO PÚBLICO (auth-check.js) - VERSIÓN CON FOTO
// ==========================================

let isCheckingAuth = false;

const authCheck = async (sessionParam = null) => {
  if (isCheckingAuth) return;
  isCheckingAuth = true;

  const loader = document.getElementById("loader-graf");
  const authSection = document.getElementById("auth-section");

  try {
    // 1. Verificamos la sesión
    let session = sessionParam;
    if (!session) {
      const { data } = await _supabase.auth.getSession();
      session = data.session;
    }

    if (session) {
      // 2. Traemos el perfil de la base de datos
      const { data: profile } = await _supabase
        .from("usuarios")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      // Si no existe el perfil, lo mandamos a registrar sus datos
      if (!profile) {
        if (!window.location.pathname.includes("registro-datos.html")) {
          window.location.href = "registro-datos.html";
          return;
        }
      } else {
        // --- 3. LÓGICA DE RANGOS Y NOMBRES ---
        const rol = profile.rol || "socio";
        const nombre = profile.nombre || "Usuario";
        const inicial = nombre.charAt(0).toUpperCase();

        // Variables de diseño por defecto (Para Socios)
        let etiquetaVisual = "SOCIO";
        let colorTexto = "text-green-400";
        let colorBorde = "border-green-400";

        // Cambiamos el diseño si pertenece a la directiva
        if (rol === "super_admin" || rol === "admin" || rol === "editor") {
          colorTexto = "text-yellow-400";
          colorBorde = "border-yellow-400";

          if (rol === "super_admin") etiquetaVisual = "SUPER ADMIN";
          if (rol === "admin") etiquetaVisual = "ADMINISTRADOR";
          if (rol === "editor") etiquetaVisual = "PRENSA OFICIAL";
        }

        const tieneAccesoAlPanel = ["super_admin", "admin", "editor"].includes(
          rol,
        );

        // --- 📸 LÓGICA INTELIGENTE DEL AVATAR ---
        // Si tiene foto guardada, creamos una etiqueta <img>. Si no, dibujamos el círculo con la letra.
        const avatarHTML = profile.avatar_url
          ? `<img src="${profile.avatar_url}" alt="Perfil" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 ${colorBorde} shadow-lg group-hover:scale-105 transition-transform">`
          : `<div class="w-9 h-9 sm:w-10 sm:h-10 bg-white text-green-900 rounded-full flex items-center justify-center font-black border-2 ${colorBorde} shadow-lg group-hover:scale-105 transition-transform">
                ${inicial}
             </div>`;

        // --- 4. DIBUJAMOS EL MENÚ ---
        authSection.innerHTML = `
          <div class="relative group z-[200]">
              <div class="flex items-center space-x-2 sm:space-x-3 cursor-default">
                  <div class="text-right hidden sm:block text-white group-hover:${colorTexto} transition-colors">
                      <p class="text-[9px] font-black ${colorTexto} uppercase italic tracking-tighter">${etiquetaVisual}</p>
                      <p class="text-xs font-black uppercase italic">${nombre.toUpperCase()}</p>
                  </div>
                  
                  ${avatarHTML}
                  
              </div>
              
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border-t-4 border-yellow-500">
                  
                  ${
                    tieneAccesoAlPanel
                      ? `
                    <a href="admin/admin.html" class="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-black italic uppercase">
                       <i class="fa-solid fa-shield-halved mr-1"></i> IR AL PANEL
                    </a>
                  `
                      : ""
                  }
                  
                  <a href="perfil.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-black italic uppercase">
                      <i class="fa-solid fa-user mr-1"></i> MI PERFIL
                  </a>
                  
                  <hr class="my-1 border-gray-100">
                  <button onclick="cerrarSesion()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-black uppercase">
                      <i class="fa-solid fa-right-from-bracket mr-1"></i> CERRAR SESIÓN
                  </button>
              </div>
          </div>
        `;
      }
    } else {
      // --- 5. USUARIO DESCONECTADO ---
      authSection.innerHTML = `
        <a href="login.html" class="bg-white text-green-900 px-6 py-2 rounded-full font-bold uppercase text-xs shadow-xl transition hover:scale-105">
            Iniciar Sesión
        </a>
      `;
    }
  } catch (err) {
    console.error("Error crítico en auth-check:", err);
  } finally {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.classList.add("hidden"), 500);
    }
    isCheckingAuth = false;
  }
};

async function cerrarSesion() {
  await _supabase.auth.signOut();
  window.location.reload();
}

_supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    authCheck(session);
  }
});

authCheck();
