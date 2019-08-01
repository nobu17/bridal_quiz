<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12 v-if="question">
      <v-switch :label="question.question_no" v-model="question.is_ended"></v-switch>
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
  watch: {
    question: {
      handler: function(val) {
        this.$emit('checkedChanged', val)
      },
      deep: true
    }
  }
}
</script>

<style>
</style>
