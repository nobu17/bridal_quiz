import firebase from '../plugins/firebase'

export default class FirebaseQuizClient {
  constructor() {
    this.questionCollectionName = 'questions'
    this.userAnswerCollectionName = 'user_answers'
  }

  async readUserAnswers(groupId) {
    const ansRef = await firebase
      .firestore()
      .collection(this.userAnswerCollectionName)
    const query = await ansRef.where('group_id', '==', groupId).get()
    const res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    return res
  }
}
