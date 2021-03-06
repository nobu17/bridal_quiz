import firebase from '../plugins/firebase'

export default class FirebaseUserClient {
  constructor() {
    this.userCollectionName = 'users'
  }

  async addUser(user) {
    const added = await firebase
      .firestore()
      .collection(this.userCollectionName)
      .add({
        name: user.name
      })
    return { id: added.id, name: user.name }
  }

  async deleteUser(userId) {
    await firebase
      .firestore()
      .collection(this.userCollectionName)
      .doc(userId)
      .delete()
  }

  async getUser(userId) {
    const user = await firebase
      .firestore()
      .collection(this.userCollectionName)
      .doc(userId)
      .get()

    console.log('user', user)
    if (user.exists) {
      const temp = user.data()
      temp.id = user.id
      return temp
    } else {
      console.log('no user')
      return null
    }
  }
}
