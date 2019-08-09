<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="900">
      <v-card v-if="answerExplanation">
        <v-card-title>{{ answerExplanation.title }}</v-card-title>
        <v-card-text>{{ answerExplanation.detail }}</v-card-text>
        <v-img
          v-if="answerExplanation.img !== ''"
          :src="answerExplanation.img"
          aspect-ratio="1.7"
          contain
        >
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="red lighten-2"></v-progress-circular>
            </v-layout>
          </template>
        </v-img>
        <v-card-actions>
          <v-btn @click="close">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      dialog: false,
      resolve: null,
      reject: null,
      answerExplanation: null
    }
  },
  methods: {
    open(answerExplanation) {
      this.answerExplanation = answerExplanation
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.resolve(null)
      this.answerExplanation = null
      this.dialog = false
    }
  }
}
</script>

<style>
</style>
