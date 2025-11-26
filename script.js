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
//   ELEMENTOS DE TEXTO
// ---------------------------
const co2Mhz19Element = document.getElementById("co2Mhz19Value");
const co2Mq135Element = document.getElementById("co2Mq135Value");
const pm1Element      = document.getElementById("pm1_0Value");
const pm25Element     = document.getElementById("pm2_5Value");
const pm10Element     = document.getElementById("pm10Value");
const tempElement     = document.getElementById("tempMhz19Value");
const luxElement      = document.getElementById("luxValue");
const whiteLightElement = document.getElementById("whiteLightValue");
const lastUpdatedElement = document.getElementById("lastUpdated");

// ---------------------------
//   SERIES Y PARÁMETROS
// ---------------------------
const MAX_POINTS = 20;
const timeLabels = [];

const co2mhzSeries     = [];
const co2mqSeries      = [];
const pm1Series        = [];
const pm25Series       = [];
const pm10Series       = [];
const tempSeries       = [];
const luxSeries        = [];
const whiteLightSeries = [];

// ---------------------------
//   CREACIÓN DE GRÁFICAS
// ---------------------------
function createSingleLineChart(ctx, label, data, yLabel) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: "#00e5ff",
          backgroundColor: "rgba(0,229,255,0.2)",
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e3f2fd",
            font: { size: 10 }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#90a4ae", maxRotation: 0, autoSkip: true },
          grid: { color: "rgba(255,255,255,0.04)" }
        },
        y: {
          ticks: { color: "#90a4ae" },
          grid: { color: "rgba(255,255,255,0.04)" },
          title: yLabel
            ? { display: true, text: yLabel, color: "#b0bec5", font: { size: 11 } }
            : undefined,
          beginAtZero: true
        }
      }
    }
  });
}

// Obtener contextos de cada canvas
const co2MhzCtx   = document.getElementById("co2MhzChart").getContext("2d");
const co2MqCtx    = document.getElementById("co2MqChart").getContext("2d");
const pm1Ctx      = document.getElementById("pm1Chart").getContext("2d");
const pm25Ctx     = document.getElementById("pm25Chart").getContext("2d");
const pm10Ctx     = document.getElementById("pm10Chart").getContext("2d");
const tempCtx     = document.getElementById("tempChart").getContext("2d");
const luxCtx      = document.getElementById("luxChart").getContext("2d");
const whiteCtx    = document.getElementById("whiteLightChart").getContext("2d");

// Crear una gráfica por cada variable
const co2MhzChart   = createSingleLineChart(co2MhzCtx, "CO₂ MHZ19 (ppm)", co2mhzSeries, "ppm");
const co2MqChart    = createSingleLineChart(co2MqCtx,  "CO₂ MQ135 (ppm)", co2mqSeries,  "ppm");
const pm1Chart      = createSingleLineChart(pm1Ctx,    "PM1.0 (µg/m³)",   pm1Series,   "µg/m³");
const pm25Chart     = createSingleLineChart(pm25Ctx,   "PM2.5 (µg/m³)",   pm25Series,  "µg/m³");
const pm10Chart     = createSingleLineChart(pm10Ctx,   "PM10 (µg/m³)",    pm10Series,  "µg/m³");
const tempChart     = createSingleLineChart(tempCtx,   "Temperatura (°C)", tempSeries, "°C");
const luxChart      = createSingleLineChart(luxCtx,    "Lux",            luxSeries,   "lux");
const whiteLightChart = createSingleLineChart(whiteCtx,"Luz Blanca",      whiteLightSeries, "valor");

// ---------------------------
//  FUNCIÓN PARA AÑADIR PUNTO
// ---------------------------
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

  co2MhzChart.update();
  co2MqChart.update();
  pm1Chart.update();
  pm25Chart.update();
  pm10Chart.update();
  tempChart.update();
  luxChart.update();
  whiteLightChart.update();
}

// ---------------------------
//   LECTURA REALTIME
// ---------------------------
database.ref("UsersData").once("value", (snap) => {
  const users = snap.val();
  if (!users) return;

  const firstId = Object.keys(users)[0];
  const datosRef = database.ref(`UsersData/${firstId}/Datos`);

  datosRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Actualizamos los textos
    co2Mhz19Element.textContent   = data.co2_mhz19;
    co2Mq135Element.textContent   = data.co2_mq135;
    pm1Element.textContent        = data.pm1_0;
    pm25Element.textContent       = data.pm2_5;
    pm10Element.textContent       = data.pm10;
    tempElement.textContent       = data.temp_mhz19;
    luxElement.textContent        = data.lux;
    whiteLightElement.textContent = data.white_light;

    lastUpdatedElement.textContent = new Date().toLocaleString();

    // Mandamos el punto a todas las gráficas
    addPoint(data);
  });
});
