<template>
  <v-container align-center>
    <v-layout justify-center align-center wrap>
      <v-flex xs12>
        <h2 class="text-center">クイズ管理</h2>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
      <v-flex xs12>
        <v-btn block color="primary" @click="reloadAll">更新</v-btn>
      </v-flex>
      <div v-if="settings">
        <v-switch label="開始フラグ" v-model="settings.isStart" xs6></v-switch>
        <v-btn block color="primary" @click="applyIsStart" xs6>反映</v-btn>
      </div>
      <v-flex xs12 v-if="questions && questions.length > 0">
        <h2>進行</h2>
      </v-flex>
      <v-flex xs4 v-for="(question, index) in questions" :key="index">
        <QuestionProg :question="question" @checkedChanged="checkedChanged" />
      </v-flex>
      <v-flex xs12>
        <v-btn block color="primary" @click="deleteAll">全データ削除</v-btn>
      </v-flex>
      <LoadingScreen :isLoading="isLoading" />
    </v-layout>
  </v-container>
</template>

<script>
import LoadingScreen from '../../../components/common/loadingScreen'
import QuestionProg from '../../../components/questionProg'
import FirebaseQuestionClient from '../../../lib/firebaseQuestionClient'
import FirebaseAdminClinet from '../../../lib/firebaseAdminClinet'
import FirebaseSettingClient from '../../../lib/firebaseSettingClient'
const quizClient = new FirebaseQuestionClient()
const adminClient = new FirebaseAdminClinet()
const settingClient = new FirebaseSettingClient()
export default {
  components: {
    LoadingScreen,
    QuestionProg
  },
  async mounted() {
    this.groupId = parseInt(this.$nuxt.$route.params.groupId)
    await this.readQuestion()
    await this.readSettings()
  },
  methods: {
    async reloadAll() {
      await this.readQuestion()
      await this.readSettings()
    },
    async readQuestion() {
      try {
        this.errorMessage = ''
        this.isLoading = true
        this.questions = await quizClient.readAllQuestion(this.groupId)
      } catch (err) {
        this.errorMessage = 'ロードに失敗しました。' + err
      } finally {
        this.isLoading = false
      }
    },
    async readSettings() {
      try {
        this.errorMessage = ''
        this.isLoading = true
        this.settings = await settingClient.readGlobalSettings()
      } catch (err) {
        this.errorMessage = 'ロードに失敗しました。' + err
      } finally {
        this.isLoading = false
      }
    },
    async applyIsStart() {
      try {
        this.errorMessage = ''
        this.isLoading = true
        await settingClient.updateStartSetting(this.settings.isStart)
        await this.readSettings()
      } catch (err) {
        this.errorMessage = '更新に失敗しました。' + err
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
    },
    async deleteAll() {
      if (confirm('削除してよろしいですか？')) {
        try {
          this.errorMessage = ''
          this.isLoading = true
          await adminClient.clearAllData()
        } catch (err) {
          this.errorMessage = '更新に失敗しました。' + err
        } finally {
          this.isLoading = false
        }
      }
    }
  },
  data() {
    return {
      errorMessage: '',
      isLoading: false,
      questions: [],
      settings: null,
      groupId: 0
    }
  }
}
</script>

<style>
</style>
