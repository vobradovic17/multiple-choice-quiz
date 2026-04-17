<script setup>
import { quizData } from '../store/store'
const store = quizData()
</script>
<template>
  <div class="mcq-solution" data-testid="mcq-solution">
    <p class="mcq-solution__text" v-html="store.activeQuestion.solution"></p>
  </div>
</template>

<style lang="scss">
.mcq-solution {
    .mcq-solution__text {
        border-top: 1px solid var(--outer-border-color);
        margin: 0;
        padding: 10px;
        font-size: 18px;
        line-height: 1.2;
        text-align: justify;
    }
}
</style>
