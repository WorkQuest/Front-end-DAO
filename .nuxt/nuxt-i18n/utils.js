import { localeMessages, options } from './options'
import { formatMessage } from './utils-common'

/**
 * Asynchronously load messages from translation files
 *
 * @param {import('@nuxt/types').Context} context
 * @param {string} locale Language code to load
 * @return {Promise<void>}
 */
export async function loadLanguageAsync (context, locale) {
  const { app } = context
  const { i18n } = app

  if (!i18n.loadedLanguages) {
    i18n.loadedLanguages = []
  }

  if (!i18n.loadedLanguages.includes(locale)) {
    const localeObject = options.normalizedLocales.find(l => l.code === locale)
    if (localeObject) {
      const { file } = localeObject
      if (file) {
        /*  */
      } else {
        console.warn(formatMessage(`Could not find lang file for locale ${locale}`))
      }
    } else {
      console.warn(formatMessage(`Attempted to load messages for non-existant locale code "${locale}"`))
    }
  }
}
