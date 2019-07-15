import UserClient from '../lib/UserClient'

export const state = () => ({
  user: { name: '' }
})

export const getters = {
  user(state) {
    return state.user
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

const userClient = new UserClient()
export const actions = {
  async addUser({ commit }, { user }) {
    console.log('user', user)
    const added = await userClient.addUser(user)
    console.log('added', added)
  }
}
