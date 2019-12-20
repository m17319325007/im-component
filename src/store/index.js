import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import blacklist from './modules/blacklist'
import {
  Message
} from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: undefined
  },
  mutations: {
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || 'success',
        duration: options.duration || 2000,
        offset: 40
      })
    }
  },
  actions: {},
  modules: {
    user,
    blacklist
  }
})
