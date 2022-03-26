import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    token: ''
  },
  mutations: {
    SAVEUSERINFO(state, info) {
      state.userInfo = info.userInfo
      state.token = info.token
      localStorage.setItem('token',info.token)
      localStorage.setItem('userInfo',JSON.stringify(info.userInfo))
    },
  },
  actions: {
    saveUserInfo({commit}, info) {
      commit('SAVEUSERINFO',info)
    },
  },
  modules: {
  }
})
