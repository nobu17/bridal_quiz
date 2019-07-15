<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12>
        <Quiz :question="question" />
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import Quiz from '../../components/quiz'
export default {
  components: {
    Quiz
  },
  data() {
    return {
      question: {
        title: '問１',
        message: 'のぶの好物は何でしょうか？',
        selections: [{ message: '答え1' }, { message: '答え2' }]
      }
    }
  }
}
</script>

<style>
</style>
