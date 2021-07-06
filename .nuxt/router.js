import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _56b62c14 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _53a68b69 = () => interopDefault(import('../pages/confirm.vue' /* webpackChunkName: "pages/confirm" */))
const _64d21cda = () => interopDefault(import('../pages/my.vue' /* webpackChunkName: "pages/my" */))
const _49b691d2 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _d0b6e2a6 = () => interopDefault(import('../pages/proposals/index.vue' /* webpackChunkName: "pages/proposals/index" */))
const _22c5579d = () => interopDefault(import('../pages/role.vue' /* webpackChunkName: "pages/role" */))
const _72bad56c = () => interopDefault(import('../pages/settings.vue' /* webpackChunkName: "pages/settings" */))
const _5c9c2d00 = () => interopDefault(import('../pages/show-profile.vue' /* webpackChunkName: "pages/show-profile" */))
const _b7bff544 = () => interopDefault(import('../pages/sign-in.vue' /* webpackChunkName: "pages/sign-in" */))
const _8e934858 = () => interopDefault(import('../pages/sign-up.vue' /* webpackChunkName: "pages/sign-up" */))
const _006909e0 = () => interopDefault(import('../pages/wallet.vue' /* webpackChunkName: "pages/wallet" */))
const _770c8b18 = () => interopDefault(import('../pages/proposals/_id/index.vue' /* webpackChunkName: "pages/proposals/_id/index" */))
const _1746768a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _56b62c14,
    name: "about"
  }, {
    path: "/confirm",
    component: _53a68b69,
    name: "confirm"
  }, {
    path: "/my",
    component: _64d21cda,
    name: "my"
  }, {
    path: "/profile",
    component: _49b691d2,
    name: "profile"
  }, {
    path: "/proposals",
    component: _d0b6e2a6,
    name: "proposals"
  }, {
    path: "/role",
    component: _22c5579d,
    name: "role"
  }, {
    path: "/settings",
    component: _72bad56c,
    name: "settings"
  }, {
    path: "/show-profile",
    component: _5c9c2d00,
    name: "show-profile"
  }, {
    path: "/sign-in",
    component: _b7bff544,
    name: "sign-in"
  }, {
    path: "/sign-up",
    component: _8e934858,
    name: "sign-up"
  }, {
    path: "/wallet",
    component: _006909e0,
    name: "wallet"
  }, {
    path: "/proposals/:id",
    component: _770c8b18,
    name: "proposals-id"
  }, {
    path: "/",
    component: _1746768a,
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
