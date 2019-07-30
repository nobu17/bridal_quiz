import firebase from '../plugins/firebase'

export default class FirebaseScoreClient {
  constructor() {
    this.userScoreCollectionName = 'user_scores'
  }

  async readAllUserScores(groupId) {
    const ansRef = await firebase
      .firestore()
      .collection(this.userScoreCollectionName)
    const query = await ansRef
      .where('groupId', '==', groupId)
      .orderBy('score', 'desc')
      .get()
    const res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    return res
  }

  async readUserScore(userId, groupId) {
    const ansRef = await firebase
      .firestore()
      .collection(this.userScoreCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .get()
    let res = query.docs.map(m => {
      const temp = m.data()
      temp.id = m.id
      return temp
    })
    // 無い場合は初期化
    if (!res || res.length === 0) {
      console.log('not undefined answer init', res)
      res = { userId: userId, groupId: groupId, score: 0 }
    } else {
      res = res[0]
    }
    return res
  }

  async initUserScore(userId, userName, groupId, isResetIfExisted) {
    console.log('initUserScore', { userId, userName, groupId })
    const ansRef = await firebase
      .firestore()
      .collection(this.userScoreCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .get()
    // 無い場合は初期化
    if (!query || !query.empty) {
      // 初期化フラグがある場合のみ0リセットでレコード作成
      if (isResetIfExisted) {
        const temp = query.docs[0].data()
        // update
        await firebase
          .firestore()
          .collection(this.userScoreCollectionName)
          .doc(temp.id)
          .update({
            score: 0
          })
      }
    } else {
      console.log('insert')
      await firebase
        .firestore()
        .collection(this.userScoreCollectionName)
        .add({
          userId: userId,
          userName: userName,
          groupId: groupId,
          score: 0
        })
    }
  }

  async countUpUserScore(userId, userName, groupId) {
    console.log('countUpUserScore', { userId, userName, groupId })
    const ansRef = await firebase
      .firestore()
      .collection(this.userScoreCollectionName)
    const query = await ansRef
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .get()
    // 無い場合は初期化
    if (!query || !query.empty) {
      const temp = query.docs[0].data()
      console.log('update', temp)
      // update
      await firebase
        .firestore()
        .collection(this.userScoreCollectionName)
        .doc(query.docs[0].id)
        .update({
          score: temp.score + 1
        })
    } else {
      console.log('insert')
      await firebase
        .firestore()
        .collection(this.userScoreCollectionName)
        .add({
          userId: userId,
          userName: userName,
          groupId: groupId,
          score: 1
        })
    }
  }
}
