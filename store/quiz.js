import FirebaseQuizClient from '../lib/FirebaseQuizClient'

export const state = () => ({
  user: { name: '' },
  questions: [],
  currentQuestion: null
})

export const getters = {
  user(state) {
    return state.user
  },
  currentQuestion(state) {
    return state.currentQuestion
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setCurrentQuestion(state, currentQuestion) {
    state.currentQuestion = currentQuestion
  },
  setQuestions(state, questions) {
    state.questions = questions
  }
}

const quizClient = new FirebaseQuizClient()
export const actions = {
  async readQuestions({ commit }, { groupId }) {
    console.log('groupId', groupId)
    const questions = await quizClient.readQuestion(groupId)
    console.log('questions', questions)
    commit('setQuestions', questions)
    commit('setCurrentQuestion', questions[0])
  }
}
