<script setup>
import { quizData } from './store/store'

const store = quizData()

import SettingsMenu from './components/Settings-menu.vue'
import QuizHeader from './components/Quiz-header.vue'
import QuizMain from './components/Quiz-main.vue'
import QuizFooter from './components/Quiz-footer.vue'
import QuizError from './components/Quiz-error.vue'

// send network request for quiz data
store.getQuizData()
</script>

<template>
  <div class="mcq-component">
    <SettingsMenu v-if="store.settingsOn"></SettingsMenu>
    <QuizHeader></QuizHeader>
    <hr />
    <QuizMain v-if="!store.isError"></QuizMain>
    <QuizError v-else></QuizError>
    <QuizFooter></QuizFooter>
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
