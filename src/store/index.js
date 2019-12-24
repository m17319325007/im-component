import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import blacklist from './modules/blacklist'
import inform from './modules/inform'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    blacklist,
    inform
  }
})
