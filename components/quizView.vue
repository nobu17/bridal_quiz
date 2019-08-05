<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12 v-if="question">
      <h3>問{{ question.question_no }} {{ question.title }}</h3>
    </v-flex>
    <v-flex xs12>
      <h3 class="ml-1">{{ question.message }}</h3>
    </v-flex>
    <v-flex xs12>
      <v-radio-group class="ml-3" v-model="cAnswerIndex" :disabled="!isAnswerable">
        <v-radio
          v-for="(selection, index) in question.selections"
          :key="index"
          :value="index"
          color="info"
        >
          <template v-slot:label>
            <div>{{selection}}</div>
            <v-badge class="ml-2" v-if="!isAnswerable">
              <template v-slot:badge>{{ answerCountList[index] }}</template>
              <v-icon right large>tag_faces</v-icon>
            </v-badge>
          </template>
        </v-radio>
      </v-radio-group>
    </v-flex>
    <v-flex xs12>
      <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="secondary" @click="submit" :disabled="!isAnswerable">回答</v-btn>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="primary" @click="explain" :disabled="!isAvailableNext">解説</v-btn>
    </v-flex>
    <v-flex xs4>
      <v-btn block color="warning" @click="goNext" :disabled="!isAvailableNext">次へ</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-alert :value="!isAnswerable" type="warning">回答解説までお待ちください。</v-alert>
    </v-flex>
    <v-flex xs12>
      <v-alert :value="isAvailableNext" type="error">司会者からの案内があるまで [次へ] は押さないでください。</v-alert>
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
    isNotAnswered: {
      type: Boolean,
      required: true
    },
    answerCountList: {
      type: Array,
      required: false
    }
  },
  computed: {
    cAnswerIndex: {
      get() {
        return this.answerIndex
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    isAnswerable() {
      // クイズが終了している場合は回答不可
      if (this.question.is_ended) {
        return false
      }
      // 回答済みならば回答不可
      if (!this.isNotAnswered) {
        return false
      }
      return true
    },
    isAvailableNext() {
      if (this.question.is_ended) {
        return true
      }
      return false
    }
  },
  data() {
    return {
      errorMessage: ''
    }
  },
  methods: {
    submit() {
      this.errorMessage = ''
      console.log(this.cAnswerIndex)
      if (this.cAnswerIndex < 0) {
        this.errorMessage = '回答を選択してください。'
        return
      }
      this.$emit('answered', {
        answerIndex: this.cAnswerIndex
      })
    },
    async explain() {
      if (this.question.answer_explanation) {
        await this.$refs.dialog.open(this.question.answer_explanation)
      }
    },
    goNext() {
      if (confirm('次の問題へ行きます。')) {
        // this.cAnswerIndex = -1
        this.$emit('goNext')
      }
    }
  }
}
</script>

<style scoped>
</style>