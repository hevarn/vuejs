import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import logoHeader from '@/static/logoInvoiceHeaderB64'
import logoFooter from '@/static/logoInvoiceFooterB64'
import dashBorder from './dashBorder'

export function createInvoiceReceiptOrders (orders) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  return pdfMake.createPdf({
    pageMargins: [40, 60, 40, 80],
    content: orders.map(order => {
      let cellCoupon = { text: '' }
      if (order.discount) {
        cellCoupon = {
          text: `Bon de réduction : ${order.discount.coupon.name}`,
          alignment: 'center'
        }
      }
      const productsKulteur = []
      const productsProvider = []
      order.lines.data.forEach(item => {
        const formatedOrder = [
          { text: item.metadata.providerReference, alignment: 'center' },
          { text: item.description, alignment: 'center' },
          {
            text: (item.amount / 100 / item.quantity).toFixed(2),
            alignment: 'center'
          },
          { text: item.metadata.packaging, alignment: 'center' },
          { text: item.quantity, bold: true, alignment: 'center' },
          { text: (item.amount / 100).toFixed(2), alignment: 'center' }
        ]
        if (/true/i.test(item.metadata.isBio)) {
          productsProvider.push(formatedOrder)
        } else {
          productsKulteur.push(formatedOrder)
        }
      })
      const productsKulteurHeader = [
        { text: 'Réf Produit', alignment: 'center' },
        { text: 'Libellé', alignment: 'center' },
        { text: 'PU (€)', alignment: 'center' },
        { text: 'Unité', alignment: 'center' },
        { text: 'Qté', alignment: 'center' },
        { text: 'Prix (€ TTC)', alignment: 'center' }
      ]
      const productsProviderHeader = [
        { text: 'Réf Produit', alignment: 'center' },
        { text: 'Libellé', alignment: 'center' },
        { text: 'PU (€)', alignment: 'center' },
        { text: 'Unité', alignment: 'center' },
        { text: 'Qté', alignment: 'center' },
        { text: 'Prix (€ TTC)', alignment: 'center' }
      ]
      productsKulteur.unshift(productsKulteurHeader)
      productsProvider.unshift(productsProviderHeader)
      return [
        {
          image: logoHeader,
          width: 140,
          height: 140,
          margin: [-50, -50, 0, 0]
        },
        {
          text: `Reçu Panier Kanop - ${order.custom_fields[0].value}`,
          bold: true,
          margin: [70, -90, 0, 0],
          alignment: 'center',
          fontSize: 20
        },
        {
          text: `Cde n° : ${order.number}`,
          margin: [0, 40, 0, 0],
          fontSize: 20
        },
        { text: order.customer_name, margin: [0, 0, 0, 5], fontSize: 20 },
        {
          text: `Compte client : ${order.customer_email} / ${order.customer_phone}`,
          margin: [0, 0, 0, 5],
          fontSize: 10
        },
        {
          text: `Commande du : ${new Date(
            order.created * 1000
          ).toLocaleString()}`,
          alignment: 'right',
          fontSize: 15
        },
        {
          text: `Mise à disposition le : ${new Date(
            order.metadata.eventStartAt
          ).toLocaleDateString('fr-FR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          })} entre ${new Date(
            order.metadata.eventStartAt
          ).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })} et ${new Date(
            order.metadata.eventEndAt
          ).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          alignment: 'right',
          fontSize: 15
        },
        {
          text: `A la serre ${order.custom_fields[0].value} - ${order.metadata.providerAdress}`,
          alignment: 'right',
          fontSize: 10
        },
        {
          text: 'Produits sur place (0 km)',
          bold: true,
          margin: [0, 20, 0, 5]
        },
        {
          table: {
            widths: [90, 140, 50, 50, 60, 70],
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
            widths: [90, 140, 50, 50, 60, 70],
            body: productsProvider
          },
          layout: dashBorder
        },
        {
          margin: [0, 20, 0, 20],
          table: {
            widths: [90, 140, 50, 50, 60, 70],
            body: [
              [
                { text: 'TOTAL', alignment: 'center' },
                cellCoupon,
                { text: '' },
                { text: '' },
                { text: 'TVA 5.5%', alignment: 'center' },
                {
                  text: (order.total / 100).toFixed(2),
                  bold: true,
                  alignment: 'center'
                }
              ]
            ]
          },
          layout: dashBorder
        },
        {
          text: `Règlement par carte bancaire en ligne : ${new Date(
            order.status_transitions.paid_at * 1000
          ).toLocaleString()}. Transaction numéro : ${order.receipt_number}`,
          fontSize: 10,
          pageBreak: 'after'
        }
      ]
    }),
    footer: {
      columns: [
        { image: logoFooter, width: 35, height: 35, margin: [30, -10, 0, 5] },
        {
          stack: [
            {
              text:
                'Kanopée Koncept — 60 place de la République — 33160 Saint-Médard-en-Jalles'
            },
            { text: 'contact@kanopeekoncept.com' }
          ],
          margin: [45, 0, 0, 0],
          fontSize: 10
        }
      ],
      margin: [0, 30, 0, 0]
    }
  })
}
