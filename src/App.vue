<script setup>
import { ref, computed } from 'vue'
import { shuffle } from 'lodash-es'

import SettingsMenu from './components/Settings-menu.vue'
import QuizHeader from './components/Quiz-header.vue'
import QuizMain from './components/Quiz-main.vue'
import QuizFooter from './components/Quiz-footer.vue'
import QuizError from './components/Quiz-error.vue'

// quiz constants
const questions = ref([])
const questionIndex = ref(0)
const selectedAnswer = ref(null)
const isShowSolution = ref(false)

// settings constants
const settingsOn = ref(false)
const settingsData = {
  amount: '10',
  category: '22',
  difficulty: '',
}

// update settingsData after prop value changes in child component
function updateSettings(payload) {
  settingsData[Object.keys(payload)[0]] = Object.values(payload)[0]
}

// active quiz question
const activeQuestion = computed(() => {
  return questions.value[questionIndex.value]
})

// is answer submitted
const isSubmitted = computed(() => {
  return activeQuestion.value?.isAnswered
})

// is answer correct
const isCorrect = computed(() => {
  return activeQuestion.value?.isCorrect
})

function toggleSettings() {
  settingsOn.value = !settingsOn.value
}

function selectAnswer(index) {
  selectedAnswer.value = index
}

function checkAnswer() {
  questions.value[questionIndex.value].isAnswered = true

  questions.value[questionIndex.value].isCorrect =
    selectedAnswer.value == activeQuestion.value.correctIndex
}

function showSolution() {
  isShowSolution.value = true
}

function nextQuestion() {
  selectedAnswer.value = null
  questionIndex.value++
  isShowSolution.value = false
}

function resetQuiz() {
  // turn off settings if on
  if (settingsOn.value) {
    settingsOn.value = false
  }

  // reset to initial values
  questions.value = []
  questionIndex.value = 0
  selectedAnswer.value = null
  isShowSolution.value = false

  // send network request for quiz data
  getQuizData()
}

// constants used in fetching data from the internet
let initilized = 0
const isError = ref(false)

// get quiz data from the internet
function getQuizData() {
  const url = `https://opentdb.com/api.php?amount=${settingsData.amount}&category=${settingsData.category}&difficulty=${settingsData.difficulty}&type=multiple`
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((response) => {
      // format response data and store it in questions array
      questions.value = response.results.map((item) => {
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
      isError.value = false
    })
    .catch(() => {
      // in case of error repeat request for max 4 times with 250ms timeout
      initilized++
      if (initilized < 4) {
        setTimeout(() => {
          getQuizData()
        }, 250)
      } else {
        // display error
        isError.value = true
      }
    })
}

// send network request for quiz data
getQuizData()
</script>

<template>
  <div class="mcq-component">
    <SettingsMenu
      v-if="settingsOn"
      :settingsData="settingsData"
      @updateSettings="updateSettings"
      @resetQuiz="resetQuiz"
      @toggleSettings="toggleSettings"
    ></SettingsMenu>
    <QuizHeader :questions="questions" :questionIndex="questionIndex"></QuizHeader>
    <hr />
    <QuizMain
      v-if="!isError"
      :settingsOn="settingsOn"
      :selectedAnswer="selectedAnswer"
      :isShowSolution="isShowSolution"
      :activeQuestion="activeQuestion"
      :isSubmitted="isSubmitted"
      :isCorrect="isCorrect"
      @selectAnswer="selectAnswer"
    ></QuizMain>
    <QuizError v-else></QuizError>
    <QuizFooter
      :settingsOn="settingsOn"
      :isSubmitted="isSubmitted"
      :isCorrect="isCorrect"
      :questions="questions"
      :questionIndex="questionIndex"
      @resetQuiz="resetQuiz"
      @checkAnswer="checkAnswer"
      @showSolution="showSolution"
      @nextQuestion="nextQuestion"
      @toggleSettings="toggleSettings"
    ></QuizFooter>
  </div>
</template>

<style lang="scss">
.mcq-component {
  --bg-color: #eaeaea;
  --button-bg: #d6dceb;
  --outer-border-color: #606060;
  --border-color: #6a7dae;
  --color-active: #3992ef;
  --color-success: #51861a;
  --color-fail: #ca041c;

  position: relative;
  max-width: 776px;
  margin: auto;
  padding: 10px;
  background-color: var(--bg-color);
  border: 1px solid var(--outer-border-color);
  border-radius: 4px 4px 8px 8px;

  .mcq-button {
    cursor: pointer;
    width: 32px;
    height: 32px;
    font-size: 22px;
    background-color: var(--button-bg);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    transition: all 0.15s;

    &:hover {
      border-color: var(--color-active);
      box-shadow: 0 0 1px 1px var(--color-active);
    }

    &:active {
      box-shadow: 0 0 1px 2px var(--color-active);
    }
  }

  .mcq-button--reset {
    transform: rotate(90deg) scaleX(-1);
  }

  .mcq-button--align-right {
    margin-left: auto;
  }

  .mcq-button--smaller {
    font-size: 16px;
  }

  .mcq-hidden {
    visibility: hidden;
  }
}
</style>
