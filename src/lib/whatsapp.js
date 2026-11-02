import { money } from './format'

export function buildOrderMessage(items, total, customer = {}) {
  const line = '----------------------------------'
  const rows = items.map((i) => `• ${i.name} | Talla: ${i.size} | Color: ${i.color} | Cantidad: ${i.qty} | Precio: ${money(i.price * i.qty)}`)
  return [
    '🛒 *NUEVO PEDIDO DE COMPRA - LYRA*', line, ...rows, line,
    `💰 *Total a Pagar:* ${money(total)}`,
    `📍 *Nombre del Cliente:* ${customer.name || '[Campo a llenar antes de enviar]'}`,
    `📍 *Dirección de Envío:* ${customer.address || '[Campo a llenar antes de enviar]'}`,
  ].join('\n')
}

export const whatsappUrl = (phone, text) => `https://wa.me/${String(phone).replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
