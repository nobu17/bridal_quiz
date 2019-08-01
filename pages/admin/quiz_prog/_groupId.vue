<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12>
      <h3>クイズ進行管理</h3>
    </v-flex>
    <v-flex xs12>
      <v-btn block color="primary" @click="readQuestion">更新</v-btn>
    </v-flex>
    <div v-if="questions && questions.length > 0">
      <v-flex xs12 v-for="(question, index) in questions" :key="index">
        <QuestionProg :question="question" @checkedChanged="checkedChanged" />
      </v-flex>
    </div>
    <LoadingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import LoadingScreen from '../../../components/common/loadingScreen'
import QuestionProg from '../../../components/questionProg'
import FirebaseQuizClient from '../../../lib/firebaseQuizClient'
const quizClient = new FirebaseQuizClient()
export default {
  components: {
    LoadingScreen,
    QuestionProg
  },
  async mounted() {
    this.groupId = parseInt(this.$nuxt.$route.params.groupId)
    await this.readQuestion()
  },
  methods: {
    async readQuestion() {
      try {
        this.errorMessage = ''
        this.isLoading = true
        this.questions = await quizClient.readQuestion(this.groupId)
      } catch (err) {
        this.errorMessage = 'ロードに失敗しました。' + err
      } finally {
        this.isLoading = false
      }
    },
    async updateQuestionCondition(question) {
      try {
        this.errorMessage = ''
        this.isLoading = true
        await quizClient.updateQuestionEnded(question.id, question.is_ended)
      } catch (err) {
        this.errorMessage = '更新に失敗しました。' + err
      } finally {
        this.isLoading = false
      }
    },
    async checkedChanged(val) {
      // ロード中は未実施
      if (this.isLoading) {
        return
      }
      console.log('changed', val)
      await this.updateQuestionCondition(val)
    }
  },
  data() {
    return {
      errorMessage: '',
      isLoading: false,
      questions: [],
      groupId: 0
    }
  }
}
</script>

<style>
</style>
