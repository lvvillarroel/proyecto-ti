//const { product } = require("../models/products");
const models = require("../../models");
const sequelize = require('sequelize');
const crypto = require("crypto");
const groups_info = require("../utils/groups_info.json");
const fetch = require("node-fetch");

async function getGroupStock(group) {
  const url = `http://pandemia${group}.ing.puc.cl/stock`;
  const headers = { "Content-Type": "application/json" };
  const stock = await fetch(url, {
    method: "GET",
    headers: headers,
  }).then((response) => response.json());
  return stock;
}

function convertir(dic) {
  var lista = [];
  for (var el of Object.keys(dic)) {
    if (dic[el] !== 0) {
      lista.push({ sku: el, stock: dic[el] });
    }
  }
  //console.log("LISTA ES: ",lista);
  return lista;
}

function hashh(texto) {
  var text = texto; //accion + parámetro
  var secret = "NKYdTX@YXJtxwWi";
  var algorithm = "sha1";
  var hash, hmac;
  hmac = crypto.createHmac(algorithm, secret);
  hmac.update(text);
  hash = hmac.digest("base64");
  return hash;
}

async function obtener_almacenes(){
  var hash = hashh('GET');
  var stock= {1004:0,1006:0,1008:0,1010:0,1009:0,1014:0,1016:0,1017:0,1020:0,1023:0,1025:0,1027:0,1035:0}
  var url = 'http://integracion-2020-dev.herokuapp.com/bodega/almacenes';
  var headers = {'Content-Type': 'application/json', 'Authorization': 'INTEGRACION grupo15:' + hash};

  const respuesta = await fetch(url, {
      method: 'GET',
      headers: headers
    }).then(
      response => response.json()
      );
  for (const elemento of respuesta) {
      hash = hashh('GET'+ elemento["_id"]);
      url = 'http://integracion-2020-dev.herokuapp.com/bodega/skusWithStock?almacenId='+elemento["_id"];
      headers = { 'Content-Type': 'application/json', 'Authorization': 'INTEGRACION grupo15:'+hash};
      const respuesta2 = await fetch(url, {
          method: 'GET',
          headers: headers
        }).then(
           response2 => response2.json()
          ).then((data) => {
              for (const producto of data) {
                  stock[producto['_id']] += producto['total'];
                      }
              })
      }
  return convertir(stock);
}

async function getProducts(req, res){
  try{
    const productos = await models.products.findAll();
    res.json({
      Bodega: productos
    });
  } catch(e){
    console.log(e);
    res.status(400).json({
      message: "Something went wrong",
      data: {}
    });
  }
}

async function anularOc(id_oc, mesage) {
  let url = `http://integracion-2020-dev.herokuapp.com/oc/anular/${id_oc}`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    anulacion: message,
  };
  const anular = await fetch(url, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log(response.json());
    })
    .catch((e) => console.log(e));
}

async function recepcionarOc(id_oc) {
  let url = `http://integracion-2020-dev.herokuapp.com/oc/recepcionar/${id_oc}`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    _id: id_oc,
  };

  const recepcionAceptada = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log(response.json());
    })
    .catch((e) => console.log(e));
  console.log("[3] Notificar aceptacion a SistemaOC");
}

async function rechazarOc(id_oc, message) {
  let url = `http://integracion-2020-dev.herokuapp.com/oc/rechazar/${id_oc}`;
  const headers = { "Content-Type": "application/json" };
  const body = {
    rechazo: message,
  };

  const recepcionAceptada = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log(response.json());
    })
    .catch((e) => console.log(e));
  console.log("[3] Notificar rechazo a SistemaOC");
}

async function notificarGrupo(group, id_oc, status) {
  let url = `http://pandemia${group}.ing.puc.cl/api/oc/${id_oc}/notificacion`;
  // let url = `http://0.0.0.0/api/oc/${id_oc}/notificacion`
  const headers = { "Content-Type": "application/json" };
  const body = {
    estado: status,
  };

  const respuesta = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      console.log("[4] Grupo notificado");
    })
    .catch((e) => console.log(e));
}

async function getG(req, res) {
  const pro = await obtener_almacenes();
  res.json(pro);
}

async function receiveNotification(req, res) {
  try {
    if (req.body.estado == "aceptado") {
      // sumar a la base de datos una solicitud nuestra aceptada
      res.status(204).json();
    } else {
      // sumar a la base de datos una solicitud nuestra rechazada
      res.status(204).json({ estado: "rechazado" });
    }
  } catch (e) {
    res.status(400).json({
      message: "Something goes wrong",
      oc: {},
    });
  }
}

async function createProduct(req, res){
  const {sku, nombre, descripcion, precio_venta, lote_produccion, tiempo_esperado} = req.body;
  try {

        let newProduct = await models.products.create({
            sku,
            nombre,
            descripcion,
            precio_venta,
            lote_produccion,
            tiempo_esperado
        },
      ); // Es asincrono, agrego el await para eso
        if (newProduct){
            res.json({
                message: "Product created successfully",
                data: newProduct
            })
        }
    } catch(e) {
        res.status(400).json({
            message: "Something went wrong",
            data: {}
        });
      }
}

async function getGroupById(client) {
  const data = await groups_info;
  console.log("Buscando cliente... ", client);
  const g = [];
  data.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value["id"] == client) {
        g.push(key);
      }
    });
  });
  return g[0];
}

async function logicaSolicitud(client, sku, cantidad) {
  console.log("[1] Evaluando solicitud cliente: ", client);
  const stock = await getGroupStock(15);
  var requisito = false;
  var message = "";
  Object.entries(stock).forEach(([key, value]) => {
    if (value["sku"] == sku || cantidad > value["stock"]) requisito = true;
    else {
      message = "No tenemos stock suficiente de ese producto";
    }
  });
  return [requisito, message];
}

async function deleteProduct(req, res){
    models.products.destroy({where: req.params})
    .then(result => {
        if (result){
            res.status(200).json({msg: "Product deleted"})
        }
        else{
            res.status(404).json({msg: "Not Found"})
        }
    })
}

async function receiveOc(req, res) {
  // [POST] /api/oc
  let url = `http://integracion-2020-dev.herokuapp.com/oc/obtener/${req.body.id}`;
  const headers = { "Content-Type": "application/json" };
  const getOc = await fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));

  console.log(getOc[0]);
  const client = getOc[0]["cliente"],
    sku = getOc[0]["sku"],
    cantidad = getOc[0]["cantidad"],
    proveedor = getOc[0]["proveedor"];

  // obtener numero de grupo a partir de su id
  const group = await getGroupById(client);

  // crear logica de aceptacion o rechazo de la solicitud
  const respuestaSolicitud = await logicaSolicitud(group, sku, cantidad);

  // si se acepta la solicitud
  if (respuestaSolicitud[0]) {
    console.log("[2] solicitud aceptada");
    var status = "aceptado";
    // sumar a la base de datos que aceptamos una solicitud
    await recepcionarOc(req.params.oc); //Primero acepta en sistema OC
    await notificarGrupo(group, req.params.oc, status);
    // despachar productos a grupo "group"
  } else {
    console.log("[2] solicitud rechazada");
    var message = respuestaSolicitud[1];
    var status = "rechazado";
    // sumar a la base de datos que rechazamos una solicitud
    await rechazarOc(req.params.oc, message);
    await notificarGrupo(group, req.params.oc, status);
  }

  res.status(200).json({ estado: status });
}

module.exports.receiveNotification = receiveNotification;
module.exports.receiveOc = receiveOc;
module.exports.getG = getG;

module.exports.obtener_almacenes = obtener_almacenes;
module.exports.getProducts = getProducts;
module.exports.createProduct = createProduct;
module.exports.deleteProduct = deleteProduct;
