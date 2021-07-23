export const PAGES = Object.freeze({
  DASHBOARD: '/admin/dashboard',
  DELIVERIES: '/admin/deliveries',
  ADMINORDERS: '/admin/orders',
  PRODUCTS: '/admin/products',
  REFERENCES: '/admin/references',
  SETTING: '/admin/setting',
  UPDATE: '/admin/updateReferences',
  VARIETY: '/admin/varietyManager',

  KULPTEUR: '/admin/kulpteur',

  COMMUNITY: '/user/community',
  ITEMS: '/user/items',
  WORKSHOPS: '/user/workshops',
  USERORDERS: '/user/orders',

  ACCEUIL: '/',
  LOGIN: '/login',
  CONTACT: '/contact',
  INSCRIPTION: '/account',
  MARKET: '/market'
})

function pageToRank (page, rank) {
  switch (page) {
    case PAGES.DASHBOARD:
    case PAGES.DELIVERIES:
    case PAGES.ADMINORDERS:
    case PAGES.PRODUCTS:
    case PAGES.REFERENCES:
    case PAGES.SETTING:
    case PAGES.UPDATE:
    case PAGES.VARIETY:
      return 'admin'
    case PAGES.COMMUNITY:
    case PAGES.ITEMS:
    case PAGES.WORKSHOPS:
    case PAGES.USERORDERS:
      return 'user'
    case PAGES.KULPTEUR:
      return 'kulteur'
    default:
      return rank
  }
}

export function isNotRankEnough (rank, path) {
  return rank === pageToRank(path, rank)
}
