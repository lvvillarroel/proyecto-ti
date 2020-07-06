const app = require("./src/app");
require("@babel/polyfill");
const db = require("./models");

// async function main() {
//     HOST = app.get(`host`)
//     PORT = app.get(`port`)
//     await app.listen(PORT, HOST);
//     console.log(`RUN on http://${HOST}:${PORT}`);
// }
//
// main();

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Conexion con la bdd establecida");
    HOST = app.get(`host`)
    PORT = app.get(`port`)
    app.listen(PORT, HOST, (err) => {
      if(err) {
        return console.error("Failed", err);
      }
      console.log(`-------- RUN on http://${HOST}:${PORT} --------`);
      return app;
    });
  })
  .catch((err) => console.error("No se puede conectar a la bdd:", err))

db.sequelize.sync({
  force: true,
});
