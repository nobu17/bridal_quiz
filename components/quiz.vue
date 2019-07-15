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
        <v-radio-group v-model="answer" :disabled="isSended">
          <v-radio
            v-for="(selection, index) in question.selections"
            :key="index"
            :label="selection"
            :value="index"
          ></v-radio>
        </v-radio-group>
      </v-container>
    </v-flex>
    <v-flex xs12 v-if="question.isEnded">
      <h3 style="color: red">次の問題の開始までお待ちください。</h3>
    </v-flex>
    <v-flex xs12>
      <v-btn block color="primary" :disabled="isSended" @click="send">送信</v-btn>
    </v-flex>
    <v-flex xs12 v-if="question.isEnded">
      <v-btn block color="secondary" @click="send">次の問題へ</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      answer: 0,
      isSended: false
    }
  },
  methods: {
    send() {
      this.$emit('answered', { answer: this.answer, memo: '' })
      this.isSended = true
      this.question.isEnded = true
    }
  }
}
</script>

<style>
</style>
