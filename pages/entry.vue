<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12>
      <h3>氏名を入力して開始ボタンを押してください。</h3>
    </v-flex>
    <v-flex xs12>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="commitName">
        <v-flex xs12>
          <v-text-field v-model="user.name" :rules="nameRules" :counter="10" label="氏名" required></v-text-field>
        </v-flex>
        <v-flex xs12 class="mb-4">
          <v-btn block color="primary" type="button" @click="commitName">確定</v-btn>
        </v-flex>
      </v-form>
    </v-flex>
    <v-flex xs12>
      <v-alert v-if="errorMessage != ''" :value="true" type="error">{{ errorMessage }}</v-alert>
    </v-flex>
    <LoaingScreen :isLoading="isLoading" />
  </v-layout>
</template>

<script>
import LoaingScreen from '../components/common/loadingScreen'
export default {
  components: {
    LoaingScreen
  },
  data() {
    return {
      user: { name: '' },
      isLoading: false,
      valid: false,
      commitValid: false,
      errorMessage: '',
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
    commitName() {
      if (this.$refs.form.validate()) {
        const res = confirm(this.user.name + 'でよろしいですか？')
        if (res) {
          try {
            this.isLoading = true
            this.$store.dispatch('auth/addUser', {
              user: this.user
            })
          } catch (err) {
            console.error(err)
            this.errorMessage =
              'エラーが発生しました。再度実行を行ってください。'
          } finally {
            this.isLoading = false
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
