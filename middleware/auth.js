export default function({ store, route, redirect }) {
  const user = store.getters['auth/user']
  // console.log('navigation', user)
  if (!user || user.id === '') {
    const query = route.path ? '?redirect=' + route.path : ''
    // console.log('not authed')
    return redirect('/entry' + query)
  }
  // console.log('authed')
}
