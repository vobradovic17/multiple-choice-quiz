<script setup>
import { quizData } from '../store/store'
const store = quizData()
</script>
<template>
  <div class="mcq-header" data-testid="mcq-header">
    <div class="mcq-header__inner">
      <p class="mcq-title">Multiple Choice Quiz</p>
      <p class="mcq-theme">Theme:
        <span class="mcq-theme__text" :class="{'mcq-theme__text--fetching': store.fetching}"> {{ store.activeQuestion.theme }}</span></p>
    </div>
    <div class="mcq-bullets">
      <div
        v-for="(question, index) in store.questions"
        :key="`question-${index}`"
        data-testid="mcq-bullet"
        class="mcq-bullets__bullet"
        :class="{
          'mcq-bullets__bullet--active': index == store.questionIndex,
          'mcq-bullets__bullet--correct': question.isAnswered && question.isCorrect,
          'mcq-bullets__bullet--wrong': question.isAnswered && !question.isCorrect,
        }"
      ></div>
    </div>
    <div class="mcq-image-preload">
      <img aria-label="hidden" src="/check-mark.svg" alt="check mark icon" />
      <img aria-label="hidden" src="/cross-mark.svg" alt="cross mark icon" />
    </div>
  </div>
</template>

<style lang="scss">
.mcq-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  .mcq-header__inner > p {
    margin: 0;
  }

  .mcq-title {
    font-size: 1.5em;
    margin: 10px 0;
  }

  .mcq-theme__text--fetching {
    position: relative;
    display: inline-block;
    overflow: hidden;
    padding-bottom: 4px;
    min-width: 188px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      bottom: 0;
    }

    &::before {
      background: rgba(0, 0, 0, 0.12);
    }

    &::after {
      width: 25%;
      background: linear-gradient(90deg, transparent 0%, var(--color-active) 45%, var(--color-active) 55%, transparent 100%);
      animation: fetching-slide 1.1s ease-in-out infinite;
      transform: translateX(-100%);
    }
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
      background: var(--color-success) url('/check-mark.svg') center / 60% no-repeat;
    }

    &.mcq-bullets__bullet--wrong {
      background: var(--color-fail) url('/cross-mark.svg') center / 60% no-repeat;
    }
  }

  .mcq-image-preload {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
}

@keyframes fetching-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}
</style>
