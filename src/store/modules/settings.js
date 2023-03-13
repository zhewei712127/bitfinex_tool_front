import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { getRedirect, setRedirect } from '@/utils/auth'
import { removeRedirect } from '../../utils/auth'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  redirect: getRedirect()
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_REDIRECT: (state, redirect) => {
    state.redirect = redirect
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  redirect({ commit }, redirect) {
    return new Promise(() => {
      setRedirect(redirect)
      commit('SET_REDIRECT', redirect)
    })
  },
  resetRedirect({ commit }) {
    return new Promise(resolve => {
      commit('SET_REDIRECT', '')
      removeRedirect()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

