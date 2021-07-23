import { makeAuthPlugin } from '~/plugins/feathers'

const auth = makeAuthPlugin({
  userService: 'users',
  state: {
    publicPages: [
      'login',
      'index',
      'contact',
      'press',
      'cgv',
      'forgot',
      'reset',
      'register',
      'verify',
      'market'
    ]
  }
})

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

export const state = () => ({
  accessToken: undefined, // The JWT
  payload: undefined, // The JWT payload

  userService: null, // Specify the userService to automatically populate the user upon login.
  entityIdField: 'userId', // The property in the payload storing the user id
  responseEntityField: 'user', // The property in the payload storing the user
  // user: null, // Deprecated: This is no longer reactive, so use the `user` getter. See below.

  isAuthenticatePending: false,
  isLogoutPending: false,

  errorOnAuthenticate: undefined,
  errorOnLogout: undefined
})

export const mutations = {
  // Your custom mutations
}

export const actions = {
  async nuxtClientInit ({ state, dispatch }) {
    // Run the authentication with the access token hydrated from the server store
    try {
      // IF not auth in store && got a token
      if (
        !state.auth.payload &&
        window.localStorage.getItem('1-m!!mùpk_sq(a_or-0O_o@fqsgrk;4u')
      ) {
        // Try to reauth with jwt token in localstorage
        await dispatch('auth/authenticate')
      }
      if (state.auth.user.stripeCustomerId && state.auth.user.isUser) {
        // await dispatch('cart/fetchCart')
      }
    } catch (e) {
      // handle error like a boss
      if (e.code === 401) {
        // if you ever get an unauthorized, logout the user
        this.$router.push('/')
        setTimeout(() => {
          dispatch('auth/logout')
        }, 500)
      }
    }
  }
}

export const getters = {
  // Your custom getters
}

export const plugins = [...servicePlugins, auth]
