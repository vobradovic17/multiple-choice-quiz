<script setup>
import { quizData } from '@/store/store'
const store = quizData()
</script>
<template>
  <div class="mcq-footer" :class="{ 'mcq-hidden': store.settingsOn }">
    <button
      class="mcq-button mcq-button--reset mcq-button--align-right mcq-button--smaller"
      @click="store.resetQuiz"
      aria-label="reset quiz"
    >
      &#8634;
    </button>
    <button
      class="mcq-footer__button"
      :class="{
        'mcq-footer__button--correct': store.isSubmitted && store.isCorrect,
        'mcq-footer__button--wrong': store.isSubmitted && !store.isCorrect,
      }"
      @click="store.checkAnswer"
      :disabled="store.isSubmitted"
    >
      {{ !store.isSubmitted ? 'Check' : store.isCorrect ? 'Correct' : 'Wrong' }}
    </button>
    <div class="mcq__controls">
      <button
        v-if="store.isSubmitted && !store.isCorrect"
        class="mcq-button mcq-button--smaller"
        @click="store.showSolution"
        aria-label="show solution"
      >
        ?
      </button>
      <button
        v-if="store.isSubmitted && store.questionIndex < store.questions.length - 1"
        class="mcq-button mcq-button--smaller"
        @click="store.nextQuestion"
        aria-label="next question"
      >
        >>
      </button>
      <button
        class="mcq-button mcq-button--align-right"
        @click="store.toggleSettings"
        aria-label="toggle settings"
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

  @media (max-width: 480px) {
    .mcq-footer__button {
      font-size: 0.88em;
    }
  }
}
</style>
