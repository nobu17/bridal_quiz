import firebase from '../plugins/firebase'

export default class FirebaseQuizClient {
  constructor() {
    this.questionCollectionName = 'questions'
    // this.userAnswerCollectionName = 'user_answers'
    // this.userScoreCollectionName = 'user_scores'
    this.answerCollectionName = 'answers'
  }

  async listenUserAnswers(groupId, callback) {
    await firebase
      .firestore()
      .collection(this.answerCollectionName)
      .where('groupId', '==', groupId)
      .onSnapshot(snap => {
        snap.forEach(doc => {
          callback(doc.data())
        })
      })
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

  async readUserAnswers(userId, groupId) {
    const ansRef = await firebase
      .firestore()
      .collection(this.answerCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .orderBy('questionIndex', 'asc')
      .get()
    let res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    // 無い場合は初期化
    if (!res || res.length === 0) {
      console.log('undefined answer init', res)
      res = { userId: userId, groupId: groupId, answers: [] }
    } else {
      res = {
        userId: userId,
        groupId: groupId,
        answers: res.map(x => ({ answerIndex: x.answerIndex, memo: '' }))
      }
    }
    return res
  }

  async addUserAnswer({ userId, groupId, questionIndex, answerIndex, memo }) {
    console.log('addUserAnswer', {
      userId,
      groupId,
      questionIndex,
      answerIndex,
      memo
    })
    const ansRef = await firebase
      .firestore()
      .collection(this.answerCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .get()
    if (query.docs.length > 0) {
      console.log('update')
      const temp = query.docs[0].data()
      // update
      await firebase
        .firestore()
        .collection(this.answerCollectionName)
        .doc(temp.id)
        .update({
          answerIndex: answerIndex,
          memo: memo
        })
    } else {
      console.log('insert')
      await firebase
        .firestore()
        .collection(this.answerCollectionName)
        .add({
          userId: userId,
          groupId: groupId,
          questionIndex: questionIndex,
          answerIndex: answerIndex,
          memo: memo
        })
    }
  }

  async deleteUserAnswer({ userId, groupId }) {
    const ansRef = await firebase
      .firestore()
      .collection(this.answerCollectionName)
    const query = await ansRef
      .where('user_id', '==', userId)
      .where('group_id', '==', groupId)
      .get()

    if (query.docs.length > 0) {
      for (const ans of query.docs) {
        console.log('del', ans.id)
        await ansRef.doc(ans.id).delete()
      }
    }
  }
}
