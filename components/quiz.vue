<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12 v-if="question">
      <h3>{{ question.title }}</h3>
    </v-flex>
    <v-flex xs12>
      <h3>{{ question.message }}</h3>
    </v-flex>
    <v-flex xs12>
      <v-container>
        <v-radio-group v-model="vAnswerIndex" :disabled="isAlreadyAnswered">
          <v-radio
            v-for="(selection, index) in question.selections"
            :key="index"
            :label="selection"
            :value="index"
          ></v-radio>
        </v-radio-group>
      </v-container>
    </v-flex>
    <v-flex xs12>
      <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="secondary" @click="submit" :disabled="isAlreadyAnswered">送信</v-btn>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="primary" @click="explain" :disabled="!isAlreadyAnswered">解説</v-btn>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="warning" @click="goNext" :disabled="!isAlreadyAnswered">次へ</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-alert v-if="isAlreadyAnswered" :value="true" type="error">司会からの案内があるまで [次へ] は押さないでください。</v-alert>
    </v-flex>
    <AnswerDialog ref="dialog" />
  </v-layout>
</template>

<script>
import AnswerDialog from './answerDialog'
export default {
  components: {
    AnswerDialog
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    answerIndex: {
      type: Number,
      required: true
    },
    memo: {
      type: String,
      required: true
    }
  },
  computed: {
    isAlreadyAnswered() {
      if (this.answerIndex !== -1) {
        return true
      }
      return false
    }
  },
  data() {
    return {
      vAnswerIndex: 0,
      vMemo: '',
      errorMessage: ''
    }
  },
  watch: {
    answerNo(val) {
      this.vAnswerIndex = val
      this.vMemo = this.memo
    }
  },
  mounted() {
    this.vAnswerIndex = this.answerIndex
    this.vMemo = this.memo
  },
  methods: {
    submit() {
      this.errorMessage = ''
      if (this.vAnswerIndex < 0) {
        this.errorMessage = '回答を選択してください。'
        return
      }
      this.$emit('answered', {
        answerIndex: this.vAnswerIndex,
        memo: this.memo
      })
    },
    async explain() {
      if (this.question.answer_explanation) {
        await this.$refs.dialog.open(this.question.answer_explanation)
      }
    },
    goNext() {
      if (confirm('次の問題へ行きます。')) {
        this.$emit('goNext')
      }
    }
  }
}
</script>

<style>
</style>
