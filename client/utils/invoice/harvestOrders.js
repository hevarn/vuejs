import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { newDate } from '@/utils/date'
import logoHeader from '@/static/logoInvoiceHeaderB64'
import logoFooter from '@/static/logoInvoiceFooterB64'
import dashBorder from './dashBorder'

export function createInvoiceKulteur (orders) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  const itemsHeader = [
    {
      text: 'Réf produit',
      bold: true,
      alignment: 'center',
      border: [false, false, true, true]
    },
    {
      text: 'Libellé',
      bold: true,
      alignment: 'center',
      border: [false, false, true, true]
    },
    {
      text: 'Conditionnement',
      bold: true,
      alignment: 'center',
      border: [false, false, true, true]
    },
    {
      text: 'Qté',
      bold: true,
      alignment: 'center',
      border: [false, false, true, true]
    }
  ]
  const items = orders
    .sort((a, b) => {
      if (a.description < b.description) {
        return -1
      } else {
        return 1
      }
    })
    .flatMap(item => {
      const orders = item.orders.map(order => {
        return [
          { text: '', alignment: 'center' },
          {
            text: `Cde ${new Date(order.created * 1000).toLocaleString(
              'fr-FR',
              { month: '2-digit', day: '2-digit' }
            )} ${order.customer}`,
            alignment: 'center'
          },
          { text: '', alignment: 'center' },
          { text: order.quantity, alignment: 'center' }
        ]
      })
      orders.unshift([
        { text: item.reference, bold: true, alignment: 'center' },
        { text: item.description, bold: true, alignment: 'center' },
        { text: item.packaging, bold: true, alignment: 'center' },
        { text: item.quantity, bold: true, alignment: 'center' }
      ])
      return orders
    })
  items.unshift(itemsHeader)
  return pdfMake.createPdf({
    pageMargins: [40, 60, 40, 80],
    content: [
      { image: logoHeader, width: 150, height: 150, margin: [-50, -50, 0, 0] },
      {
        text: `Bon de Préparation - ${orders[0].siteName}`,
        bold: true,
        margin: [0, -90, 0, 0],
        alignment: 'center',
        fontSize: 25
      },
      {
        text: `Préparation du : ${newDate()}`,
        alignment: 'right',
        fontSize: 15,
        margin: [0, 50, 0, 0]
      },
      {
        text: `Mise à disposition le : ${new Date(
          orders[0].receptionOpen * 1000
        ).toLocaleString('fr-FR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })} entre ${new Date(
          orders[0].receptionOpen * 1000
        ).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })} et ${new Date(
          orders[0].receptionClose * 1000
        ).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        alignment: 'right',
        fontSize: 15
      },
      {
        text: `A la serre ${orders[0].siteName} - ${orders[0].siteAdress}`,
        bold: true,
        alignment: 'right',
        fontSize: 10
      },
      { text: 'Produits sur place (0 km)', blod: true, margin: [0, 20, 0, 5] },
      {
        table: {
          widths: [100, 180, 100, 100],
          body: items
        },
        layout: dashBorder
      }
    ],
    footer: {
      columns: [
        { image: logoFooter, width: 50, height: 50, margin: [30, -30, 0, 5] },
        {
          stack: [
            {
              text:
                'Kanopée Koncept — 60 place de la Répbulque — 33160 Saint-Médard-en-Jalles'
            },
            { text: 'contact@kanopeekoncept.com' }
          ],
          margin: [35, -10, 0, 0],
          fontSize: 10
        }
      ],
      margin: [0, 30, 0, 0]
    }
  })
}
