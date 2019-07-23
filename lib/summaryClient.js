import FirebaseSummaryClient from './firebaseSummaryClient'
import FirebaseQuizClient from './firebaseQuizClient'

export default class SummaryClient {
  constructor() {
    this.repository = new FirebaseSummaryClient()
    this.qRepository = new FirebaseQuizClient()
  }

  async getAnswersSummary(groupId) {
    const answers = await this.repository.readUserAnswers(groupId)
    // 集計用に何番まであるかを把握するために問題も取得
    const questions = await this.qRepository.readQuestion(groupId)
    // 集計用データを初期化
    // [ [ {'問題1', 0 } , {'問題2', 0 }],  ]
    // { key: question_no, value: [answerno, count] }
    const summaryData = questions.reduce((res, current) => {
      const temp = []
      for (const sel of current.selections) {
        temp.push({ selection: sel, count: 0 })
      }
      res.push({ summary: temp })
      return res
    }, [])
    console.log('summaryData', summaryData)
    // 回答を集計 ユーザ別
    for (const pUser of answers) {
      // 回答
      let qNo = 0
      for (const ans of pUser.answers) {
        const currentSummary = summaryData[qNo]
        console.log('currentSummary', currentSummary)
        currentSummary.summary[ans.answerNo].count++
        qNo++
      }
    }
    return summaryData
  }
}
