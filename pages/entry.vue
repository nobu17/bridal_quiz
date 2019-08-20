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
        <h3 class="ma-2 wanr_title">お願い</h3>
        <p class="ma-3">1.うまく動かない等ありましたら、手を挙げてください。新郎が駆け付けます。</p>
        <p class="ma-3">2.余興中はスマホをスリープにせず、他の画面に行ったりせずにこの余興ページの開いたままにしてください。</p>
        <p class="ma-3">3.リアルタイムで回答集計や画面切り替えをしますが、画面が更新されない場合には右上の更新ボタンを押してみてください。</p>
        <p class="ma-3">4.更新、リロードの連打はご遠慮ください。新郎の来月のクレジットカードに重課金される恐れがあります。</p>
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
        // 無条件で問１へ
        this.$router.push('/1/1')
        // this.$router.push(url)
        console.log('pushed', url)
      } else {
        this.$router.push('/1/1')
      }
    }
  }
}
</script>

<style socped>
.wanr_title {
  color: red;
}
</style>
