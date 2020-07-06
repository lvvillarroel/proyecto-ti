const scheduler = require("node-schedule");

async function scheduleFTP() {
  //   const pro = await obtener_almacenes();
  scheduler.scheduleJob("0 45 * * * *", function () {
    console.log("esto se imprime cada hora a las XX:45"); //acá dentro iría lo de ir a buscar las ordenes a la casilla FTP
  });
}

async function scheduleMoveStock() {
  scheduler.scheduleJob("0 */15 * * * *", function () {
    console.log("esto se imprime cada 15 minutos"); // aca se moverian los objetos desde la bodega de despacho a la cocina
  });
}

// Luego se tiene fabricar lo necesario para las cajas y pedir lo que no podemos fabricar
// Fabricar cajas cuando esten todos los productos necesarios
// Mandar caja a la municipalidad cuando esté hecha

// ** Aceptar ordenes que no tengamos stock y mandar a fabricar -- final upgrades
// Enviar productos de cocina a despacho y luego enviar productos a bodega de otros grupos

// Juntar funciones que hice (leyla)
// Si nos rechazan, crear otra orden de compra
// Guardar esto en la bdd (lo pedido, a que grupo, fecha de peticion y fin, costos, estado)
// Incluir precios de venta

// DATOS:
// 1 vez al día revisar si las OC fueron completadas (las nuestras y las de otros grupos) (para guardar datos)

// DASHBOARD

module.exports.scheduleFTP = scheduleFTP;
