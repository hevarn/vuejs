import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { newDate } from '@/utils/date'
import logoHeader from '@/static/logoInvoiceHeaderB64'
import logoFooter from '@/static/logoInvoiceFooterB64'
import dashBorder from './dashBorder'

export function createInvoiceProvider (orders, orderNum) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  let totalPrice = 0
  const itemsHeader = [
    { text: 'Réf Four', alignment: 'center' },
    { text: 'Réf KANOP', alignment: 'center' },
    { text: 'Libellé fournisseur', alignment: 'center' },
    { text: 'PU', alignment: 'center' },
    { text: 'Unité', alignment: 'center' },
    { text: 'Cdt', alignment: 'center' },
    { text: 'Prix (€ HT)', alignment: 'center' },
    { text: 'Qté', alignment: 'center' },
    { text: 'Colis', alignment: 'center' }
  ]
  const items = orders
    .sort((a, b) => {
      if (a.reference.infoRef < b.reference.infoRef) {
        return -1
      } else {
        return 1
      }
    })
    .map(item => {
      totalPrice += Number(item.price)
      return [
        { text: item.reference.providerReference, alignment: 'center' },
        { text: item.reference.kanopeeReference, alignment: 'center' },
        { text: item.reference.infoRef, alignment: 'center' },
        { text: (item.price / item.qty).toFixed(2), alignment: 'center' },
        { text: item.unity, alignment: 'center' },
        { text: item.reference.package, alignment: 'center' },
        { text: item.price, alignment: 'center' },
        { text: item.qty, alignment: 'center', bold: true },
        { text: item.colis, alignment: 'center', bold: true }
      ]
    })
  items.unshift(itemsHeader)
  items.push([
    { text: 'TOTAL', bold: true, alignment: 'center', margin: [0, 10, 0, 0] },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    {
      text: totalPrice.toFixed(2),
      bold: true,
      alignment: 'center',
      margin: [0, 10, 0, 0]
    },
    { text: '' },
    { text: '' }
  ])
  return pdfMake.createPdf({
    pageMargins: [40, 60, 40, 80],
    content: [
      { image: logoHeader, width: 150, height: 150, margin: [-50, -50, 0, 0] },
      {
        text: `Bon de commande n° ${orderNum}`,
        bold: true,
        margin: [0, -90, 0, 0],
        alignment: 'center',
        fontSize: 25
      },
      {
        table: {
          widths: [150],
          body: [
            [
              {
                stack: [
                  { text: orders[0].reference.pdt_provider.name },
                  { text: orders[0].reference.pdt_provider.adress }
                ]
              }
            ]
          ]
        },
        margin: [320, 30, 0, 0]
      },
      {
        table: {
          widths: ['auto'],
          body: [
            [
              {
                stack: [
                  { text: 'Adresse de livraison :' },
                  { text: 'KANOPEE KONCEPT — A LA SERRE' },
                  { text: 'RESIDENCE LADERA' },
                  { text: 'RUE DE LA LAMPROIE' },
                  { text: '33270 FLOIRAC' }
                ]
              }
            ]
          ]
        },
        margin: [20, 0, 0, 20]
      },
      { text: `Commande du : ${newDate()}`, fontSize: 15 },
      {
        text:
          'Livraison prévue : ...........................  AR : ...................',
        bold: true,
        fontSize: 15,
        margin: [0, 2, 0, 20]
      },
      {
        table: {
          widths: [75, 75, 75, 35, 35, 35, 40, 30, 30],
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
            { text: 'Adresse de facturation' },
            {
              text:
                'Kanopée Koncept — 60 place de la Répbulque — 33160 Saint-Médard-en-Jalles'
            },
            { text: 'TVA : FR76844538249 – SIRET : 84453824900013' }
          ],
          margin: [35, -20, 0, 0],
          fontSize: 10
        }
      ],
      margin: [0, 30, 0, 0]
    }
  })
}
