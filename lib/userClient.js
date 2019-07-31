import FirebaseUserClient from './firebaseUserClient'

export default class UserClient {
  constructor() {
    this.repository = new FirebaseUserClient()
  }

  async initUser() {
    // ローカルにユーザがあれば
    const user = this.loadLocalUser()
    // this.clearLocalUser()
    console.log('local data is found', user)
    if (user) {
      // DB上にも存在するかをチェック
      const findedUser = await this.repository.getUser(user.id)
      console.log('found', findedUser)
      if (findedUser) {
        return findedUser
      } else {
        console.log('clear user')
        this.clearLocalUser()
      }
    }
    console.log('not user founded')
    return null
  }

  async deleteUser(user) {
    await this.repository.deleteUser(user.id)
    this.clearLocalUser()
  }

  async addUser(user) {
    const added = await this.repository.addUser(user)
    console.log('added', added)
    this.saveUserToLocal(added)
    return added
  }

  saveUserToLocal(user) {
    if (user) {
      console.log('saved', user)
      localStorage.user = JSON.stringify({ id: user.id, name: user.name })
    }
  }

  clearLocalUser() {
    if (localStorage.user) {
      localStorage.removeItem('user')
    }
  }

  loadLocalUser() {
    const user = localStorage.user
    if (user) {
      return JSON.parse(user)
    }
    return null
  }
}
