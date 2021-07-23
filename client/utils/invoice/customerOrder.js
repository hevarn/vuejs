import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import logoHeader from '@/static/logoInvoiceHeaderB64'
import logoFooter from '@/static/logoInvoiceFooterB64'
import dashBorder from './dashBorder'

export function createInvoiceCustomerOrder (
  order,
  {
    providerName,
    orderNumber,
    fullName,
    email,
    receptionOpen,
    receptionClose,
    providerAdress
  }
) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  const productsKulteur = []
  const productsProvider = []
  order.lines.data.forEach(item => {
    const formatedOrder = [
      { text: item.description, alignment: 'center' },
      {
        text: (item.amount / 100 / item.quantity).toFixed(2),
        alignment: 'center'
      },
      { text: item.metadata.packaging, alignment: 'center' },
      { text: item.quantity, bold: true, alignment: 'center' },
      { text: (item.amount / 100).toFixed(2), alignment: 'center' }
    ]
    if (/true/i.test(item.isBio)) {
      productsProvider.push(formatedOrder)
    } else {
      productsKulteur.push(formatedOrder)
    }
  })
  const productsKulteurHeader = [
    { text: 'Libellé', alignment: 'center' },
    { text: 'PU (€)', alignment: 'center' },
    { text: 'Unité', alignment: 'center' },
    { text: 'Qté', alignment: 'center' },
    { text: 'Prix (€ TTC)', alignment: 'center' }
  ]
  const productsProviderHeader = [
    { text: 'Libellé', alignment: 'center' },
    { text: 'PU (€)', alignment: 'center' },
    { text: 'Unité', alignment: 'center' },
    { text: 'Qté', alignment: 'center' },
    { text: 'Prix (€ TTC)', alignment: 'center' }
  ]
  productsKulteur.unshift(productsKulteurHeader)
  productsProvider.unshift(productsProviderHeader)
  const bodyTablePrice = [
    [
      { text: '', alignment: 'center', border: [false, false, true, true] },
      {
        text: 'TOTAL',
        alignment: 'center',
        border: [false, false, true, true]
      },
      { text: '', border: [false, false, true, true] },
      {
        text: 'TVA 5.5%',
        alignment: 'center',
        border: [false, false, true, true]
      },
      {
        text: (order.total / 100).toFixed(2),
        bold: true,
        alignment: 'center',
        border: [false, false, true, true]
      }
    ]
  ]
  if (order.discount) {
    const linePriceBeforeDiscount = [
      { text: '', alignment: 'center', border: [false, false, true, false] },
      {
        text: 'TOTAL',
        alignment: 'center',
        border: [false, false, true, false]
      },
      { text: '', border: [false, false, true, false] },
      {
        text: 'TVA 5.5%',
        alignment: 'center',
        border: [false, false, true, false]
      },
      {
        text: (order.subtotal / 100).toFixed(2),
        bold: true,
        alignment: 'center',
        border: [false, false, true, true]
      }
    ]
    if (order.discount.coupon.amount_off) {
      bodyTablePrice.unshift([
        { text: '', border: [false, false, true, false] },
        {
          colSpan: 3,
          text: `Bon de réduction de ${(
            order.discount.coupon.amount_off / 100
          ).toFixed(2)} €`,
          alignment: 'right',
          border: [false, false, true, false]
        },
        {},
        {},
        {
          text: `- ${(order.discount.coupon.amount_off / 100).toFixed(2)} €`,
          bold: true,
          alignment: 'center',
          border: [false, false, true, true]
        }
      ])
    } else {
      bodyTablePrice.unshift([
        { text: '', border: [false, false, true, false] },
        {
          colSpan: 3,
          text: `Bon de réduction de ${order.discount.coupon.percent_off} %`,
          alignment: 'right',
          border: [false, false, true, false]
        },
        {},
        {},
        {
          text: `- ${(
            (order.subtotal / 100) *
            (order.discount.coupon.percent_off / 100)
          ).toFixed(2)}`,
          bold: true,
          alignment: 'center',
          border: [false, false, true, true]
        }
      ])
    }
    bodyTablePrice.unshift(linePriceBeforeDiscount)
  }
  return pdfMake.createPdf({
    pageMargins: [40, 60, 40, 80],
    content: [
      { image: logoHeader, width: 140, height: 140, margin: [-50, -50, 0, 0] },
      {
        text: `Reçu Panier Kanop - ${providerName}`,
        bold: true,
        margin: [70, -90, 0, 0],
        alignment: 'center',
        fontSize: 20
      },
      { text: 'Cde n° : ', margin: [0, 40, 0, 0], fontSize: 20 },
      {
        text: `${orderNumber}`,
        bold: true,
        margin: [80, -25, 0, 0],
        fontSize: 22
      },
      { text: `${fullName}`, margin: [0, 0, 0, 5], fontSize: 20 },
      { text: `Compte client : ${email}`, margin: [0, 0, 0, 5], fontSize: 10 },
      {
        text: `Commande du : ${new Date(
          order.created * 1000
        ).toLocaleDateString()}`,
        alignment: 'right',
        fontSize: 15
      },
      {
        text: `Mise à disposition le : ${new Date(
          receptionOpen * 1000
        ).toLocaleString('fr-FR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })} entre ${new Date(receptionOpen * 1000).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })} et ${new Date(receptionClose * 1000).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        alignment: 'right',
        fontSize: 15
      },
      {
        text: `À la serre ${providerName} - ${providerAdress}`,
        alignment: 'right',
        fontSize: 10
      },
      { text: 'Produits sur place (0 km)', bold: true, margin: [0, 20, 0, 5] },
      {
        table: {
          widths: [180, 60, 60, 70, 90],
          body: productsKulteur
        },
        layout: dashBorder
      },
      {
        text: "Produits issus de l'agriculture biologique",
        bold: true,
        margin: [0, 70, 0, 5]
      },
      {
        table: {
          widths: [180, 60, 60, 70, 90],
          body: productsProvider
        },
        layout: dashBorder
      },
      {
        margin: [0, 20, 0, 0],
        table: {
          widths: [180, 60, 60, 70, 90],
          body: bodyTablePrice
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
                'Kanopée Koncept — 60 place de la République — 33160 Saint-Médard-en-Jalles'
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
