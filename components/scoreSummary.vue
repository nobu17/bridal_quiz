<template>
  <v-layout justify-center align-center wrap>
    <v-flex xs12 v-if="scores">
      <v-list>
        <v-list-tile v-for="(score, index) in scores" :key="index" @click="dummy">
          <v-list-tile-content>
            <v-list-tile-title >{{ score.score }} 点  /  {{ score.userName }} さん</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    scores: {
      type: Array,
      required: true
    }
  },
  methods: {
    dummy() {}
  }
}
</script>

<style>
</style>
