// Tu configuración de Firebase
import { initializeApp } from "firebase/app";
// ¡IMPORTANTE! Reemplaza los valores con los de tu proyecto.
// Puedes encontrarlos en la consola de Firebase > Configuración del proyecto > Tus apps > Web
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
  
  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Obtén una referencia a la Realtime Database
  const database = firebase.database();
  // RUTA EXACTA PARA EL VALOR pm2_5
// Usa tu ID único (FKXFzztAxHhBSzN0ItQX06fDAku1) y el campo 'pm2_5'
const airQualityRef = database.ref('UsersData/FKXFzztAxHhBSzN0ItQX06fDAku1/Datos/pm2_5');

// Elementos HTML donde mostraremos los datos
const airQualityValueElement = document.getElementById('airQualityValue');
const lastUpdatedElement = document.getElementById('lastUpdated');

// Escucha los cambios en los datos en tiempo real
airQualityRef.on('value', (snapshot) => {
    const data = snapshot.val(); // Obtiene el valor de 'pm2_5'
    if (data !== null) {
        airQualityValueElement.textContent = data; // Actualiza el texto con el nuevo valor de pm2_5
        const now = new Date();
        lastUpdatedElement.textContent = now.toLocaleString(); // Muestra la hora de la última actualización
        console.log("Nuevo valor de PM2.5:", data);
    } else {
        airQualityValueElement.textContent = 'No hay datos disponibles para PM2.5';
        lastUpdatedElement.textContent = '';
        console.log("No hay datos en la ruta UsersData/FKXFzztAxHhBSzN0ItQX06fDAku1/Datos/pm2_5");
    }
}, (error) => {
    console.error("Error al leer datos:", error);
    airQualityValueElement.textContent = 'Error al cargar datos';
    lastUpdatedElement.textContent = '';
});

// ¡Recuerda!
// Para mostrar otros valores como CO2, PM10, etc., necesitarías:
// 1. Añadir más <span> u otros elementos en tu index.html con IDs únicos (ej. id="co2Value").
// 2. Crear más referencias en script.js (ej. const co2Ref = database.ref('UsersData/FKXFzztAxHhBSzN0ItQX06fDAku1/Datos/co2_mhz19');).
// 3. Crear más oyentes (co2Ref.on('value', ...)) para cada uno.
