
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Referencia a la Realtime Database
const database = firebase.database();

const datosRef = database.ref("UsersData/FKXFzztAxHHBsZN0ItQX06fDAku1/Datos");

const co2Mhz19Element   = document.getElementById("co2Mhz19Value");
const co2Mq135Element   = document.getElementById("co2Mq135Value");
const pm1Element        = document.getElementById("pm1_0Value");
const pm25Element       = document.getElementById("pm2_5Value");
const pm10Element       = document.getElementById("pm10Value");
const tempElement       = document.getElementById("tempMhz19Value");
const luxElement        = document.getElementById("luxValue");
const whiteLightElement = document.getElementById("whiteLightValue");
const lastUpdatedElement = document.getElementById("lastUpdated");

datosRef.on("value", (snapshot) => {
  const data = snapshot.val();
  console.log("Datos recibidos:", data);

  if (!data) return;

  if (data.co2_mhz19  !== undefined) co2Mhz19Element.textContent   = data.co2_mhz19;
  if (data.co2_mq135  !== undefined) co2Mq135Element.textContent   = data.co2_mq135;
  if (data.pm1_0      !== undefined) pm1Element.textContent        = data.pm1_0;
  if (data.pm2_5      !== undefined) pm25Element.textContent       = data.pm2_5;
  if (data.pm10       !== undefined) pm10Element.textContent       = data.pm10;
  if (data.temp_mhz19 !== undefined) tempElement.textContent       = data.temp_mhz19;
  if (data.lux        !== undefined) luxElement.textContent        = data.lux;

  // 🔥 LA LÍNEA CORRECTA
  if (data.white_light !== undefined) whiteLightElement.textContent = data.white_light;

  const now = new Date();
  lastUpdatedElement.textContent = now.toLocaleString();
});