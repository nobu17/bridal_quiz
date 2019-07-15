<template>
  <v-layout justify-center align-center wrap>
    <v-container>
      <v-flex xs12 v-if="currentQuestion">
        <Quiz :question="currentQuestion" @answered="answered" />
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
  computed: {
    currentQuestion() {
      return this.$store.getters['quiz/currentQuestion']
    }
  },
  methods: {
    answered({ answer, memo }) {
      console.log('answer', answer)
    }
  },
  async mounted() {
    this.groupId = parseInt(this.$nuxt.$route.params.groupId)
    console.log('groupID', this.groupId)
    await this.$store.dispatch('quiz/readQuestions', {
      groupId: this.groupId
    })
  },
  data() {
    return {
      groupId: 0,
      questionNo: 0,
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
