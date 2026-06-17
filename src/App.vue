<script setup>
import { quizData } from './store/store'

const store = quizData()

import SettingsMenu from './components/Settings-menu.vue'
import QuizSolution from './components/Quiz-solution.vue'
import QuizHeader from './components/Quiz-header.vue'
import QuizMain from './components/Quiz-main.vue'
import QuizFooter from './components/Quiz-footer.vue'
import QuizError from './components/Quiz-error.vue'

// send network request for quiz data
store.loadSettings();
store.questions = Array(Number(store.apiParams.questionstotal)).fill([])
store.getQuizData()
</script>

<template>
  <div class="mcq-component__wrapper">
    <div class="mcq-component" :class="{'mcq-component--show-solution' : store.solutionShown && !store.solutionClosed}">
      <SettingsMenu v-if="store.settingsOn"></SettingsMenu>
      <div class="mcq-component__inner">
        <QuizHeader></QuizHeader>
        <hr />
        <QuizMain v-if="!store.isError"></QuizMain>
        <QuizError v-else></QuizError>
        <QuizFooter></QuizFooter>
      </div>
      <QuizSolution></QuizSolution>
    </div>
  </div>
</template>

<style lang="scss">
.mcq-component__wrapper {
  min-height: calc(100vh - 16px);
  clip-path: polygon(0 0px, 100% 0px, 100% 100%, 0 100%);
}

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

  .mcq-component__inner {
    padding: 10px;
    border: 1px solid var(--outer-border-color);
    background-color: var(--bg-color);
    border-radius: 4px 4px 8px 8px;
  }

  &.mcq-component--show-solution {
    .mcq-component__inner {
      border-radius: 4px 4px 0 0;
    }
    .mcq-solution {
      position: relative;
      transform: translateY(0);
      transition: transform 0.5s;
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

  .mcq-body--hidden {
    visibility: hidden;
  }

  @keyframes marker-appear {
    0% {
      opacity: 0;
      transform: scale(0.75);
    }
    50% {
      opacity: 1;
    }
    75% {
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.mcq-explanation {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 776px;
  width: calc(100% - 16px);
  text-align: center;
  z-index: -2;
}
</style>
