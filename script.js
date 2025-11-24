// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la Realtime Database
const database = firebase.database();

// RUTA EXACTA A 'Datos' (no solo a pm2_5)
const datosRef = database.ref('UsersData/FKXFzztAxHHBsZN0ItQX06fDAku1/Datos');

// Elementos HTML donde mostraremos los datos
const pm25Element       = document.getElementById('pm2_5Value');
const co2Mhz19Element   = document.getElementById('co2Mhz19Value');
const co2Mq135Element   = document.getElementById('co2Mq135Value');
const pm1Element        = document.getElementById('pm1_0Value');
const pm10Element       = document.getElementById('pm10Value');
const tempElement       = document.getElementById('tempMhz19Value');
const luxElement        = document.getElementById('luxValue');
const whiteLightElement = document.getElementById('whiteLightValue');

const lastUpdatedElement = document.getElementById('lastUpdated');

// Escucha cambios en todo el nodo Datos
datosRef.on('value', (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    pm25Element.textContent = 'Sin datos';
    co2Mhz19Element.textContent = 'Sin datos';
    co2Mq135Element.textContent = 'Sin datos';
    pm1Element.textContent = 'Sin datos';
    pm10Element.textContent = 'Sin datos';
    tempElement.textContent = 'Sin datos';
    luxElement.textContent = 'Sin datos';
    whiteLightElement.textContent = 'Sin datos';
    lastUpdatedElement.textContent = '';
    console.log('No hay datos en Datos');
    return;
  }

  // Asigna cada valor; usa el nombre EXACTO del campo en Firebase
  if (data.pm2_5      !== undefined) pm25Element.textContent       = data.pm2_5;
  if (data.co2_mhz19  !== undefined) co2Mhz19Element.textContent   = data.co2_mhz19;
  if (data.co2_mq135  !== undefined) co2Mq135Element.textContent   = data.co2_mq135;
  if (data.pm1_0      !== undefined) pm1Element.textContent        = data.pm1_0;
  if (data.pm10       !== undefined) pm10Element.textContent       = data.pm10;
  if (data.temp_mhz19 !== undefined) tempElement.textContent       = data.temp_mhz19;
  if (data.lux        !== undefined) luxElement.textContent        = data.lux;
  if (data.luzBlanca  !== undefined) whiteLightElement.textContent = data.luzBlanca;

  const now = new Date();
  lastUpdatedElement.textContent = now.toLocaleString();
  console.log('Datos recibidos:', data);
}, (error) => {
  console.error('Error al leer la base de datos:', error);
});
