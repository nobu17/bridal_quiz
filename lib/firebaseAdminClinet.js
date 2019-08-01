import firebase from '../plugins/firebase'

export default class FirebaseAdminClient {
  constructor() {
    this.userScoreCollectionName = 'user_scores'
    this.userCollectionName = 'users'
    this.answerCollectionName = 'answers'
  }

  async clearAllData() {
    await this.deleteCollection(this.userScoreCollectionName)
    await this.deleteCollection(this.userCollectionName)
    await this.deleteCollection(this.answerCollectionName)
  }

  async deleteCollection(path) {
    console.log('deleteCollection start')
    // Get a new write batch
    const batch = firebase.firestore().batch()

    const list = await firebase
      .firestore()
      .collection(path)
      .get()

    if (list.empty) {
      return
    }
    list.docs.forEach(x => {
      batch.delete(x.ref)
    })

    await batch.commit()
  }
}
