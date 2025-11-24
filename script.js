console.log("script.js cargado");

// ---------------------------
// CONFIGURACIÓN FIREBASE
// ---------------------------
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ---------------------------
//    CAPTURA DE ELEMENTOS
// ---------------------------
const co2Mhz19Element = document.getElementById("co2Mhz19Value");
const co2Mq135Element = document.getElementById("co2Mq135Value");
const pm1Element = document.getElementById("pm1_0Value");
const pm25Element = document.getElementById("pm2_5Value");
const pm10Element = document.getElementById("pm10Value");
const tempElement = document.getElementById("tempMhz19Value");
const luxElement = document.getElementById("luxValue");
const whiteLightElement = document.getElementById("whiteLightValue");
const lastUpdatedElement = document.getElementById("lastUpdated");

// ---------------------------
//    GRÁFICAS EN TIEMPO REAL
// ---------------------------
const MAX_POINTS = 20;

const timeLabels = [];

const co2mhzSeries = [];
const co2mqSeries = [];

const pm1Series = [];
const pm25Series = [];
const pm10Series = [];

const tempSeries = [];
const luxSeries = [];
const whiteLightSeries = [];

// === Obtener los canvas del HTML ===
const co2Ctx = document.getElementById("co2Chart").getContext("2d");
const pmCtx = document.getElementById("pmChart").getContext("2d");
const envCtx = document.getElementById("envChart").getContext("2d");

// === GRÁFICA DE CO₂ ===
const co2Chart = new Chart(co2Ctx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "CO₂ MHZ19 (ppm)",
        data: co2mhzSeries,
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.2)",
        pointRadius: 2,
        tension: 0.25
      },
      {
        label: "CO₂ MQ135 (ppm)",
        data: co2mqSeries,
        borderColor: "#29ff94",
        backgroundColor: "rgba(41,255,148,0.2)",
        pointRadius: 2,
        tension: 0.25
      }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false }
});

// === GRÁFICA PM (1.0 / 2.5 / 10) ===
const pmChart = new Chart(pmCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "PM1.0",
        data: pm1Series,
        borderColor: "#ff6bcb",
        backgroundColor: "rgba(255,107,203,0.25)",
        pointRadius: 2,
        tension: 0.25
      },
      {
        label: "PM2.5",
        data: pm25Series,
        borderColor: "#ffd166",
        backgroundColor: "rgba(255,209,102,0.25)",
        pointRadius: 2,
        tension: 0.25
      },
      {
        label: "PM10",
        data: pm10Series,
        borderColor: "#8ab4f8",
        backgroundColor: "rgba(138,180,248,0.25)",
        pointRadius: 2,
        tension: 0.25
      }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false }
});

// === GRÁFICA DE TEMPERATURA / LUX / LUZ BLANCA ===
const envChart = new Chart(envCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "Temp (°C)",
        data: tempSeries,
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.2)",
        tension: 0.25,
        pointRadius: 2
      },
      {
        label: "Lux",
        data: luxSeries,
        borderColor: "#ffd166",
        backgroundColor: "rgba(255,209,102,0.25)",
        tension: 0.25,
        pointRadius: 2
      },
      {
        label: "Luz Blanca",
        data: whiteLightSeries,
        borderColor: "#29ff94",
        backgroundColor: "rgba(41,255,148,0.25)",
        tension: 0.25,
        pointRadius: 2
      }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false }
});

// ---------------------------------------
// FUNCIÓN PARA AÑADIR PUNTOS A LAS SERIES
// ---------------------------------------
function addPoint(data) {
  const label = new Date().toLocaleTimeString();
  timeLabels.push(label);

  co2mhzSeries.push(data.co2_mhz19 ?? null);
  co2mqSeries.push(data.co2_mq135 ?? null);

  pm1Series.push(data.pm1_0 ?? null);
  pm25Series.push(data.pm2_5 ?? null);
  pm10Series.push(data.pm10 ?? null);

  tempSeries.push(data.temp_mhz19 ?? null);
  luxSeries.push(data.lux ?? null);
  whiteLightSeries.push(data.white_light ?? null);

  if (timeLabels.length > MAX_POINTS) {
    timeLabels.shift();
    co2mhzSeries.shift();
    co2mqSeries.shift();
    pm1Series.shift();
    pm25Series.shift();
    pm10Series.shift();
    tempSeries.shift();
    luxSeries.shift();
    whiteLightSeries.shift();
  }

  co2Chart.update();
  pmChart.update();
  envChart.update();
}

// ---------------------------
// LECTURA REALTIME DATABASE
// ---------------------------
database.ref("UsersData").once("value", (snap) => {
  const users = snap.val();
  if (!users) return;

  const firstId = Object.keys(users)[0];
  const datosRef = database.ref(`UsersData/${firstId}/Datos`);

  datosRef.on("value", (snapshot) => {
    const data = snapshot.val();

    if (!data) return;

    // Actualizar valores en pantalla
    co2Mhz19Element.textContent = data.co2_mhz19;
    co2Mq135Element.textContent = data.co2_mq135;
    pm1Element.textContent = data.pm1_0;
    pm25Element.textContent = data.pm2_5;
    pm10Element.textContent = data.pm10;
    tempElement.textContent = data.temp_mhz19;
    luxElement.textContent = data.lux;
    whiteLightElement.textContent = data.white_light;

    lastUpdatedElement.textContent = new Date().toLocaleString();

    // Añadir al gráfico
    addPoint(data);
  });
});
