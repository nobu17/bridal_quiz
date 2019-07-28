<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <div v-if="questions[currentQuestionIndex]">
        <v-flex xs12>
          <Quiz
            :question="questions[currentQuestionIndex]"
            :answerIndex="userAnswers[currentQuestionIndex].answerIndex"
            :memo="userAnswers[currentQuestionIndex].memo"
            @answered="answered"
            @goNext="goNext"
          />
        </v-flex>
      </div>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
      <v-flex xs12>
        <SelfChart :height="250" />
      </v-flex>
    </v-container>
    <LoaingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import LoaingScreen from '../..//components/common/loadingScreen'
import SelfChart from '../../components/selfChart'
import Quiz from '../../components/quiz'
export default {
  components: {
    Quiz,
    LoaingScreen,
    SelfChart
  },
  middleware: 'auth',
  computed: {
    questions() {
      return this.$store.getters['quiz2/questions']
    },
    userAnswers() {
      return this.$store.getters['quiz2/userAnswers']
    },
    allUserAnswers() {
      return this.$store.getters['quiz2/allUserAnswers']
    },
    currentQuestionIndex() {
      return this.$store.getters['quiz2/currentQuestionIndex']
    },
    user() {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    async answered({ answerIndex, memo }) {
      // サーバ側の回答を更新
      this.isLoading = true
      await this.$store.dispatch('quiz2/answerQuestion', {
        groupId: this.groupId,
        user: this.user,
        quizIndex: this.currentQuestionIndex,
        answer: { answerIndex: answerIndex, memo: memo }
      })
      this.isLoading = false
      // 回答をロード
    },
    goNext() {
      this.$store.commit('quiz2/incrementQuestion')
    }
  },
  async mounted() {
    if (this.user.id !== '') {
      this.isSended = false
      this.groupId = parseInt(this.$nuxt.$route.params.groupId)
      console.log('groupID', this.groupId)
      this.isLoading = true
      await this.$store.dispatch('quiz2/readQuestions', {
        groupId: this.groupId,
        user: this.user
      })
      this.isLoading = false
    }
  },
  data() {
    return {
      errorMessage: '',
      isLoading: false,
      groupId: 0,
      questionNo: 0
    }
  }
}
</script>

<style>
</style>
