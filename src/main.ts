import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { PluginEmitter } from './types/plugin/core'
import { VueEmitter } from './types/emitter'
import { plugin as PluginBase } from './types/plugin/emitter'
import { MotionPlugin as motion } from '@vueuse/motion'
import vfmPlugin from 'vue-final-modal'
import Toast, { POSITION } from 'vue-toastification'
import mitt from 'mitt'

import router from './router'
import i18n from './lang'

import App from './App.vue'

import './preset.css'
import './tailwind.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const head = createHead()
const store = createPinia()

const emitter = mitt()
const plugin = PluginBase()

app.config.globalProperties.emitter = emitter as VueEmitter
app.config.globalProperties.plugin = plugin as PluginEmitter

app.use(router)
app.use(store)
app.use(i18n)
app.use(motion)
app.use(head)
app.use(vfmPlugin)
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 4000,
  maxToasts: 3,
})

router.isReady().then(() => app.mount('#app'))
