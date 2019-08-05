import firebase from '../plugins/firebase'

export default class FirebaseSettingClient {
  constructor() {
    this.settingsCollectionName = 'settings'
  }

  async readGlobalSettings() {
    const gref = await firebase
      .firestore()
      .collection(this.settingsCollectionName)
      .doc('global')
      .get()
    return gref.data()
  }

  async updateStartSetting(isStart, isAllQuestionEnd) {
    const gref = await firebase
      .firestore()
      .collection(this.settingsCollectionName)
      .doc('global')
    await gref.update({ isStart: isStart, isAllQuestionEnd: isAllQuestionEnd })
  }

  async listenGlobalSettingChange(callback) {
    await firebase
      .firestore()
      .collection(this.settingsCollectionName)
      .doc('global')
      .onSnapshot(snap => {
        if (!snap.exists) {
          return
        }
        callback(snap.data())
      })
  }
}
