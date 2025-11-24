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

// Inicializa Firebase (SDK compat, el que cargas en el HTML)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Captura de elementos HTML (valores numéricos)
const co2Mhz19Element    = document.getElementById("co2Mhz19Value");
const co2Mq135Element    = document.getElementById("co2Mq135Value");
const pm1Element         = document.getElementById("pm1_0Value");
const pm25Element        = document.getElementById("pm2_5Value");
const pm10Element        = document.getElementById("pm10Value");
const tempElement        = document.getElementById("tempMhz19Value");
const luxElement         = document.getElementById("luxValue");
const whiteLightElement  = document.getElementById("whiteLightValue");
const lastUpdatedElement = document.getElementById("lastUpdated");

// ---------- CONFIGURACIÓN DE GRÁFICAS EN TIEMPO REAL ----------

// Máximo de puntos a mostrar en las gráficas
const MAX_POINTS = 20;

// Arrays compartidos de etiquetas (tiempo) y datos
const timeLabels = [];
const co2Series  = [];
const pm25Series = [];

// Contextos de los canvas
const co2Ctx  = document.getElementById("co2Chart").getContext("2d");
const pm25Ctx = document.getElementById("pm25Chart").getContext("2d");

// Gráfica de CO2 (MHZ19)
const co2Chart = new Chart(co2Ctx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "CO₂ MHZ19 (ppm)",
        data: co2Series,
        borderColor: "rgba(52, 152, 219, 1)",
        backgroundColor: "rgba(52, 152, 219, 0.15)",
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Tiempo" }
      },
      y: {
        title: { display: true, text: "ppm" },
        beginAtZero: true
      }
    }
  }
});

// Gráfica de PM2.5
const pm25Chart = new Chart(pm25Ctx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "PM2.5 (µg/m³)",
        data: pm25Series,
        borderColor: "rgba(231, 76, 60, 1)",
        backgroundColor: "rgba(231, 76, 60, 0.15)",
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Tiempo" }
      },
      y: {
        title: { display: true, text: "µg/m³" },
        beginAtZero: true
      }
    }
  }
});

// Función auxiliar para añadir un nuevo punto a las series
function addRealtimePoint(co2Value, pm25Value) {
  const nowLabel = new Date().toLocaleTimeString();

  // Añadimos nueva etiqueta de tiempo
  timeLabels.push(nowLabel);

  // Añadimos datos (si vienen definidos)
  co2Series.push(co2Value != null ? co2Value : null);
  pm25Series.push(pm25Value != null ? pm25Value : null);

  // Si nos pasamos del máximo, eliminamos el más antiguo
  if (timeLabels.length > MAX_POINTS) {
    timeLabels.shift();
    co2Series.shift();
    pm25Series.shift();
  }

  // Actualizamos ambas gráficas
  co2Chart.update();
  pm25Chart.update();
}

// ---------- LECTURA DE DATOS DESDE REALTIME DATABASE ----------

// Primero leemos UsersData para obtener un ID válido
const usersDataRef = database.ref("UsersData");

usersDataRef.once(
  "value",
  (snap) => {
    const usersData = snap.val();
    console.log("UsersData:", usersData);

    if (!usersData) {
      console.log("No hay datos en UsersData");
      return;
    }

    // Tomamos el primer ID disponible
    const userIds = Object.keys(usersData);
    const firstId = userIds[0];
    console.log("Usando userId:", firstId);

    // Referencia al nodo Datos de ese ID
    const datosRef = database.ref(`UsersData/${firstId}/Datos`);

    // Listener en tiempo real
    datosRef.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log("Datos recibidos:", data);

      if (!data) {
        console.log("Nodo Datos vacío");
        return;
      }

      // Actualizamos los spans de texto
      if (data.co2_mhz19  !== undefined) co2Mhz19Element.textContent   = data.co2_mhz19;
      if (data.co2_mq135  !== undefined) co2Mq135Element.textContent   = data.co2_mq135;
      if (data.pm1_0      !== undefined) pm1Element.textContent        = data.pm1_0;
      if (data.pm2_5      !== undefined) pm25Element.textContent       = data.pm2_5;
      if (data.pm10       !== undefined) pm10Element.textContent       = data.pm10;
      if (data.temp_mhz19 !== undefined) tempElement.textContent       = data.temp_mhz19;
      if (data.lux        !== undefined) luxElement.textContent        = data.lux;
      if (data.white_light !== undefined) whiteLightElement.textContent = data.white_light;

      lastUpdatedElement.textContent = new Date().toLocaleString();

      // Añadimos el nuevo punto a las gráficas
      const co2Value  = data.co2_mhz19 ?? null;
      const pm25Value = data.pm2_5 ?? null;
      addRealtimePoint(co2Value, pm25Value);
    });
  },
  (error) => {
    console.error("Error leyendo UsersData:", error);
  }
);
