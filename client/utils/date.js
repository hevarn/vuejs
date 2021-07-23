export function newDate () {
  const date = new Date().toISOString()
  const year = date.substring(0, 4)
  const month = date.substring(5, 7)
  const day = date.substring(8, 10)
  return `${day}/${month}/${year}`
}
export function formatDate (date) {
  const year = date.substring(0, 4)
  const month = date.substring(5, 7)
  const day = date.substring(8, 10)
  return `${day}/${month}/${year}`
}
export function time (date) {
  const hour = date.substring(11, 13)
  const minute = date.substring(14, 16)
  return `${hour}h${minute}`
}
