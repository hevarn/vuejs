const dashBorder = {
  hLineWidth: function (i, node) {
    if (node.table.body[i]) {
      const firstLine = node.table.body[i].find(cell => cell.bold === true)
      if (firstLine) {
        return 1
      } else {
        return 0
      }
    }
    return 0
  },
  vLineWidth: function (i, node) {
    return i === 0 || i === node.table.widths.length ? 0 : 1
  },
  hLineColor: function (i, node) {
    return 'black'
  },
  vLineColor: function (i, node) {
    return 'black'
  },
  hLineStyle: function (i, node) {
    if (i === 0 || i === node.table.body.length) {
      return { color: 'white' }
    }
    return { dash: { length: 10, space: 4 } }
  },
  vLineStyle: function (i, node) {
    if (i === 0 || i === node.table.widths.length) {
      return null
    }
    return { dash: { length: 4 } }
  }
}

export default dashBorder
