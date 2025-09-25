<script setup>
import { ref, computed } from 'vue'
import { shuffle } from 'lodash-es'

// quiz constants
const questions = ref([])
const questionIndex = ref(0)
const selectedAnswer = ref(null)
const isShowSolution = ref(false)

// settings constants
const settingsOn = ref(false)
const questionCount = ref('10')
const category = ref('22')
const difficulty = ref('')

// active quiz question
const activeQuestion = computed(() => {
  return questions.value[questionIndex.value]
})

// is answer submitted
const isSubmitted = computed(() => {
  return activeQuestion.value.isAnswered
})

// is answer correct
const isCorrect = computed(() => {
  return activeQuestion.value.isCorrect
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
  const url = `https://opentdb.com/api.php?amount=${questionCount.value}&category=${category.value}&difficulty=${difficulty.value}&type=multiple`
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
    <div class="mcq-settings" v-if="settingsOn">
      <div class="mcq-header">
        <p class="mcq-title">Settings</p>
      </div>
      <hr />
      <div class="mcq-settings__wrapper">
        <div class="mcq-settings__container">
          <label class="mcq-settings__label" for="questionsnumber">Number of questions:</label>
          <input
            class="mcq-settings__input"
            type="number"
            name="questionsnumber"
            id="questionsnumber"
            min="3"
            max="10"
            v-model="questionCount"
          />
        </div>
        <div class="mcq-settings__container">
          <label class="mcq-settings__label" for="category-select">Choose category:</label>
          <select
            class="mcq-settings__select"
            name="category"
            id="category-select"
            v-model="category"
          >
            <option value="18">Computers</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
            <option value="25">Art</option>
            <option value="21">Sports</option>
          </select>
        </div>
        <div class="mcq-settings__container">
          <label class="mcq-settings__label" for="difficulty-select">Choose difficulty:</label>
          <select
            class="mcq-settings__select"
            name="difficulty"
            id="difficulty-select"
            v-model="difficulty"
          >
            <option value="">Any</option>
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div class="mcq-settings__footer">
        <button
          class="mcq-button mcq-button--reset mcq-button--align-right"
          @click="resetQuiz"
          aria-label="reset quiz"
        >
          &#8634;
        </button>
        <button
          class="mcq-button mcq-button--align-right"
          @click="toggleSettings"
          aria-label="toggle settings"
        >
          !
        </button>
      </div>
    </div>
    <div class="mcq-header">
      <p class="mcq-title">Multiple Choice Quiz</p>
      <div class="mcq-bullets">
        <div
          v-for="(question, index) in questions"
          :key="`question-${index}`"
          class="mcq-bullets__bullet"
          :class="{
            'mcq-bullets__bullet--active': index == questionIndex,
            'mcq-bullets__bullet--correct': question.isAnswered && question.isCorrect,
            'mcq-bullets__bullet--wrong': question.isAnswered && !question.isCorrect,
          }"
        ></div>
      </div>
    </div>
    <hr />
    <div class="mcq-body" :class="{ 'mcq-hidden': settingsOn }" v-if="!isError">
      <p class="mcq-question" v-html="activeQuestion.question"></p>
      <div class="mcq-options">
        <button
          v-for="(option, index) in activeQuestion.options"
          :key="`option-${index}`"
          :disabled="isSubmitted"
          class="mcq-options__option"
          :class="{
            'mcq-options__option--selected': index == selectedAnswer && !isSubmitted,
            'mcq-options__option--correct': index == selectedAnswer && isSubmitted && isCorrect,
            'mcq-options__option--wrong': index == selectedAnswer && isSubmitted && !isCorrect,
            'mcq-options__option--showsolution':
              isShowSolution && index == activeQuestion.correctIndex,
            'mcq-options__option--disabled': isSubmitted,
          }"
          @click="selectAnswer(index)"
        >
          <span v-html="option"></span>
          <div class="mcq-options__marker"></div>
        </button>
      </div>
    </div>
    <div v-else class="mcq-error">
      <p>ERROR OCCURRED WHILE CONNECTING TO SERVER.</p>
      <p>PLEASE CLICK RESET OR REFRESH PAGE.</p>
    </div>
    <div class="mcq-footer" :class="{ 'mcq-hidden': settingsOn }">
      <button
        class="mcq-button mcq-button--reset mcq-button--align-right mcq-button--smaller"
        @click="resetQuiz"
        aria-label="reset quiz"
      >
        &#8634;
      </button>
      <button
        class="mcq-footer__button"
        :class="{
          'mcq-footer__button--correct': isSubmitted && isCorrect,
          'mcq-footer__button--wrong': isSubmitted && !isCorrect,
        }"
        @click="checkAnswer"
        :disabled="isSubmitted"
      >
        {{ !isSubmitted ? 'Check' : isCorrect ? 'Correct' : 'Wrong' }}
      </button>
      <div class="mcq__controls">
        <button
          v-if="isSubmitted && !isCorrect"
          class="mcq-button mcq-button--smaller"
          @click="showSolution"
          aria-label="show solution"
        >
          ?
        </button>
        <button
          v-if="isSubmitted && questionIndex < questions.length - 1"
          class="mcq-button mcq-button--smaller"
          @click="nextQuestion"
          aria-label="next question"
        >
          >>
        </button>
        <button
          class="mcq-button mcq-button--align-right"
          @click="toggleSettings"
          aria-label="toggle settings"
        >
          !
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

  .mcq-settings {
    position: absolute;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    z-index: 1;

    hr {
      width: 100%;
    }
  }

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

  .mcq-settings__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 48px;
  }

  .mcq-settings__container {
    flex-basis: 100%;

    label {
      display: block;
    }
  }

  .mcq-settings__label {
    font-size: 1.12em;
  }

  .mcq-settings__input {
    width: 100%;
    height: 32px;
    font-size: 1em;
    padding: 0px 10px;
    margin: 4px 0;
    border: 1px solid var(--border-color);
    background-color: var(--button-bg);
  }

  .mcq-settings__select {
    width: 100%;
    height: 34px;
    font-size: 1em;
    padding: 5px 35px 5px 5px;
    margin: 4px 0;
    border: 1px solid var(--border-color);
    background-color: var(--button-bg);
  }

  .mcq-settings__footer {
    display: flex;
    justify-content: center;
    margin-top: auto;

    .mcq-button--reset {
      position: relative;
      right: -32px;
    }
  }

  .mcq-header {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .mcq-title {
    font-size: 1.5em;
    margin: 10px 0;
  }

  .mcq-bullets {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 2px 0 auto;
  }

  .mcq-bullets__bullet {
    display: flex;
    width: 18px;
    height: 18px;
    margin-left: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--button-bg);

    &.mcq-bullets__bullet--active {
      border: 1px solid var(--color-active);
      box-shadow: 0 0 1px 1px var(--color-active);
    }

    &.mcq-bullets__bullet--correct {
      background: var(--color-success) url('../public/check-mark.svg') center / 60% no-repeat;
    }

    &.mcq-bullets__bullet--wrong {
      background: var(--color-fail) url('../public/cross-mark.svg') center / 60% no-repeat;
    }
  }

  .mcq-error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 240px;
    margin-bottom: 15px;
  }

  .mcq-body {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    gap: 10px;
    margin-bottom: 15px;
  }

  .mcq-question {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    font-size: 1.5em;
    margin: 10px 0 15px 0;
  }

  .mcq-options {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .mcq-options__option {
    cursor: pointer;
    position: relative;
    padding: 10px 2%;
    font-size: 1.12em;
    color: #000;
    border: 1px solid var(--border-color);
    border-radius: 16px;
    background-color: var(--button-bg);
    transition: all 0.15s;

    &:not(.mcq-options__option--disabled):hover {
      border-color: var(--color-active);
      box-shadow: 0 0 1px 1px var(--color-active);
    }

    &:not(.mcq-options__option--disabled):active {
      box-shadow: 0 0 1px 2px var(--color-active);
    }

    &:nth-of-type(1) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    &:nth-of-type(2) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    &:nth-of-type(3) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    &:nth-of-type(4) {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }
  }

  .mcq-options__option--selected {
    border: 1px solid var(--color-active);
    background-color: #95c2f1;
  }

  .mcq-options__option--correct {
    border: 1px solid var(--color-success);
    box-shadow: 0 0 1px 1px var(--color-success);

    .mcq-options__marker {
      background-image: url('../public/check-mark.svg');
      background-color: var(--color-success);
    }
  }

  .mcq-options__option--wrong {
    border: 1px solid var(--color-fail);
    box-shadow: 0 0 1px 1px var(--color-fail);

    .mcq-options__marker {
      background-image: url('../public/cross-mark.svg');
      background-color: var(--color-fail);
    }
  }

  .mcq-options__option--showsolution {
    border: 1px solid var(--color-success);
    box-shadow: 0 0 1px 1px var(--color-success);

    .mcq-options__marker {
      background-image: url('../public/check-mark.svg');
      background-color: var(--color-success);
    }
  }

  .mcq-options__option--disabled {
    cursor: auto;
    color: #000;
  }

  .mcq-options__marker {
    position: absolute;
    top: -20%;
    right: -2%;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
  }

  .mcq-footer {
    display: grid;
    grid-template-columns: 4fr 2fr 4fr;
    align-items: center;
  }

  .mcq__controls {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mcq-footer__button {
    grid-column: 2 / 3;
    cursor: pointer;
    width: 90%;
    padding: 8px;
    margin: auto;
    font-size: 1.12em;
    background-color: var(--button-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    transition: all 0.15s;

    &:not(.mcq-footer__button--correct):not(.mcq-footer__button--wrong):hover {
      box-shadow: 0 0 1px 1px var(--color-active);
    }

    &:not(.mcq-footer__button--correct):not(.mcq-footer__button--wrong):active {
      box-shadow: 0 0 1px 2px var(--color-active);
    }

    &.mcq-footer__button--correct {
      color: var(--color-success);
      border-color: var(--color-success);
      box-shadow: 0 0 1px 1px var(--color-success);
      cursor: auto;
    }

    &.mcq-footer__button--wrong {
      color: var(--color-fail);
      border-color: var(--color-fail);
      box-shadow: 0 0 1px 1px var(--color-fail);
      cursor: auto;
    }
  }

  .mcq-hidden {
    visibility: hidden;
  }
}
</style>
