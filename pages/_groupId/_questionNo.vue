<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12 v-if="question && userAnswer">
        <QuizView
          :question="question"
          :answerIndex="userAnswer.answerIndex"
          :isNotAnswered="userAnswer.isNotAnswered"
          :answerCountList="answerCountList"
          @answered="answered"
          @input="answerChange"
          @goNext="goNext"
        />
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
    </v-container>
    <LoaingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import LoaingScreen from '../../components/common/loadingScreen'
import QuizView from '../../components/quizView'
import FirebaseQuestionClient from '../../lib/firebaseQuestionClient'
import FirebaseScoreClient from '../../lib/firebaseScoreClient'
const questionClient = new FirebaseQuestionClient()
const scoreClient = new FirebaseScoreClient()
export default {
  components: {
    LoaingScreen,
    QuizView
  },
  middleware: 'auth',
  computed: {
    user() {
      return this.$store.getters['auth/user']
    }
  },
  async mounted() {
    if (this.user.id !== '') {
      this.groupId = parseInt(this.$nuxt.$route.params.groupId)
      this.questionNo = parseInt(this.$nuxt.$route.params.questionNo)
      await this.initData()
      // 進捗リッスン
      await questionClient.listenQuestionChanged(
        this.groupId,
        this.questionNo,
        this.setQuestion
      )
    } else {
      this.$router.push('/enrty')
    }
  },
  methods: {
    async initData() {
      try {
        this.isLoading = true
        await this.readQuestion()
        this.initAnswerList()
        await this.readUserAnswer()
        await this.initScore()
        // 回答リッスン
        await questionClient.listenUserAnswerChanged(
          this.groupId,
          this.questionNo,
          this.calcSummary
        )
      } catch (err) {
        console.error(err)
        this.errorMessage = 'エラーが発生しました。画面をリロードしてください。'
      } finally {
        this.isLoading = false
      }
    },
    // スコアが無ければ作成
    async initScore() {
      await scoreClient.initUserScore(
        this.user.id,
        this.user.name,
        this.groupId,
        false
      )
    },
    initAnswerList() {
      if (this.question) {
        this.answerCountList = this.question.selections.map(x => 0)
      }
    },
    // 変更通知でクイズを更新
    setQuestion(question) {
      this.question = question
    },
    // 回答結果をサマる
    calcSummary(scoreSum) {
      // 主計された結果なので一旦０にして加算
      const temp = this.answerCountList.map(x => 0)
      for (const key in scoreSum) {
        if (temp.length > key) {
          // 合算
          temp[key] += scoreSum[key]
        }
      }
      console.log('count up result', temp)
      this.answerCountList = temp
    },
    async readQuestion() {
      this.question = await questionClient.readQuestion(
        this.groupId,
        this.questionNo
      )
      // 問題がない場合はサマリーへ
      if (!this.question) {
        this.$router.push('/summary/' + this.groupId)
      }
    },
    async readUserAnswer() {
      this.userAnswer = await questionClient.readUserAnswer(
        this.user.id,
        this.groupId,
        this.questionNo
      )
      // this.ansIndex = this.userAnswer.answerIndex
    },
    async addUserAnswer(answerIndex) {
      await questionClient.addUserAnswer(
        this.user.id,
        this.groupId,
        this.questionNo,
        answerIndex
      )
      // 正解ならばスコアアップ
      if (this.question.answer_index === answerIndex) {
        await scoreClient.countUpUserScore(
          this.user.id,
          this.user.name,
          this.groupId
        )
      }
      // 回答更新
      await this.readUserAnswer()
    },
    // 回答を変更
    answerChange(val) {
      // console.log('ansIndex change', val)
      this.userAnswer.answerIndex = val
    },
    async answered({ answerIndex }) {
      try {
        this.isLoading = true
        await this.addUserAnswer(answerIndex)
      } catch (err) {
        console.error(err)
        this.errorMessage = 'エラーが発生しました。画面をリロードしてください。'
      } finally {
        this.isLoading = false
      }
    },
    // 次のページへ
    goNext() {
      const groupId = this.groupId
      const questionNo = this.questionNo + 1
      this.$router.push(`/${groupId}/${questionNo}`)
    }
  },
  data() {
    return {
      errorMessage: '',
      question: null,
      userAnswer: null,
      ansIndex: -1,
      isLoading: false,
      groupId: 0,
      questionNo: 0,
      answerCountList: [0, 0]
    }
  }
}
</script>

<style>
</style>
