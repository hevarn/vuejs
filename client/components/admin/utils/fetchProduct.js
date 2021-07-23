import { productsService } from '@/api'
import DisplayedProduct from '@/components/DisplayedProduct'

export async function fetchProducts (query, store) {
  store.commit('admin/launchLoadingPage')
  const data = await productsService.find(query)
  setTimeout(() => store.commit('admin/removeLoadingPage'), 100)
  return data.map(element => new DisplayedProduct(element))
}
