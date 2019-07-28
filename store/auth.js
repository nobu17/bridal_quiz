import UserClient from '../lib/UserClient'

export const state = () => ({
  user: { id: '', name: '' }
})

export const getters = {
  user(state) {
    return state.user
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
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
  },
  async countUpUserScore({ state }) {
    await userClient.countUpUserScore(state.user)
  }
}
