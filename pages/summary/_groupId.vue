<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12>
        <h2>回答結果集計</h2>
      </v-flex>
      <v-flex xs12>
        <v-btn block color="primary" @click="loadScores">更新</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
      <div v-if="userScores">
        <ScoreSummary :scores="userScores" />
      </div>
    </v-container>
    <LoadingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import ScoreSummary from '../..//components/scoreSummary'
import LoadingScreen from '../..//components/common/loadingScreen'
export default {
  components: {
    ScoreSummary,
    LoadingScreen
  },
  computed: {
    userScores() {
      return this.$store.getters['summary/userScores']
    }
  },
  async mounted() {
    this.groupId = parseInt(this.$nuxt.$route.params.groupId)
    console.log('groupId', this.groupId)
    await this.loadScores()
  },
  methods: {
    async loadScores() {
      this.isLoading = true
      await this.$store.dispatch('summary/readScores', {
        groupId: this.groupId
      })
      this.isLoading = false
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
