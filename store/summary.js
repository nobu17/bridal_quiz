import SummaryClient from '../lib/summaryClient'
import FirebaseQuizClient from '../lib/FirebaseQuizClient'

export const state = () => ({
  questions: [],
  answerSummaries: [],
  userAnswers: []
})

export const getters = {
  questions(state) {
    return state.questions
  },
  answerSummaries(state) {
    return state.answerSummaries
  },
  userAnswers(state) {
    return state.userAnswers
  }
}

export const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  setAnswerSummaries(state, answerSummaries) {
    state.answerSummaries = answerSummaries
  }
}

const quizClient = new FirebaseQuizClient()
const summaryClinet = new SummaryClient()

export const actions = {
  async readSummary({ commit }, { groupId }) {
    console.log('readSummary')
    const summary = await summaryClinet.getAnswersSummary(groupId)
    console.log('summary', summary)
    // 問題読み込み
    const questions = await quizClient.readQuestion(groupId)
    commit('setQuestions', questions)
    commit('setAnswerSummaries', summary)
  }
}
