<script>
// import VueCharts from 'vue-chartjs'
import { Bar, mixins } from 'vue-chartjs'
import FirebaseQuizClient from '../lib/firebaseQuizClient'

const quizClient = new FirebaseQuizClient()

export default {
  mixins: [Bar, mixins.reactiveData],
  data: function() {
    return {
      allQuestionAnswers: [], // [[0,1,3], [1,2,4], [4,6,7]]
      currentQuestionAnswers: [],
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
  },
  computed: {
    questions() {
      return this.$store.getters['quiz2/questions']
    },
    currentQuestionIndex() {
      return this.$store.getters['quiz2/currentQuestionIndex']
    }
  },
  watch: {
    questions(val) {
      console.log('questions is changed', val)
      // init data by questions
      this.initAnswerByQueston()

      quizClient.listenUserAnswers(1, answer => {
        // console.log('listen!!!!', answer)
        this.countUpAnswer(answer)
        // this.countUpChartData(answer)
      })
    },
    currentQuestionIndex(val) {
      console.log('&&&&&&&&&&&&&&&&&&&&&currentQuestionIndex is changed', val)
      this.changeCurrentQuestion(val)
    }
  },
  methods: {
    initAnswerByQueston() {
      const tempAllQuestionAnswers = []
      if (this.questions) {
        for (const q of this.questions) {
          // 選択肢の分だけ0データを作成
          tempAllQuestionAnswers.push(q.selections.map(s => 0))
        }
      }
      this.allQuestionAnswers = tempAllQuestionAnswers
      this.currentQuestionAnswers = tempAllQuestionAnswers[0]
      this.changeCurrentQuestion(0)
    },
    changeCurrentQuestion(index) {
      this.currentQuestionAnswers = JSON.parse(
        JSON.stringify(this.allQuestionAnswers[index])
      )
      this.updateLabelAndChart(
        this.questions[index].selections,
        this.currentQuestionAnswers
      )
    },
    countUpAnswer(answer) {
      if (this.allQuestionAnswers[answer.questionIndex]) {
        // console.log('count up', answer)
        this.allQuestionAnswers[answer.questionIndex][answer.answerIndex]++
      }
      // 現在表示の問題と同じ場合も加算
      if (this.currentQuestionIndex === answer.questionIndex) {
        // console.log('currentQuestionAnswers', this.currentQuestionAnswers)
        this.currentQuestionAnswers[answer.answerIndex]++
        this.updateChartData(this.currentQuestionAnswers)
      }
    },
    updateLabelAndChart(labels, data) {
      console.log('updateLabelAndChart', { labels, data })
      const newChartData = Object.assign({}, this.chartData)
      newChartData.labels = labels
      newChartData.datasets[0].data = data
      // console.log('newChartData', newChartData)
      this.chartData = newChartData
      console.log('updateLabelAndChart end', this.chartData)
    },
    updateChartData(data) {
      console.log('updateChartData', data)
      const newChartData = Object.assign({}, this.chartData)
      newChartData.datasets[0].data = JSON.parse(JSON.stringify(data))
      // console.log('newChartData', newChartData)
      this.chartData = newChartData
    },
    countUpChartData(data) {
      if (data) {
        console.log('countUpChartData!!!!', data)
        const newChartData = Object.assign({}, this.chartData)
        newChartData.datasets[0].data[data.answerIndex]++
        this.chartData = newChartData
      }
    }
  },
  mounted() {
    this.chartData = {
      labels: [],
      datasets: [
        {
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          data: this.currentQuestionAnswers
        }
      ]
    }
  }
}
</script>
