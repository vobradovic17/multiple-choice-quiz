import { defineStore } from 'pinia'
import { shuffle } from 'lodash-es'

export const quizData = defineStore('data', {
  state: () => ({
    questions: [],
    questionIndex: 0,
    selectedAnswer: null,
    isShowSolution: false,
    isError: false,
    settingsOn: false,
    settingsData: {
      amount: '10',
      category: '22',
      difficulty: '',
    },
  }),
  getters: {
    activeQuestion: (state) => {
      return state.questions[state.questionIndex]
    },
    isCorrect: (state) => {
      return state.activeQuestion.isCorrect
    },
    isSubmitted: (state) => {
      return state.activeQuestion?.isAnswered
    },
    questionText: (state) => {
      return state.activeQuestion?.question
    },
    questionOptions: (store) => {
      return store.activeQuestion?.options
    },
  },
  actions: {
    toggleSettings() {
      this.settingsOn = !this.settingsOn
    },
    updateSettings(event) {
      this.settingsData[event.target.name] = event.target.value
    },
    selectAnswer(index) {
      this.selectedAnswer = index
    },
    checkAnswer() {
      this.questions[this.questionIndex].isAnswered = true

      this.questions[this.questionIndex].isCorrect =
        this.selectedAnswer == this.activeQuestion.correctIndex
    },
    showSolution() {
      this.isShowSolution = true
    },
    nextQuestion() {
      this.selectedAnswer = null
      this.questionIndex++
      this.isShowSolution = false
    },
    resetQuiz() {
      // turn off settings if on
      if (this.settingsOn) {
        this.settingsOn = false
      }

      // reset to initial values
      this.questions = []
      this.questionIndex = 0
      this.selectedAnswer = null
      this.isShowSolution = false

      // send network request for quiz data
      this.getQuizData()
    },
    getQuizData() {
      const params = this.settingsData
      let initilized = 0
      const url = `https://opentdb.com/api.php?amount=${params.amount}&category=${params.category}&difficulty=${params.difficulty}&type=multiple`

      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((response) => {
          // format response data and store it in questions array
          this.questions = response.results.map((item) => {
            // create new array by shuffling correct and incorrect answers
            const options = shuffle([item.correct_answer, ...item.incorrect_answers])
            // find index of correct answer and store it in a constant
            const correctIndex = options.findIndex((option) => {
              return option == item.correct_answer
            })
            return {
              question: item.question,
              options: options,
              correctAnswer: item.correct_answer,
              correctIndex: correctIndex,
              isAnswered: false,
              isCorrect: false,
            }
          })
          this.isError = false
        })
        .catch(() => {
          // in case of error repeat request for max 4 times with 250ms timeout
          initilized++
          if (initilized < 4) {
            setTimeout(() => {
              this.getQuizData()
            }, 250)
          } else {
            // display error
            this.isError = true
          }
        })
    },
  },
})
