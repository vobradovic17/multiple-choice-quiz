<script setup>
import { quizData } from '../store/store'
const store = quizData()

function next() {
  // close solution before moving to next question
  if (store.solutionShown) {
    store.solutionClosed = true;
    setTimeout(() => {
      store.nextQuestion()
    }, 500)
  }
  else {
    store.nextQuestion()
  }
}

function reset() {
  // close solution before triggering resetQuiz
  if (store.solutionShown) {
    store.solutionClosed = true;
    setTimeout(() => {
      store.resetQuiz()
    }, 500)
  }
  else {
    store.resetQuiz()
  }
}
</script>
<template>
  <div class="mcq-footer" :class="{ 'mcq-body--hidden': store.settingsOn }" data-testid="mcq-footer">
    <button
      class="mcq-button mcq-button--reset mcq-button--align-right mcq-button--smaller"
      :class="{'mcq-button--disabled': store.fetching}"
      @click="reset"
      data-testid="mcq-reset-button"
      aria-label="reset quiz"
      :disabled="store.fetching"
    >
      &#8634;
    </button>
    <button
      class="mcq-footer__button"
      :class="{
        'mcq-footer__button--correct': store.isSubmitted && store.isCorrect,
        'mcq-footer__button--wrong': store.isSubmitted && !store.isCorrect,
        'mcq-button--disabled': store.fetching
      }"
      @click="store.checkAnswer"
      data-testid="mcq-check-button"
      :disabled="store.isSubmitted || store.fetching"
    >
      {{ !store.isSubmitted ? 'Check' : store.isCorrect ? 'Correct' : 'Wrong' }}
    </button>
    <div class="mcq__controls">
      <button
        v-if="store.isSubmitted && !store.isCorrect"
        class="mcq-button mcq-button--smaller"
        @click="store.showSolution"
        data-testid="mcq-solution-button"
        aria-label="show solution"
      >
        ?
      </button>
      <button
        v-if="store.isSubmitted && store.questionIndex < store.questions.length - 1"
        class="mcq-button mcq-button--smaller"
        @click="next"
        data-testid="mcq-next-button"
        aria-label="next question"
      >
        >>
      </button>
      <button
        class="mcq-button mcq-button--align-right"
        :class="{'mcq-button--disabled': store.fetching}"
        @click="store.openSettings"
        data-testid="mcq-settings-button"
        aria-label="toggle settings"
        :disabled="store.fetching"
      >
        !
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.mcq-footer {
  display: grid;
  grid-template-columns: 4fr 2fr 4fr;
  align-items: center;

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

  .mcq-button--disabled {
    cursor: auto;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .mcq-footer__button {
      font-size: 0.88em;
      padding: 8px 4px;
    }
  }

  @media (max-width: 390px) {
    .mcq-footer__button {
      font-size: 0.74em;
    }
  }
}
</style>
