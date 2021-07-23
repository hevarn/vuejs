import { format } from 'date-fns'

export function setEventsFromRaw (eventsRaw, userId) {
  return eventsRaw.map(e => {
    let color
    switch (e.role) {
      case 'Reception':
        color = 'blue'
        break
      case 'Atelier':
        color = 'primary'
        break
      case 'Entretien':
        color = 'orange'
        break
      case 'Culture':
        color = 'secondary'
        break
    }
    const start = formatDate(e.startAt).replace(' ', 'T')
    const end = formatDate(e.endAt).replace(' ', 'T')
    let isWorkshop = false
    let price = 0
    let name = e.description
    let isRegistred = false
    let pastAttendee = false
    if (e.workshop) {
      isWorkshop = true
      price = e.workshop.price
      name = e.workshop.name
    }
    const p = e.participations.find(item => item.userUserId === userId)
    if (p) {
      isRegistred = true
      pastAttendee = p.emargement
    }
    return {
      name,
      pastAttendee,
      isRegistred,
      start,
      end,
      color,
      fullEvent: e,
      isWorkshop,
      price,
      nbParticipant: e.userCurrent,
      nbMax: e.userMax,
      participations: e.participations,
      provider: e.pdt_provider.adress
    }
  }).reverse()
}
function formatDate (date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}
