import firebase from '../plugins/firebase'

export default class FirebaseQuizClient {
  constructor() {
    this.questionCollectionName = 'questions'
  }

  async readQuestion(groupId) {
    const questionsRef = await firebase
      .firestore()
      .collection(this.questionCollectionName)
    const query = await questionsRef
      .where('group_id', '==', groupId)
      .orderBy('question_no')
      .get()
    const res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    return res
  }
}
