export default function({ store, route, redirect }) {
  const user = store.getters['auth/user']
  if (!user || user.id === '') {
    const query = route.path ? '?redirect=' + route.path : ''
    return redirect('/entry' + query)
  }
}
