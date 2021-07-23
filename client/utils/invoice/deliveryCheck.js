import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import logoHeader from '@/static/logoInvoiceHeaderB64'
import logoFooter from '@/static/logoInvoiceFooterB64'
import dashBorder from './dashBorder'

export default (orders, orderNum, selectedProvider) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  const itemsHeader = [
    { text: 'Réf four.', alignment: 'center' },
    { text: 'Réf Kanopee', alignment: 'center' },
    { text: 'Description', alignment: 'center' },
    { text: 'PU', alignment: 'center' },
    { text: 'Unité', alignment: 'center' },
    { text: 'Cdt', alignment: 'center' },
    { text: 'Qant. attendue', alignment: 'center' },
    { text: 'Quant. reçue', alignment: 'center' },
    { text: 'Variation', alignment: 'center' }
  ]
  const items = orders
    .sort((a, b) => {
      if (a.description < b.description) {
        return -1
      } else {
        return 1
      }
    })
    .map(({ referenceKanopee, referenceProvider, description, buyPrice, qtyExpected, unity, cdt, qtyReceived }) => {
      return [
        { text: referenceProvider, alignment: 'center' },
        { text: referenceKanopee, alignment: 'center' },
        { text: description, alignment: 'center' },
        { text: (buyPrice / qtyExpected).toFixed(2), alignment: 'center' },
        { text: unity, alignment: 'center' },
        { text: cdt, alignment: 'center' },
        { text: qtyExpected, alignment: 'center' },
        { text: qtyReceived, alignment: 'center' },
        { text: qtyReceived - qtyExpected, alignment: 'center', bold: true }
      ]
    })
  items.unshift(itemsHeader)
  return pdfMake.createPdf({
    pageMargins: [40, 60, 40, 80],
    content: [
      { image: logoHeader, width: 150, height: 150, margin: [-50, -50, 0, 0] },
      {
        text: `BL ${selectedProvider.name} n° ${orderNum}`,
        bold: true,
        margin: [0, -90, 0, 0],
        alignment: 'center',
        fontSize: 25
      },
      {
        text:
          `Livraison fournisseur du : ${new Date().toLocaleDateString()}`,
        bold: true,
        fontSize: 15,
        margin: [150, 20, 0, 40]
      },
      {
        table: {
          widths: [50, 85, 100, 35, 35, 35, 40, 35, 30],
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
