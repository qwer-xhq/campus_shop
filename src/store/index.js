import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    SAVEUSER(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    saveUser({commit}, userInfo) {
      commit('SAVEUSER',userInfo)
    }
  },
  modules: {
  }
})
