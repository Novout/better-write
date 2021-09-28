import { Store, useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Callback } from '@/types/utils'
import { usePDF } from './pdf'
import { useFormat } from './format'

const global: Callback<Store<any>, void> = (store: Store<any>) => {
  let _log = console.log,
    _warn = console.warn,
    _error = console.error,
    _info = console.info

  console.log = function () {
    store.commit('logger/add', {
      type: 'system',
      method: 'log',
      arguments,
      createdAt: useFormat().actually(),
    })
    return _log.apply(console, arguments as any)
  }

  console.warn = function () {
    store.commit('logger/add', {
      type: 'system',
      method: 'warn',
      arguments,
      createdAt: useFormat().actually(),
    })
    return _warn.apply(console, arguments as any)
  }

  console.error = function () {
    store.commit('logger/add', {
      type: 'system',
      method: 'error',
      arguments,
      createdAt: useFormat().actually(),
    })
    return _error.apply(console, arguments as any)
  }

  console.info = function () {
    store.commit('logger/add', {
      type: 'system',
      method: 'info',
      arguments,
      createdAt: useFormat().actually(),
    })
    return _info.apply(console, arguments as any)
  }
}

const darkSet: Callback<Store<any>, void> = (store: Store<any>) => {
  const dark = localStorage.getItem('theme')

  dark
    ? (document.querySelector('html') as HTMLElement).classList.add('dark')
    : (document.querySelector('html') as HTMLElement).classList.remove('dark')

  store.commit('editor/switchTheme', dark ? true : false)
}

const langSet: Callback<Store<any>, void> = (store: Store<any>) => {
  const { locale } = useI18n()
  const lang = localStorage.getItem('lang')

  lang === 'br' ? (locale.value = 'br') : (locale.value = 'en')

  lang === 'br'
    ? ((document.querySelector('html') as HTMLElement).lang = 'pt-BR')
    : ((document.querySelector('html') as HTMLElement).lang = 'en-US')
}

export const useStart: Callback<void> = () => {
  const store = useStore()

  const init = () => {
    global(store)
    darkSet(store)
    langSet(store)
    usePDF().init()
  }

  return { init }
}
