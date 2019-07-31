import FirebaseQuizClient from '../lib/FirebaseQuizClient'
import FirebaseScoreClient from '../lib/firebaseScoreClient'

export const state = () => ({
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  allUserAnswers: [] // index:quizindex selectionCount [[0,0,0,0],[0,1,0,1]]
})

export const getters = {
  questions(state) {
    return state.questions
  },
  currentQuestionIndex(state) {
    return state.currentQuestionIndex
  },
  userAnswers(state) {
    return state.userAnswers
  },
  allUserAnswers(state) {
    return state.allUserAnswers
  },
  isLastQuestion(state) {
    const next = state.currentQuestionIndex + 1
    if (!state.questions[next]) {
      return true
    }
    return false
  }
}

export const mutations = {
  initAllData(state) {
    state.questions = []
    state.currentQuestionIndex = 0
    state.userAnswers = []
    state.allUserAnswers = []
  },
  setQuestions(state, questions) {
    state.questions = questions
  },
  setUserAnswers(state, userAnswers) {
    state.userAnswers = userAnswers
  },
  incrementQuestion(state) {
    state.currentQuestionIndex++
  },
  initAllUserAnswer(state, questions) {
    state.allUserAnswers = questions.map(q => q.selections.map(s => 0))
  }
}

const quizClient = new FirebaseQuizClient()
const scoreClient = new FirebaseScoreClient()

export const actions = {
  async readQuestions({ commit }, { groupId, user }) {
    commit('initAllData')
    // 問題読み込み
    const questions = await quizClient.readQuestion(groupId)
    console.log('questions', questions)
    // 回答状況読み込み
    const uAnswers = await quizClient.readUserAnswers(user.id, groupId)
    // 未回答部分を初期化
    questions.forEach((q, index) => {
      if (!uAnswers.answers[index]) {
        uAnswers.answers.push({ answerIndex: -1, memo: '' })
      }
    })
    // ユーザスコアが無ければ作成
    await scoreClient.initUserScore(user.id, user.name, groupId, false)
    commit('setUserAnswers', uAnswers.answers)
    commit('setQuestions', questions)
  },
  async answerQuestion(
    { state, dispatch },
    { user, groupId, quizIndex, answer }
  ) {
    console.log('send Answers', { user, groupId, quizIndex, answer })
    // 正解であればカウントアップ
    if (
      state.questions[state.currentQuestionIndex].answer_index ===
      answer.answerIndex
    ) {
      console.log('count up st')
      await scoreClient.countUpUserScore(user.id, user.name, groupId)
      console.log('count up end')
    }
    // 更新
    await quizClient.addUserAnswer({
      userId: user.id,
      groupId: groupId,
      questionIndex: state.currentQuestionIndex,
      answerIndex: answer.answerIndex,
      memo: answer.memo
    })
    await dispatch('loadUserAnsers', { userId: user.id, groupId: groupId })
  },
  async loadUserAnsers({ commit, state }, { userId, groupId }) {
    console.log('loadUserAnsers', { userId, groupId })
    const uAnswers = await quizClient.readUserAnswers(userId, groupId)
    // 未回答部分を初期化
    state.questions.forEach((q, index) => {
      if (!uAnswers.answers[index]) {
        uAnswers.answers.push({ answerIndex: -1, memo: '' })
      }
    })
    console.log('loadUserAnsers end', uAnswers)
    commit('setUserAnswers', uAnswers.answers)
  }
}
