<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12>
      <h3>氏名を入力して開始ボタンを押してください。</h3>
    </v-flex>
    <v-flex xs12>
      <v-form ref="form" v-model="newValid" lazy-validation>
        <v-flex xs12>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            :counter="10"
            label="氏名"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 class="mb-4">
          <v-btn block color="primary" @click="commitName()">確定</v-btn>
        </v-flex>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      newValid: false,
      commitValid: false,
      errorMessage: '',
      name: '',
      nameRules: [
        v => {
          if (!v || v.trim() === '') {
            return '氏名を入力して下さい。'
          }
          if (v.length > 10) {
            return '10文字以内で入力してください。。'
          }
          return true
        }
      ]
    }
  },
  methods: {
    commitName() {}
  }
}
</script>

<style>
</style>
