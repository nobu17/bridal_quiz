import firebase from '../plugins/firebase'

export default class FirebaseQuestionClient {
  constructor() {
    this.questionCollectionName = 'questions'
    this.answerCollectionName = 'answers'
  }

  async listenUserAnswerChanged(groupId, questionIndex, callback) {
    await firebase
      .firestore()
      .collection(this.answerCollectionName)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .onSnapshot(snap => {
        // 集計して返す
        if (snap.empty) {
          return
        }
        const scoreSum = snap.docs.reduce((summary, doc) => {
          // 無ければ作成
          const current = doc.data()
          if (!summary[current.answerIndex]) {
            summary[current.answerIndex] = 1
          } else {
            summary[current.answerIndex]++
          }
          return summary
        }, {})
        // console.log('scoreSum', scoreSum)
        callback(scoreSum)
      })
  }

  async readUserAnswers(groupId, questionIndex) {
    const query = await firebase
      .firestore()
      .collection(this.answerCollectionName)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .get()
    if (query.empty) {
      return null
    }
    const res = query.docs.reduce((summary, doc) => {
      // 無ければ作成
      const current = doc.data()
      if (!summary[current.answerIndex]) {
        summary[current.answerIndex] = 1
      } else {
        summary[current.answerIndex]++
      }
      return summary
    }, {})
    return res
  }

  async listenAddedUserAnswer(groupId, questionIndex, callback) {
    await firebase
      .firestore()
      .collection(this.answerCollectionName)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .onSnapshot(snap => {
        // 集計して返す
        if (!snap.empty) {
          const scoreSum = snap.docChanges().reduce((summary, change) => {
            if (change.type === 'added') {
              // 無ければ作成
              const current = change.doc.data()
              if (!summary[current.answerIndex]) {
                summary[current.answerIndex] = 1
              } else {
                summary[current.answerIndex]++
              }
              return summary
            }
          }, {})
          // console.log('scoreSum', scoreSum)
          callback(scoreSum)
        }
      })
  }

  async listenQuestionChanged(groupId, questionNo, callback) {
    await firebase
      .firestore()
      .collection(this.questionCollectionName)
      .where('group_id', '==', groupId)
      .where('question_no', '==', questionNo)
      .onSnapshot(snap => {
        snap.docChanges().forEach(
          change => {
            console.log('listen', change.doc.data())
            if (change.type === 'modified') {
              callback(change.doc.data())
            }
          },
          err => {
            console.error('listen error', err)
          }
        )
      })
  }

  async readQuestion(groupId, questionNo) {
    console.log('readQuestion', { groupId, questionNo })
    const questionsRef = await firebase
      .firestore()
      .collection(this.questionCollectionName)
    const query = await questionsRef
      .where('group_id', '==', groupId)
      .where('question_no', '==', questionNo)
      .get()
    if (query.empty) {
      return null
    }
    const res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    return res[0]
  }

  async readAllQuestion(groupId) {
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

  async updateQuestionEnded(questionId, isEnded) {
    // update
    await firebase
      .firestore()
      .collection(this.questionCollectionName)
      .doc(questionId)
      .update({
        is_ended: isEnded
      })
  }

  async readUserAnswer(userId, groupId, questionIndex) {
    const ansRef = await firebase
      .firestore()
      .collection(this.answerCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .get()
    // 無い場合は初期化
    if (query.empty) {
      return {
        userId: userId,
        groupId: groupId,
        questionIndex: questionIndex,
        answerIndex: -1,
        isNotAnswered: true
      }
    }
    const res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      temp.isNotAnswered = false
      return temp
    })
    return res[0]
  }

  async addUserAnswer(userId, groupId, questionIndex, answerIndex) {
    console.log('addUserAnswer', {
      userId,
      groupId,
      questionIndex,
      answerIndex
    })
    const ansRef = await firebase
      .firestore()
      .collection(this.answerCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .where('questionIndex', '==', questionIndex)
      .get()
    if (!query.empty) {
      await firebase
        .firestore()
        .collection(this.answerCollectionName)
        .doc(query.docs[0].id)
        .update({
          answerIndex: answerIndex
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
          answerIndex: answerIndex
        })
    }
  }
}
