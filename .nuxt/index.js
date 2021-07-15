import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_plugin_0dabc8a8 from 'nuxt_plugin_plugin_0dabc8a8' // Source: ./components/plugin.js (mode: 'all')
import nuxt_plugin_bootstrapvue_bb882026 from 'nuxt_plugin_bootstrapvue_bb882026' // Source: ./bootstrap-vue.js (mode: 'all')
import nuxt_plugin_nuxtgooglemaps_4e0ebb4e from 'nuxt_plugin_nuxtgooglemaps_4e0ebb4e' // Source: ./nuxt-google-maps.js (mode: 'all')
import nuxt_plugin_cookieuniversalnuxt_32c61366 from 'nuxt_plugin_cookieuniversalnuxt_32c61366' // Source: ./cookie-universal-nuxt.js (mode: 'all')
import nuxt_plugin_pluginrouting_25356448 from 'nuxt_plugin_pluginrouting_25356448' // Source: ./nuxt-i18n/plugin.routing.js (mode: 'all')
import nuxt_plugin_pluginmain_e701a7b2 from 'nuxt_plugin_pluginmain_e701a7b2' // Source: ./nuxt-i18n/plugin.main.js (mode: 'all')
import nuxt_plugin_axios_e210a084 from 'nuxt_plugin_axios_e210a084' // Source: ./axios.js (mode: 'all')
import nuxt_plugin_pluginserver_30bdc1be from 'nuxt_plugin_pluginserver_30bdc1be' // Source: ./color-mode/plugin.server.js (mode: 'server')
import nuxt_plugin_pluginclient_69f75f94 from 'nuxt_plugin_pluginclient_69f75f94' // Source: ./color-mode/plugin.client.js (mode: 'client')
import nuxt_plugin_axios_4c69ee5a from 'nuxt_plugin_axios_4c69ee5a' // Source: ../plugins/axios.js (mode: 'all')
import nuxt_plugin_main_6ec719e5 from 'nuxt_plugin_main_6ec719e5' // Source: ../plugins/main.js (mode: 'all')
import nuxt_plugin_veevalidate_371c5eb1 from 'nuxt_plugin_veevalidate_371c5eb1' // Source: ../plugins/vee-validate.js (mode: 'all')
import nuxt_plugin_clipboard_30ec14ba from 'nuxt_plugin_clipboard_30ec14ba' // Source: ../plugins/clipboard.js (mode: 'all')
import nuxt_plugin_injectComponents_aff82a52 from 'nuxt_plugin_injectComponents_aff82a52' // Source: ../plugins/injectComponents.js (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root.$options.$nuxt
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":true,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext, config)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"WorkQuest","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Decentralized marketplace for work. Where employers can look for performers for different tasks, and workers perform. Work in any field with different deadlines, interactions occur through smart contracts."}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Fimg\u002Fapp\u002Ffavicon.svg"}],"style":[],"script":[{"hid":"nuxt-color-mode-script","innerHTML":"!function(){\"use strict\";var e=window,s=document,t=s.documentElement,n=[\"dark\",\"light\"],o=function(e){for(var t=e+\"=\",n=s.cookie.split(\";\"),o=0;o\u003Cn.length;o++){for(var a=n[o];\" \"===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t))return a.substring(t.length,a.length)}return null}(\"nuxt-color-mode\")||\"system\",a=\"system\"===o?c():o;function i(e){var s=\"\"+e+\"-mode\";t.classList?t.classList.add(s):t.className+=\" \"+s}function r(s){return e.matchMedia(\"(prefers-color-scheme\"+s+\")\")}function c(){if(e.matchMedia&&\"not all\"!==r(\"\").media)for(var s of n)if(r(\":\"+s).matches)return s;return\"light\"}i(a),e[\"__NUXT_COLOR_MODE__\"]={preference:o,value:a,getColorScheme:c,addClass:i,removeClass:function(e){var s=\"\"+e+\"-mode\";t.classList?t.classList.remove(s):t.className=t.className.replace(new RegExp(s,\"g\"),\"\")}}}();\n","pbody":true}],"__dangerouslyDisableSanitizersByTagID":{"nuxt-color-mode-script":["innerHTML"]}},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_plugin_0dabc8a8 === 'function') {
    await nuxt_plugin_plugin_0dabc8a8(app.context, inject)
  }

  if (typeof nuxt_plugin_bootstrapvue_bb882026 === 'function') {
    await nuxt_plugin_bootstrapvue_bb882026(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxtgooglemaps_4e0ebb4e === 'function') {
    await nuxt_plugin_nuxtgooglemaps_4e0ebb4e(app.context, inject)
  }

  if (typeof nuxt_plugin_cookieuniversalnuxt_32c61366 === 'function') {
    await nuxt_plugin_cookieuniversalnuxt_32c61366(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginrouting_25356448 === 'function') {
    await nuxt_plugin_pluginrouting_25356448(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginmain_e701a7b2 === 'function') {
    await nuxt_plugin_pluginmain_e701a7b2(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_e210a084 === 'function') {
    await nuxt_plugin_axios_e210a084(app.context, inject)
  }

  if (process.server && typeof nuxt_plugin_pluginserver_30bdc1be === 'function') {
    await nuxt_plugin_pluginserver_30bdc1be(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_pluginclient_69f75f94 === 'function') {
    await nuxt_plugin_pluginclient_69f75f94(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_4c69ee5a === 'function') {
    await nuxt_plugin_axios_4c69ee5a(app.context, inject)
  }

  if (typeof nuxt_plugin_main_6ec719e5 === 'function') {
    await nuxt_plugin_main_6ec719e5(app.context, inject)
  }

  if (typeof nuxt_plugin_veevalidate_371c5eb1 === 'function') {
    await nuxt_plugin_veevalidate_371c5eb1(app.context, inject)
  }

  if (typeof nuxt_plugin_clipboard_30ec14ba === 'function') {
    await nuxt_plugin_clipboard_30ec14ba(app.context, inject)
  }

  if (typeof nuxt_plugin_injectComponents_aff82a52 === 'function') {
    await nuxt_plugin_injectComponents_aff82a52(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    const { route } = router.resolve(app.context.route.fullPath)
    // Ignore 404s rather than blindly replacing URL
    if (!route.matched.length && process.client) {
      return resolve()
    }
    router.replace(route, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
