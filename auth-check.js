const authCheck = async () => {
  const loader = document.getElementById("loader-graf");
  const authSection = document.getElementById("auth-section");

  try {
    const {
      data: { session },
    } = await _supabase.auth.getSession();

    if (session) {
      const { data: profile } = await _supabase
        .from("usuarios")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profile) {
        if (!window.location.pathname.includes("registro-datos.html")) {
          window.location.href = "registro-datos.html";
          return;
        }
      }

      // --- ESCENARIO B: ADMINISTRADOR ---
      // --- ESCENARIO B: ADMINISTRADOR (MODIFICADO) ---
      // --- ESCENARIO B: ADMINISTRADOR (RESPONSIVO) ---
      else if (profile.rol === "admin") {
        const nombre = profile.nombre || "Admin";
        authSection.innerHTML = `
      <div class="relative group">
          <div class="flex items-center space-x-2 sm:space-x-3 cursor-default">
              <div class="text-right hidden sm:block text-white">
                  <p class="text-[9px] font-black text-yellow-400 uppercase italic tracking-tighter">PRESIDENTE</p>
                  <p class="text-xs font-black uppercase italic">${nombre.toUpperCase()}</p>
              </div>
              <div class="w-9 h-9 sm:w-10 sm:h-10 bg-white text-green-900 rounded-full flex items-center justify-center font-black border-2 border-yellow-400 shadow-lg">
                  ${nombre.charAt(0).toUpperCase()}
              </div>
          </div>
          
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[200] border-t-4 border-yellow-500">
              <a href="admin.html" class="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-black italic uppercase">IR AL PANEL</a>
              <hr class="my-1 border-gray-100">
              <button onclick="cerrarSesion()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-black uppercase">Cerrar Sesión</button>
          </div>
      </div>
  `;
      }

      // --- ESCENARIO C: SOCIO (RESPONSIVO) ---
      else {
        const nombre = profile.nombre || "Socio";
        authSection.innerHTML = `
      <a href="perfil.html" class="flex items-center space-x-2 sm:space-x-3 group">
          <div class="text-right hidden sm:block text-white group-hover:text-green-400 transition">
              <p class="text-[9px] font-black text-green-400 uppercase tracking-tighter">SOCIO</p>
              <p class="text-xs font-black uppercase italic">${nombre.toUpperCase()}</p>
          </div>
          <div class="w-9 h-9 sm:w-10 sm:h-10 bg-white text-green-900 rounded-full flex items-center justify-center font-black border-2 border-green-400 shadow-lg group-hover:scale-105 transition-transform">
              ${nombre.charAt(0).toUpperCase()}
          </div>
      </a>
  `;
      }
    } else {
      authSection.innerHTML = `
                <a href="login.html" class="bg-white text-green-900 px-6 py-2 rounded-full font-bold uppercase text-xs shadow-xl transition hover:scale-105">
                    Iniciar Sesión
                </a>
            `;
    }
  } catch (err) {
    console.error("Error crítico:", err);
  } finally {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.classList.add("hidden"), 500);
    }
  }
};

// Mantenemos la función cerrarSesion abajo por si la llamas desde perfil.html
async function cerrarSesion() {
  await _supabase.auth.signOut();
  window.location.href = "index.html";
}

authCheck();
