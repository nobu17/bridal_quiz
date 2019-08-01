import FirebaseSettingClient from '../lib/firebaseSettingClient'
const firebaseSettingClient = new FirebaseSettingClient()
let alreadyDone = false

export default async ({ store }) => {
  if (alreadyDone) {
    return null
  }
  const settings = await firebaseSettingClient.readGlobalSettings()
  console.log('setting', settings)
  if (settings) {
    store.commit('auth/setSettings', settings)
  } else {
    console.log('setting not found')
  }
  alreadyDone = true
  return null
}
