import { isNotRankEnough } from '@/api/auth'

export default async function ({ store, redirect, route }) {
  const { auth, admin } = store.state
  try {
    if (auth.publicPages.includes(route.name)) {
      return
    }
    if (auth.user && auth.user.isAdmin && admin.providers.length === 0) {
      await store.dispatch('admin/fetchSettings', 3)
    }
    if (
      !isNotRankEnough(auth.payload.user.rank, route.path) ||
      !auth.payload.user.isVerified
    ) {
      redirect('/')
    }
    if (auth.user && auth.user.isUser) {
      await store.dispatch('cart/fetchCart')
    }
  } catch (e) {
    if (!auth.publicPages.includes(route.name)) {
      redirect('/')
    }
  }
}
