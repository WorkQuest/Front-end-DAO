import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2a64fd1b = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _39ae694e = () => interopDefault(import('../pages/confirm.vue' /* webpackChunkName: "pages/confirm" */))
const _2cc98ee4 = () => interopDefault(import('../pages/my.vue' /* webpackChunkName: "pages/my" */))
const _2fbe6fb7 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _3bb6b792 = () => interopDefault(import('../pages/proposals/index.vue' /* webpackChunkName: "pages/proposals/index" */))
const _4ed3cbd8 = () => interopDefault(import('../pages/role.vue' /* webpackChunkName: "pages/role" */))
const _bcd317f6 = () => interopDefault(import('../pages/settings.vue' /* webpackChunkName: "pages/settings" */))
const _3dd1f2bb = () => interopDefault(import('../pages/show-profile.vue' /* webpackChunkName: "pages/show-profile" */))
const _ebb0397a = () => interopDefault(import('../pages/sign-in.vue' /* webpackChunkName: "pages/sign-in" */))
const _c2838c8e = () => interopDefault(import('../pages/sign-up.vue' /* webpackChunkName: "pages/sign-up" */))
const _62ab5b5b = () => interopDefault(import('../pages/wallet.vue' /* webpackChunkName: "pages/wallet" */))
const _0265b97d = () => interopDefault(import('../pages/proposals/_id/index.vue' /* webpackChunkName: "pages/proposals/_id/index" */))
const _4a1cd7e0 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _2a64fd1b,
    name: "about"
  }, {
    path: "/confirm",
    component: _39ae694e,
    name: "confirm"
  }, {
    path: "/my",
    component: _2cc98ee4,
    name: "my"
  }, {
    path: "/profile",
    component: _2fbe6fb7,
    name: "profile"
  }, {
    path: "/proposals",
    component: _3bb6b792,
    name: "proposals"
  }, {
    path: "/role",
    component: _4ed3cbd8,
    name: "role"
  }, {
    path: "/settings",
    component: _bcd317f6,
    name: "settings"
  }, {
    path: "/show-profile",
    component: _3dd1f2bb,
    name: "show-profile"
  }, {
    path: "/sign-in",
    component: _ebb0397a,
    name: "sign-in"
  }, {
    path: "/sign-up",
    component: _c2838c8e,
    name: "sign-up"
  }, {
    path: "/wallet",
    component: _62ab5b5b,
    name: "wallet"
  }, {
    path: "/proposals/:id",
    component: _0265b97d,
    name: "proposals-id"
  }, {
    path: "/",
    component: _4a1cd7e0,
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
