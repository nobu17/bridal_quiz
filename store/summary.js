import SummaryClient from '../lib/summaryClient'

export const state = () => ({
  userScores: []
})

export const getters = {
  userScores(state) {
    return state.userScores
  }
}

export const mutations = {
  setUserScores(state, userScores) {
    state.userScores = userScores
  }
}

const summaryClinet = new SummaryClient()

export const actions = {
  async readScores({ commit }, { groupId }) {
    console.log('readScore')
    const scores = await summaryClinet.readUserScores(groupId)
    console.log('readScore end', scores)
    commit('setUserScores', scores)
  }
}
