import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2d58e376 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _11855010 = () => interopDefault(import('../pages/confirm.vue' /* webpackChunkName: "pages/confirm" */))
const _004bad74 = () => interopDefault(import('../pages/discussions/index.vue' /* webpackChunkName: "pages/discussions/index" */))
const _626847a4 = () => interopDefault(import('../pages/my.vue' /* webpackChunkName: "pages/my" */))
const _2565433e = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _c02d4788 = () => interopDefault(import('../pages/proposals/index.vue' /* webpackChunkName: "pages/proposals/index" */))
const _6ecd2524 = () => interopDefault(import('../pages/role.vue' /* webpackChunkName: "pages/role" */))
const _d4354aca = () => interopDefault(import('../pages/settings.vue' /* webpackChunkName: "pages/settings" */))
const _0c7f9e51 = () => interopDefault(import('../pages/show-profile.vue' /* webpackChunkName: "pages/show-profile" */))
const _47b6d1ed = () => interopDefault(import('../pages/sign-in.vue' /* webpackChunkName: "pages/sign-in" */))
const _5c4d2863 = () => interopDefault(import('../pages/sign-up.vue' /* webpackChunkName: "pages/sign-up" */))
const _fce2211e = () => interopDefault(import('../pages/wallet.vue' /* webpackChunkName: "pages/wallet" */))
const _0e01f927 = () => interopDefault(import('../pages/proposals/_id/index.vue' /* webpackChunkName: "pages/proposals/_id/index" */))
const _090b690a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _2d58e376,
    name: "about"
  }, {
    path: "/confirm",
    component: _11855010,
    name: "confirm"
  }, {
    path: "/discussions",
    component: _004bad74,
    name: "discussions"
  }, {
    path: "/my",
    component: _626847a4,
    name: "my"
  }, {
    path: "/profile",
    component: _2565433e,
    name: "profile"
  }, {
    path: "/proposals",
    component: _c02d4788,
    name: "proposals"
  }, {
    path: "/role",
    component: _6ecd2524,
    name: "role"
  }, {
    path: "/settings",
    component: _d4354aca,
    name: "settings"
  }, {
    path: "/show-profile",
    component: _0c7f9e51,
    name: "show-profile"
  }, {
    path: "/sign-in",
    component: _47b6d1ed,
    name: "sign-in"
  }, {
    path: "/sign-up",
    component: _5c4d2863,
    name: "sign-up"
  }, {
    path: "/wallet",
    component: _fce2211e,
    name: "wallet"
  }, {
    path: "/proposals/:id",
    component: _0e01f927,
    name: "proposals-id"
  }, {
    path: "/",
    component: _090b690a,
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
