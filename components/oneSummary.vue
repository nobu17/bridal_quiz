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
        <chartjs-bar
          data-label="回答"
          :labels="labels"
          :data="selections"
          :backgroundcolor="['rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)']"
          :bordercolor="['rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)']"
          :option="options"
        >></chartjs-bar>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    summary: {
      type: Array,
      required: true
    }
  },
  computed: {
    labels() {
      return this.summary.map(x => x.selection)
    },
    selections() {
      return this.summary.map(x => x.count)
    }
  },
  mounted() {
    // this.labels = this.summary.map(x => x.selection)
    // this.selections = this.summary.map(x => x.count)
  },
  data() {
    return {
      options: {
        // ◆オプション
        responsive: true, // グラフ自動設定
        legend: {
          // 凡例設定
          display: false // 表示設定
        },
        title: {
          // タイトル設定
          display: true, // 表示設定
          fontSize: 18, // フォントサイズ
          text: '' // ラベル
        },
        scales: {
          // 軸設定
          yAxes: [
            {
              // y軸設定
              display: true, // 表示設定
              scaleLabel: {
                // 軸ラベル設定
                display: true, // 表示設定
                labelString: '回答数', // ラベル
                fontSize: 18 // フォントサイズ
              },
              ticks: {
                // 最大値最小値設定
                min: 0, // 最小値
                max: 40, // 最大値
                fontSize: 18, // フォントサイズ
                stepSize: 5 // 軸間隔
              }
            }
          ],
          xAxes: [
            {
              // x軸設定
              display: true, // 表示設定
              barPercentage: 0.4, // 棒グラフ幅
              categoryPercentage: 0.4, // 棒グラフ幅
              scaleLabel: {
                // 軸ラベル設定
                display: false, // 表示設定
                labelString: '回答', // ラベル
                fontSize: 18 // フォントサイズ
              },
              ticks: {
                fontSize: 18 // フォントサイズ
              }
            }
          ]
        },
        layout: {
          // レイアウト
          padding: {
            // 余白設定
            left: 10,
            right: 10,
            top: 0,
            bottom: 0
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
