<script setup>
import { quizData } from '../store/store'
const store = quizData()
</script>
<template>
  <div class="mcq-solution" data-testid="mcq-solution">
    <p class="mcq-solution__text" :aria-hidden="store.solutionShown && !store.solutionClosed ? false : true" v-html="store.activeQuestion.solution"></p>
  </div>
</template>

<style lang="scss">
.mcq-solution {
    position: absolute;
    z-index: -1;
    transform: translateY(-100%);
    transition: transform 0.3s;
    background-color: var(--bg-color);
    border: 1px solid var(--outer-border-color);
    border-top: 0;
    border-radius: 0 0 8px 8px;

    .mcq-solution__text {
      margin: 0;
      padding: 10px;
      font-size: 18px;
      line-height: 1.2;
      text-align: justify;
    }
}
</style>
