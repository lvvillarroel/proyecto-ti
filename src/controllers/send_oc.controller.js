import { getGroupStock, createOC, sendOCid } from '../utils/utils'
const fetch = require('node-fetch');
const models = require("../../models");

// Buscar stock de los grupos y seleccionar el que tenga mayor cantidad
export async function selectGroup(sku, skip) {
  let max = -1;
  let selectedGroup = 0;
  for (let g = 1; g < 17; g++) {
    if (skip.includes(g)) {
      continue
    }
    await getGroupStock(g).then(
      stock => {
        for (const i in stock) {
          if (stock[i].sku && stock[i].sku == sku && stock[i].stock > max) {
            max = stock[i].stock
            selectedGroup = g
          }
        }
      }
    ).catch(
      err => console.log(err)
    )
  }
  console.log(selectedGroup, max)
  return selectedGroup
}

// Generar orden de compra y enviar id al grupo (llamar esto desde el notification o fabricación de cajas)
export async function sendGroupOC(sku, qty) {
  // calcular fecha de vencimiento
  let d = new Date()
  d = d.getTime() + 100000000 // 30 hrs a partir de ahora
  dd = d - 3600000 // resto 1 hora
  // ir a buscar los grupos a los que ya les pregunté a la bdd
  const grupos = models.orden_compra.findAll({
    attributes: ['grupo_vende'],
    where: {
      grupo_vende: 15,
      sku: sku,
      cantidad: qty,
      estado: 'Cancelado',
      fecha_venc: {
        gt: dd
      }
    }
  });
  console.log(grupos.toJSON());
  // CONVERTIR RESPUESTA A ARRAY (skip)
  const skip = [15]
  // buscar en la bdd el monto 
  const monto = models.orden_compra.findAll({
    attributes: ['monto'],
    where: { sku }
  });
  console.log(monto.toJSON());
  // CONVERTIR MONTO A STR
  let g = await selectGroup(sku, skip) // seleccionar grupo a pedirle
  // Hacer orden de compra en el sistema
  const createdOC = await createOC(g, sku, d, qty)
  if (createOC) {
    // Notificar al grupo vendedor
    await sendOCid(g, createdOC._id)
    // Guardar OC en la base de datos
    await createNewOC(parseInt(sku, 10), 15, parseInt(g, 10), parseInt(qty, 10), parseInt(monto, 10), d, "Creado")
  }
}

async function createNewOC(sku_producto, grupo_compra, grupo_vende, cantidad, monto, fecha_venc, estado) {
  try {
    let newOC = await models.orden_compra.create({
      sku_producto,
      grupo_compra,
      grupo_vende,
      cantidad,
      monto,
      fecha_venc,
      estado
    },
    );
  } catch (e) {
    console.log(e)
  }
}