import FirebaseScoreClient from './firebaseScoreClient'

export default class SummaryClient {
  constructor() {
    this.repository = new FirebaseScoreClient()
  }

  async readUserScores(groupId) {
    const scores = await this.repository.readAllUserScores(groupId)
    // 分類
    return scores
  }
}
