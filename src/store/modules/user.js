import { getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  id: 0,
  token: getToken(),
  name: '',
  email: '',
  avatar: '',
  introduction: '',
  roles: [],
  connection_id: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CONNECTION_ID: (state, connection_id) => {
    state.connection_id = connection_id
  }
}

const actions = {
  // user login
  login({ commit }, jwt) {
    return new Promise(() => {
      setToken(jwt)
      commit('SET_TOKEN', jwt)
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data.user) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_ID', data.user.id)
        commit('SET_ROLES', data.user.is_admin ? ['admin'] : ['user'])
        commit('SET_NAME', data.user.name)
        commit('SET_EMAIL', data.user.email)
        commit('SET_AVATAR', '')
        commit('SET_INTRODUCTION', 'none')
        commit('SET_CONNECTION_ID', data.user.connection_id)
        resolve(data.user)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_CONNECTION_ID', 0)
    removeToken()
    resetRouter()

    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_CONNECTION_ID', 0)
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
