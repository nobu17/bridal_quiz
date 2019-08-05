import UserClient from '../lib/userClient'

export const state = () => ({
  user: { id: '', name: '' },
  settings: null
})

export const getters = {
  user(state) {
    return state.user
  },
  settings(state) {
    return state.settings
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setSettings(state, settings) {
    state.settings = settings
  },
  initUser(state) {
    state.user = { id: '', name: '' }
  }
}

const userClient = new UserClient()
export const actions = {
  async addUser({ commit }, { user }) {
    console.log('user', user)
    const added = await userClient.addUser(user)
    commit('setUser', added)
    console.log('added', added)
  },
  async deleteUser({ commit }, { user }) {
    console.log('user', user)
    await userClient.deleteUser(user)
    commit('initUser')
    console.log('delend')
  }
}
