import Vue from 'vue'
import { parse } from 'cookie'
import colorSchemeComponent from './color-scheme'
const cookieKey = 'nuxt-color-mode'

Vue.component('ColorScheme', colorSchemeComponent)

export default function (ctx, inject) {
  let preference = 'system'

  // Try to read from cookies
  if (ctx.req) {
    // Check if cookie exist, otherwise TypeError: argument str must be a string
    const cookies = parse(ctx.req.headers.cookie || '')
    if (cookies[cookieKey]) {
      preference = cookies[cookieKey]
    }
  }

  const colorMode = {
    preference,
    value: preference,
    unknown: process.static || !ctx.req || preference === 'system'
  }

  ctx.beforeNuxtRender(({ nuxtState }) => {
    nuxtState.colorMode = colorMode
  })

  inject('colorMode', colorMode)
}
