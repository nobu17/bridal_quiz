<template>
  <v-layout justify-center align-center wrap>
    <div v-if="!settings.isStart">
      <h2 class="red--text ma-3">現在はアクセスできません。アナウンスがあるまでお待ちください。</h2>
    </div>
    <div v-if="settings.isStart">
      <v-flex xs12 v-show="!isUserSetted">
        <h3>ニックネームを入力して設定ボタンを押してください。</h3>
      </v-flex>
      <v-flex xs12 v-show="!isUserSetted">
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="commitName">
          <v-flex xs12>
            <v-text-field v-model="user.name" :rules="nameRules" :counter="10" label="氏名" required></v-text-field>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <v-btn block color="primary" type="button" @click="commitName">設定</v-btn>
          </v-flex>
        </v-form>
      </v-flex>
      <v-flex xs12 v-if="isUserSetted">
        <h3>司会者からの案内がありましたら開始ボタンを押下してください。</h3>
      </v-flex>
      <v-flex xs12 class="mb-4" v-if="isUserSetted">
        <v-btn block color="info" type="button" @click="goNextPage">開始</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
    </div>
    <LoaingScreen :isLoading="isLoading" />
    <ConfitmDialog ref="confitmDialog" />
  </v-layout>
</template>

<script>
import ConfitmDialog from '../components/common/confitmDialog'
import LoaingScreen from '../components/common/loadingScreen'
export default {
  components: {
    LoaingScreen,
    ConfitmDialog
  },
  computed: {
    suser() {
      return this.$store.getters['auth/user']
    },
    settings() {
      return this.$store.getters['auth/settings']
    },
    isUserSetted() {
      console.log('isUserSett', this.suser)
      if (this.suser && this.suser.id !== '') {
        return true
      }
      return false
    }
  },
  mounted() {
    if (this.suser && this.suser.id !== '') {
      // this.$router.push('/1/1')
    }
  },
  data() {
    return {
      user: { name: '' },
      isLoading: false,
      valid: false,
      commitValid: false,
      errorMessage: '',
      nameRules: [
        v => {
          if (!v || v.trim() === '') {
            return '氏名を入力して下さい。'
          }
          if (v.length > 10) {
            return '10文字以内で入力してください。。'
          }
          return true
        }
      ]
    }
  },
  methods: {
    async commitName() {
      if (this.$refs.form.validate()) {
        const res = await this.$refs.confitmDialog.open(
          '確認',
          this.user.name + 'でよろしいですか？',
          null
        )
        if (res) {
          try {
            this.isLoading = true
            await this.$store.dispatch('auth/addUser', {
              user: this.user
            })
            this.isLoading = false
          } catch (err) {
            console.error(err)
            this.errorMessage =
              'エラーが発生しました。再度実行を行ってください。'
            this.isLoading = false
          }
        }
      }
    },
    goNextPage() {
      const url = this.$route.query.redirect
      console.log('url', url)
      if (url) {
        this.$router.push(url)
        console.log('pushed', url)
      } else {
        this.$router.push('/1/1')
      }
    }
  }
}
</script>

<style>
</style>
