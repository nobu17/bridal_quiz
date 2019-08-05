<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12>
        <h2>回答結果集計</h2>
      </v-flex>
      <v-flex xs12>
        <v-btn block color="primary" v-show="canShowSummary" @click="loadScores">更新</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
      <v-flex xs12 v-if="yourScore" class="ma-2">
        <h2 class="red--text ma-3">あなたのスコアは {{ yourScore.score }} 点です。</h2>
      </v-flex>
      <v-flex xs12 v-if="!canShowSummary" class="ma-2">
        <h2 class="orange--text ma-3">皆さんの回答が終わるまでお待ちください。</h2>
      </v-flex>
      <div v-if="canShowSummary && userScores">
        <ScoreSummary :scores="userScores" />
      </div>
    </v-container>
    <LoadingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import ScoreSummary from '../..//components/scoreSummary'
import LoadingScreen from '../..//components/common/loadingScreen'
import FirebaseSettingClient from '../../lib/firebaseSettingClient'

const clinet = new FirebaseSettingClient()
export default {
  components: {
    ScoreSummary,
    LoadingScreen
  },
  computed: {
    userScores() {
      return this.$store.getters['summary/userScores']
    },
    user() {
      return this.$store.getters['auth/user']
    },
    yourScore() {
      if (this.user && this.user.id !== '') {
        return this.userScores.find(x => x.userId === this.user.id)
      }
      return null
    },
    settings() {
      return this.$store.getters['auth/settings']
    },
    canShowSummary() {
      if (this.settings && this.settings.isAllQuestionEnd) {
        return true
      }
      return false
    }
  },
  async mounted() {
    this.groupId = parseInt(this.$nuxt.$route.params.groupId)
    console.log('groupId', this.groupId)
    await this.loadScores()
    // 変更監視
    await clinet.listenGlobalSettingChange(this.changeGlobalSetting)
  },
  methods: {
    async loadScores() {
      this.isLoading = true
      await this.$store.dispatch('summary/readScores', {
        groupId: this.groupId
      })
      this.isLoading = false
    },
    changeGlobalSetting(setting) {
      return this.$store.commit('auth/setSettings', setting)
    }
  },
  data() {
    return {
      errorMessage: '',
      isLoading: false,
      groupId: 0
    }
  }
}
</script>

<style>
</style>
