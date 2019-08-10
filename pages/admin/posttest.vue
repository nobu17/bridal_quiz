<template>
  <v-layout justify-center align-center wrap>
    <div>
      <v-flex xs12>
        <h3>負荷テスト</h3>
      </v-flex>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
          <v-flex xs12>
            <v-text-field v-model="questionNo" :counter="1" label="クイズ番号" required></v-text-field>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <v-btn block color="primary" type="button" @click="singleSub">単発実行</v-btn>
            <v-btn block color="primary" type="button" @click="batchSub">バッチ実行</v-btn>
          </v-flex>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
      </v-flex>
    </div>
    <LoadingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import FirebaseQuestionClient from '../../lib/firebaseQuestionClient'
import LoadingScreen from '../../components/common/loadingScreen'
const questionClient = new FirebaseQuestionClient()
export default {
  components: {
    LoadingScreen
  },
  methods: {
    batchSub() {
      try {
        this.errorMessage = ''
        this.isLoading = true
        setInterval(() => {}, 1000)
      } catch (err) {
        console.error(err)
        this.errorMessage = 'エラー発生:' + err
      } finally {
        this.isLoading = false
      }
    },
    singleSub() {
      questionClient.addUserAnswer(
        'dummy_' + this.getRandomStr(),
        this.groupId,
        this.questionNo,
        1
      )
    },
    getRandomStr() {
      // 生成する文字列の長さ
      const l = 8
      // 生成する文字列に含める文字セット
      const c = 'abcdefghijklmnopqrstuvwxyz0123456789'

      const cl = c.length
      let r = ''
      for (let i = 0; i < l; i++) {
        r += c[Math.floor(Math.random() * cl)]
      }
      return r
    }
  },
  data() {
    return {
      errorMessage: '',
      valid: true,
      isLoading: false,
      groupId: 1,
      questionNo: 1
    }
  }
}
</script>

<style>
</style>
