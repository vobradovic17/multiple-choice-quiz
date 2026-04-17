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
    fetching: false,
    apiParams: {
      type: 'history',
      question: 1,
      questionstotal: 10,
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
    questionOptions: (state) => {
      return state.activeQuestion?.options
    },
  },
  actions: {
    toggleSettings() {
      this.settingsOn = !this.settingsOn
    },
    updateSettings(event) {
      this.apiParams[event.target.name] = event.target.value
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
      this.apiParams.question = Number(this.apiParams.question) + 1;
      this.isShowSolution = false
      this.getQuizData();
    },
    resetQuiz() {
      // turn off settings if on
      if (this.settingsOn) {
        this.settingsOn = false
      }

      // reset to initial values
      this.questions = Array(Number(this.apiParams.questionstotal)).fill([])
      this.questionIndex = 0
      this.apiParams.question = 1;
      this.selectedAnswer = null
      this.isShowSolution = false
      this.isError = false;

      // send network request for quiz data
      this.getQuizData()
    },
    getQuizData() {
      this.fetching = true;

      const params = this.apiParams
      const url = `https://vo17-education.work/quiz?type=${params.type}&question=${params.question}&questionstotal=${params.questionstotal}`

      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((result) => {
          let newQuestion = result.results.map((item) => {
            // create new array by shuffling correct and incorrect answers
            const options = shuffle(item.answers)
            // find index of correct answer and store it in a constant
            const correctIndex = options.findIndex((answer) => {
              return answer.correct
            })

            return {
              subject: item.subject,
              theme: item.theme,
              question: item.question,
              options: options,
              correctIndex: correctIndex,
              solution: item.solution,
              isAnswered: false,
              isCorrect: false,
            }
          })
          this.questions.splice(this.questionIndex, 1, newQuestion[0])

          this.fetching = false
        })
        .catch(() => {
          // display error
          this.isError = true
        })
    },
  },
})
