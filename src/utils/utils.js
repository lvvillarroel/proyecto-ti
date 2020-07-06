import groups_info from './groups_info.json';
const fetch = require('node-fetch');

export async function getGroupStock(group) {
  const url = `http://pandemia${group}.ing.puc.cl/stock`;
  const headers = { 'Content-Type': 'application/json' };
  const stock = await fetch(url, {
    method: 'GET',
    headers: headers
  }).then(
    response => response.json()
  );
  return stock;
}

export async function createOC(group, sku, dueDate, qty, precio) {
  let url = "http://integracion-2020-dev.herokuapp.com/oc/crear";
  const headers = { 'Content-Type': 'application/json' };
  const data = await groups_info
  const body = {
    "cliente": data[0]["15"]["id"],
    "proveedor": data[0][group]["id"],
    "sku": sku,
    "fechaEntrega": dueDate,
    "cantidad": qty,
    "precioUnitario": precio,
    "canal": "b2b",
    "urlNotificacion": "http://pandemia15.ing.puc.cl/api/oc/_id"
  }
  const newOC = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(body)
  }).then(
    response => {
      if (response.status !== 200) {
        return null
      } else {
        return response.json()
      }
    }
  ).catch(
    err => console.log(err)
  );
  return newOC;
}

export async function sendOCid(group, id) {
  const url = `http://pandemia${group}.ing.puc.cl/api/oc`
  const headers = { 'Content-Type': 'application/json' };
  const body = {
    "id": id
  }
  const sendOC = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  }).then(
    response => {
      if (response.status !== 200) {
        return null
      } else {
        return response.json()
      }
    }
  ).catch(
    err => console.log(err)
  );
  return sendOC
}