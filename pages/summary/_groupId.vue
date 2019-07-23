<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12>
        <h2>回答結果集計</h2>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
      <div v-if="answerSummaries">
        <v-flex xs12 v-for="(anssum, index) in answerSummaries" :key="index">
          <OneSummary
            :question="questions[index]"
            :summary="anssum.summary"
          />
        </v-flex>
      </div>
    </v-container>
    <LoaingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import OneSummary from '../..//components/oneSummary'
import LoaingScreen from '../..//components/common/loadingScreen'
export default {
  components: {
    LoaingScreen,
    OneSummary
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    questions() {
      return this.$store.getters['summary/questions']
    },
    answerSummaries() {
      return this.$store.getters['summary/answerSummaries']
    }
  },
  async mounted() {
    if (this.user.id !== '') {
      this.groupId = parseInt(this.$nuxt.$route.params.groupId)
      console.log('groupID', this.groupId)
      this.isLoading = true
      await this.$store.dispatch('summary/readSummary', {
        groupId: this.groupId,
        user: this.user
      })
      this.isLoading = false
    }
  },
  methods: {},
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
