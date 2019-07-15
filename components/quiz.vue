<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12>
      <h3>{{ question.title }}</h3>
    </v-flex>
    <v-flex xs12>
      <h3>{{ question.message }}</h3>
    </v-flex>
    <v-flex xs12>
      <v-container>
        <v-radio-group v-model="level" :disabled="isSended">
          <v-radio
            v-for="(selection, index) in question.selections"
            :key="index"
            :label="selection.message"
            :value="index"
          ></v-radio>
        </v-radio-group>
      </v-container>
    </v-flex>
    <v-flex xs12>
      <v-btn color="primary" :disabled="isSended" @click="send">送信</v-btn>
    </v-flex>
    <v-flex xs12 v-if="question.isEnded">
      <v-btn color="secondary" @click="send">次の問題へ</v-btn>
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
      isSended: false
    }
  },
  methods: {
    send() {
      this.isSended = true
      this.question.isEnded = true
    }
  }
}
</script>

<style>
</style>
