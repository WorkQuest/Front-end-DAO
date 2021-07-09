import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7594f65b = () => interopDefault(import('..\\pages\\about.vue' /* webpackChunkName: "pages/about" */))
const _78c5128e = () => interopDefault(import('..\\pages\\confirm.vue' /* webpackChunkName: "pages/confirm" */))
const _404ff5c9 = () => interopDefault(import('..\\pages\\discussions\\index.vue' /* webpackChunkName: "pages/discussions/index" */))
const _3a607164 = () => interopDefault(import('..\\pages\\my.vue' /* webpackChunkName: "pages/my" */))
const _6ed518f7 = () => interopDefault(import('..\\pages\\profile.vue' /* webpackChunkName: "pages/profile" */))
const _813bf7da = () => interopDefault(import('..\\pages\\proposals\\index.vue' /* webpackChunkName: "pages/proposals/index" */))
const _65c0aad0 = () => interopDefault(import('..\\pages\\role.vue' /* webpackChunkName: "pages/role" */))
const _4554f2c5 = () => interopDefault(import('..\\pages\\settings.vue' /* webpackChunkName: "pages/settings" */))
const _6699dd0a = () => interopDefault(import('..\\pages\\show-profile.vue' /* webpackChunkName: "pages/show-profile" */))
const _6d82e6fa = () => interopDefault(import('..\\pages\\sign-in.vue' /* webpackChunkName: "pages/sign-in" */))
const _44563a0e = () => interopDefault(import('..\\pages\\sign-up.vue' /* webpackChunkName: "pages/sign-up" */))
const _7d7a8a1b = () => interopDefault(import('..\\pages\\wallet.vue' /* webpackChunkName: "pages/wallet" */))
const _faf64632 = () => interopDefault(import('..\\pages\\proposals\\_id\\index.vue' /* webpackChunkName: "pages/proposals/_id/index" */))
const _d5665dc0 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _7594f65b,
    name: "about"
  }, {
    path: "/confirm",
    component: _78c5128e,
    name: "confirm"
  }, {
    path: "/discussions",
    component: _404ff5c9,
    name: "discussions"
  }, {
    path: "/my",
    component: _3a607164,
    name: "my"
  }, {
    path: "/profile",
    component: _6ed518f7,
    name: "profile"
  }, {
    path: "/proposals",
    component: _813bf7da,
    name: "proposals"
  }, {
    path: "/role",
    component: _65c0aad0,
    name: "role"
  }, {
    path: "/settings",
    component: _4554f2c5,
    name: "settings"
  }, {
    path: "/show-profile",
    component: _6699dd0a,
    name: "show-profile"
  }, {
    path: "/sign-in",
    component: _6d82e6fa,
    name: "sign-in"
  }, {
    path: "/sign-up",
    component: _44563a0e,
    name: "sign-up"
  }, {
    path: "/wallet",
    component: _7d7a8a1b,
    name: "wallet"
  }, {
    path: "/proposals/:id",
    component: _faf64632,
    name: "proposals-id"
  }, {
    path: "/",
    component: _d5665dc0,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
