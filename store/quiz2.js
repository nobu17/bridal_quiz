import FirebaseQuizClient from '../lib/FirebaseQuizClient'

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
  }
}

export const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  setUserAnswers(state, userAnswers) {
    state.userAnswers = userAnswers
  },
  incrementQuestion(state) {
    console.log('incrementQuestion')
    state.currentQuestionIndex++
  },
  initAllUserAnswer(state, questions) {
    state.allUserAnswers = questions.map(q => q.selections.map(s => 0))
    console.log('state.allUserAnswers', state.allUserAnswers)
  },
  calcUpUserAnswer(state, answer) {
    console.log('calcUpUserAnswer', answer)
    if (state.allUserAnswers[answer.questionIndex]) {
      state.allUserAnswers[answer.questionIndex][answer.answerIndex] =
        state.allUserAnswers[answer.questionIndex][answer.answerIndex] + 1
      // state.allUserAnswers = JSON.parse(JSON.stringify(state.allUserAnswers))
    }
    console.log('after calcUpUserAnswer', state.allUserAnswers)
  }
}

const quizClient = new FirebaseQuizClient()

export const actions = {
  async readQuestions({ commit }, { groupId, user }) {
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
    // 回答状況の初期化と監視
    commit('initAllUserAnswer', questions)
    quizClient.listenUserAnswers(groupId, answer => {
      commit('calcUpUserAnswer', answer)
    })
    console.log('initedAnswer', uAnswers)
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
      await quizClient.countUpUserScore(user.id, groupId)
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
