console.log("script.js cargado");

// Configuración Firebase (tomada de tu consola)
const firebaseConfig = {
    apiKey: "AIzaSyCThv9QJYl45ANIip2xEZDVj9_u6-wD7rk",
    authDomain: "esp32-calidad-del-aire.firebaseapp.com",
    databaseURL: "https://esp32-calidad-del-aire-default-rtdb.firebaseio.com",
    projectId: "esp32-calidad-del-aire",
    storageBucket: "esp32-calidad-del-aire.firebasestorage.app",
    messagingSenderId: "655592670447",
    appId: "1:655592670447:web:4f398660db64d8e970871a",
    measurementId: "G-0JX7KMEEC4"
  };
  

  
  // 🔹 2. Inicializa Firebase (SDK compat)
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // 🔹 3. DEBUG: ver qué ve la web en cada nivel
  database.ref().once("value", (snap) => {
    console.log("ROOT:", snap.val());
  });
  
  database.ref("UsersData").once("value", (snap) => {
    console.log("UsersData:", snap.val());
  });
  
  database
    .ref("UsersData/FKXFzztAxHHBsZN0ItQX06fDAku1")
    .once("value", (snap) => {
      console.log("Nodo usuario:", snap.val());
    });
  
  database
    .ref("UsersData/FKXFzztAxHHBsZN0ItQX06fDAku1/Datos")
    .once("value", (snap) => {
      console.log("Nodo Datos:", snap.val());
    });
  
  // 🔹 4. Listener en tiempo real SOLO para probar
  const datosRef = database.ref(
    "UsersData/FKXFzztAxHHBsZN0ItQX06fDAku1/Datos"
  );
  
  datosRef.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("Datos recibidos:", data);
  });
  