// Configuración de Firebase (Copia tus datos reales desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDP7KQjee6HR7PHBQvsCOeAce4Gpa4G8aA",
  authDomain: "almendrosweb.firebaseapp.com",
  projectId: "almendrosweb",
  storageBucket: "almendrosweb.firebasestorage.app",
  messagingSenderId: "551968328995",
  appId: "1:551968328995:web:9d65a62fc3371424b15096",
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Proveedores de Autenticación
const googleProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();

// Función de Inicio de Sesión con Correo (Estilo Barça)
function iniciarSesion(email, password) {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      verificarRol(userCredential.user);
    })
    .catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
}

// Función para Google
function ingresarConGoogle() {
  auth
    .signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      const isNewUser = result.additionalUserInfo.isNewUser;

      if (isNewUser) {
        // ES NUEVO: Lo mandamos a que ponga su nombre y fecha de nacimiento
        window.location.href = "registro-datos.html";
      } else {
        // YA EXISTE: Verificamos si es admin o fan normal
        verificarRol(user);
      }
    })
    .catch((error) => {
      console.error("Error Google:", error.message);
    });
}

// Función para Facebook
function ingresarConFacebook() {
  auth
    .signInWithPopup(fbProvider)
    .then((result) => {
      const user = result.user;

      // Verificamos si es la primera vez que entra
      const isNewUser = result.additionalUserInfo.isNewUser;

      if (isNewUser) {
        // USUARIO NUEVO: Mandar a completar nombre y fecha de nacimiento
        window.location.href = "registro-datos.html";
      } else {
        // USUARIO ANTIGUO: Verificar si es Admin o Fan
        verificarRol(user);
      }
    })
    .catch((error) => {
      console.error("Error al entrar con Facebook:", error.message);
      // Si hay error de cuenta duplicada (mismo correo en Google y FB), Firebase avisará aquí
      if (error.code === "auth/account-exists-with-different-credential") {
        alert(
          "Ya existe una cuenta con este correo vinculada a otro método de acceso.",
        );
      }
    });
}

// Función Centralizada de Verificación de Roles
function verificarRol(user) {
  db.collection("usuarios")
    .doc(user.uid)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().rol === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error al verificar rol:", error);
      window.location.href = "index.html";
    });
}
