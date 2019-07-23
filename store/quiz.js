import FirebaseQuizClient from '../lib/FirebaseQuizClient'

export const state = () => ({
  questions: [],
  answers: []
})

export const getters = {
  questions(state) {
    return state.questions
  },
  answers(state) {
    return state.answers
  }
}

export const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  setAnswers(state, answers) {
    state.answers = answers
  },
  updateAnswer(state, { questionNo, answerNo, memo }) {
    state.answers[questionNo - 1].answerNo = answerNo
    state.answers[questionNo - 1].memo = memo
  }
}

const quizClient = new FirebaseQuizClient()
export const actions = {
  async readQuestions({ commit }, { groupId, user }) {
    console.log('groupId', groupId)
    // 問題読み込み
    const questions = await quizClient.readQuestion(groupId)
    console.log('questions', questions)
    // 回答初期化
    const answers = questions.map(x => ({ answerNo: 0, memo: '' }))
    // 回答状況読み込み
    // const answers = await quizClient.readUserAnswers(user.id, groupId)
    console.log('answers', answers)
    // 回答済みはスキップ
    // const currentQuestion = quizUtil.getNextQuestion(questions, answers)
    // console.log('currentQuestion', currentQuestion)
    // commit('setUser', user)
    commit('setAnswers', answers)
    commit('setQuestions', questions)
  },
  async answerQuestions({ commit, state }, { userId, groupId, answers }) {
    console.log('send Answers', { userId, groupId, answers })
    await quizClient.addAnsewers(userId, groupId, answers)
  },
  async answer({ commit, state }, { answerNo, memo }) {
    const q = state.currentQuestion
    console.log('q', q)
    await quizClient.addAnswer({
      userId: state.user.id,
      groupId: q.group_id,
      questionNo: q.question_no,
      answerNo: answerNo,
      memo: memo
    })
  }
}
