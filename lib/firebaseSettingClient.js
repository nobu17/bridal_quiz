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

  async updateStartSetting(isStart) {
    const gref = await firebase
      .firestore()
      .collection(this.settingsCollectionName)
      .doc('global')
    await gref.update({ isStart: isStart })
  }
}
