import UserClient from '../lib/userClient'
let alreadyDone = false
const userClinet = new UserClient()

export default async ({ store }) => {
  if (alreadyDone) {
    return null
  }
  console.log('init auth')
  const user = await userClinet.initUser()
  if (user) {
    console.log('user found')
    store.commit('auth/setUser', user)
  } else {
    console.log('user not found')
  }
  console.log('init auth end')
  alreadyDone = true
  return null
}
