<template>
  <v-app>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <div v-if="user && user.name">
        <v-toolbar-title v-text="user.name" />
      </div>
      <div v-if="user && user.name && isAllowDelete">
        <v-btn color="primary" type="button" @click="deleteUser">削除</v-btn>
      </div>
      <v-btn color="primary" type="button" @click="reload">更新</v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed></v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019 made by inagawa</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    settings() {
      return this.$store.getters['auth/settings']
    },
    isAllowDelete() {
      if (this.settings && this.settings.isAllowDelete) {
        return true
      }
      return false
    }
  },
  methods: {
    async deleteUser() {
      await this.$store.dispatch('auth/deleteUser', {
        user: this.user
      })
      this.$router.push('/entry')
    },
    reload() {
      location.reload()
    }
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '2019/08'
    }
  }
}
</script>
