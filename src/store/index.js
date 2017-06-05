import Vue from 'vue'
import Vuex from 'vuex'
const Bluebird = require('bluebird')
import {loginUser, getCurrentToken, getCurrentUser, getCurrentRole, changePassword} from '../api/auth'
import {
  USER_LOGIN,
  USER_LOGOUT,
  RETRIVE_USER,
  SHOW_ROUTER,
  UPDATE_ROLE,
  UPDATE_USERNAME,
  CHANGE_PASS
} from './mutation_types'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: 0,
    showRouter: false,
    role: '-1',
    username: '游客'
  },

  actions: {
    [USER_LOGIN]: async({
      commit
    }, payload) => {
      const [err,
        result,
        role] = await loginUser(payload)

      return new Bluebird((resolve, reject) => {
        if (err) {
          return reject(err)
        }
        commit(USER_LOGIN, result),
        commit(UPDATE_ROLE, role)
        commit(UPDATE_USERNAME, payload.username)
        return resolve([0, result, role])
      })
    },
    [CHANGE_PASS]: async({
      commit
    }, payload) => {
      const [err,
        result] = await changePassword(payload)

      return new Bluebird((resolve, reject) => {
        if (err) {
          return reject(err)
        }
        commit(CHANGE_PASS, result)
        return resolve([0, result])
      })
    },

    [UPDATE_ROLE]: ({
      commit
    }, payload) => {
      commit(UPDATE_ROLE, payload)
    },
    [RETRIVE_USER]: async({
      commit
    }, payload) => {
      const [err,
        result,
        role,
        username] = await getCurrentToken(payload)
      return new Bluebird((resolve, reject) => {
        if (err) {
          return reject(err)
        }
        commit(RETRIVE_USER, result)
        commit(UPDATE_USERNAME, username)
        commit(UPDATE_ROLE, role)
        return resolve([0, result])
      })
    },
    [SHOW_ROUTER]: ({
      commit
    }, payload) => {
      commit(SHOW_ROUTER, payload)
    },
    [UPDATE_USERNAME]: ({
      commit
    }, payload) => {
      commit(UPDATE_USERNAME, payload)
    },
    [USER_LOGOUT]: ({
      commit
    }, payload) => {
      commit(USER_LOGOUT, payload)
    }
  },
  mutations: {
    [USER_LOGIN]: (state, payload) => {
      state.token = payload
    },
    [UPDATE_ROLE]: (state, payload) => {
      state.role = payload
    },
    [RETRIVE_USER]: (state, payload) => {
      state.token = payload
    },
    [SHOW_ROUTER]: (state, payload) => {
      state.showRouter = true
    },
    [UPDATE_USERNAME]: (state, payload) => {
      state.username = payload
    },
    [USER_LOGOUT]: (state, payload) => {
      state.username = '游客'
    },
    [CHANGE_PASS]: (state, payload) => {
      state.username = '游客'
      state.token = ''
      state.role = '-1'
    }

  },
  getters: {
    getCurrentToken: (state, getters) => {
      console.log("getCurrentUser:", getCurrentUser(), state.token);
      return getCurrentUser() && state.token
    },
    isRouterActive: (state, getters) => {
      return state.showRouter
    }
  }
})
