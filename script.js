// Tu configuración de Firebase
// ¡IMPORTANTE! Reemplaza los valores con los de tu proyecto.
// Puedes encontrarlos en la consola de Firebase > Configuración del proyecto > Tus apps > Web
const firebaseConfig = {
    apiKey: "TU_API_KEY", // <--- ¡Reemplaza esto!
    authDomain: "esp32-calidad-del-aire.firebaseapp.com",
    databaseURL: "https://esp32-calidad-del-aire-default-rtdb.firebaseio.com",
    projectId: "esp32-calidad-del-aire",
    storageBucket: "esp32-calidad-del-aire.appspot.com", // <--- ¡Reemplaza esto si es diferente!
    messagingSenderId: "TU_MESSAGING_SENDER_ID", // <--- ¡Reemplaza esto!
    appId: "TU_APP_ID" // <--- ¡Reemplaza esto!
  };
  
  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Obtén una referencia a la Realtime Database
  const database = firebase.database();
  
  // Obtén una referencia al nodo de datos que quieres monitorear
  // Por ejemplo, asumimos que tienes un valor en "airQuality/currentValue"
  // Si tus datos están en otra ruta, ¡ajusta esta línea!
  const airQualityRef = database.ref('airQuality/currentValue'); // <--- ¡Ajusta esta ruta si es necesario!
  
  // Elementos HTML donde mostraremos los datos
  const airQualityValueElement = document.getElementById('airQualityValue');
  const lastUpdatedElement = document.getElementById('lastUpdated');
  
  // Escucha los cambios en los datos en tiempo real
  airQualityRef.on('value', (snapshot) => {
      const data = snapshot.val(); // Obtiene el valor de los datos
      if (data !== null) {
          airQualityValueElement.textContent = data; // Actualiza el texto con el nuevo valor
          const now = new Date();
          lastUpdatedElement.textContent = now.toLocaleString(); // Muestra la hora de la última actualización
          console.log("Nuevo valor de calidad del aire:", data);
      } else {
          airQualityValueElement.textContent = 'No hay datos disponibles';
          lastUpdatedElement.textContent = '';
          console.log("No hay datos en la ruta airQuality/currentValue");
      }
  }, (error) => {
      console.error("Error al leer datos:", error);
      airQualityValueElement.textContent = 'Error al cargar datos';
      lastUpdatedElement.textContent = '';
  });
  
  // Para probar: Puedes ir a tu Realtime Database en la consola de Firebase
  // y manualmente añadir un nodo 'airQuality/currentValue' con un número (ej. 75).
  // Verás cómo la página se actualiza automáticamente.
  