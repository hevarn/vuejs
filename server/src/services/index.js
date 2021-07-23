import users from './users'
import countries from './countries'
import weightunities from './weight-unities'
import types from './types'
import varieties from './varieties'
import providers from './providers'
import products from './products'
import categories from './categories'
import distances from './distances'
import kinds from './kinds'
import cart from './cart'
import references from './references'
import payment from './payment'
import buyhistory from './buy-history'
import sellhistory from './sell-history'
import orderProvider from './order-provider'
import stocks from './stocks'
import siteGroupings from './site-groupings'
import kulteurStocks from './kulteur-stocks'
import stocksActions from './actions-stocks'
import mailer from './mailer'
import authmanagement from './authmanagement'
import authentication from './authentication'
import press from './press'
import couponsStripe from './couponsStripe'
import favoritProducts from './favorit-products'
import stripeHook from './stripeHook'
import paymentMethods from './paymentMethods'
import refund from './refund'
import setting from './setting'
import orderInfo from './orderInfo'
import workshops from './workshops'
import participations from './participations'
import events from './events'
import market from './market'
import marketEvents from './marketEvents'

export default function (app) {
  app.configure(authentication)
  app.configure(categories)
  app.configure(users)
  app.configure(countries)
  app.configure(weightunities)
  app.configure(types)
  app.configure(varieties)
  app.configure(providers)
  app.configure(products)
  app.configure(distances)
  app.configure(kinds)
  app.configure(cart)
  app.configure(references)
  app.configure(payment)
  app.configure(buyhistory)
  app.configure(sellhistory)
  app.configure(orderProvider)
  app.configure(stocks)
  app.configure(couponsStripe)
  app.configure(siteGroupings)
  app.configure(kulteurStocks)
  app.configure(stocksActions)
  app.configure(mailer)
  app.configure(authmanagement)
  app.configure(press)
  app.configure(favoritProducts)
  app.configure(stripeHook)
  app.configure(paymentMethods)
  app.configure(refund)
  app.configure(setting)
  app.configure(orderInfo)
  app.configure(workshops)
  app.configure(participations)
  app.configure(events)
  app.configure(market)
  app.configure(marketEvents)
}
