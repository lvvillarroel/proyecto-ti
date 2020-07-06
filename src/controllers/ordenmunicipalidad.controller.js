const models = require("../../models");
const sequelize = require('sequelize');
const xml2js = require('xml2js');
const EasyFtp = require('easy-ftp');
const fs = require('file-system');

async function getG(req, res){
  console.log("INICIANDO CONEXIÓN FTP")
  var ftp = new EasyFtp();
  var config = {host: "pandemic.ing.puc.cl", user: "grupo15_desarrollo", password:"amZFqHXcLwFdwnDfHk", port: 22,type:"sftp"};
  ftp.connect(config);
  var lista = [];
  await new Promise((resolve, reject) => {
      ftp.ls("/pedidos", async function(err, list){
          console.log("EN FTP")
          var dic = list;
          var i =0;
          for (const el of dic){
              i++;
              if (i===21){
                  break;
              }
              if (el["filename"] == "leidos"){
                  console.log("Es la carpeta leidos")
              }
              else{
                  var nombre = el["filename"];
                  var ne = "/pedidos/" + el["filename"];
                  var destinar = "/pedidos/leidos/"+ el["filename"];
                  lista.push(nombre);
                  await new Promise((resolve, reject) => {
                      ftp.download(ne,nombre,  function(err){resolve();})});
                  await new Promise((resolve, reject) => {
                      ftp.mv(ne, destinar, function(err, newPath){resolve();})}
                    );
              }
          }
          resolve();
      });
  });

  var prom_orderm = [];
  for (const j of lista) {
    console.log(j)
    var parser= new xml2js.Parser();
    fs.readFile(j, function(err, data) {
    parser.parseString(data, async function(err,result){
        //console.log(result["order"]["id"]);
        //AQUÍ CREAR ORDEN DE COMPRA MUNICIPALIDAD
        var idd = Number(result["order"]["id"][0]);
        var sku_caja = Number(result["order"]["sku"][0]);
        var cantidad = Number(result["order"]["qty"][0]);
        var monto = 0;
        var estado = "No completado";
        prom_orderm.push(createOrder(idd, sku_caja, cantidad, monto, estado));


        fs.unlinkSync(j)
        })
    });
  }
  await ejecutar_secuencial(prom_orderm)
}

async function createOrder(idd, sku_caja, cantidad, monto, estado){
  try{
    let newOrder = await models.orden_municipalidad.create({
      idd,
      sku_caja,
      cantidad,
      monto,
      estado,
    });
  }
  catch(e){
    console.log(e);
  }
}

async function getOrdersm(req, res){
    try{
      const order = await models.orden_municipalidad.findAll();
      res.json({
        Bodega: order
      });
    } catch(e){
      console.log(e);
      res.status(400).json({
        message: "Something went wrong",
        data: {}
      });
    }
}

async function ejectuar_secuencial(lista){
  for(const eli of lista){
    await eli;
  }
}


module.exports.getG = getG;
module.exports.getOrdersm = getOrdersm;
