<script setup>
import { computed } from 'vue'

const props = defineProps([
  'settingsOn',
  'selectedAnswer',
  'isShowSolution',
  'activeQuestion',
  'isSubmitted',
  'isCorrect',
])
defineEmits(['selectAnswer'])

const questionText = computed(() => {
  return props.activeQuestion?.question
})

const questionOptions = computed(() => {
  return props.activeQuestion?.options
})
</script>
<template>
  <div class="mcq-body" :class="{ 'mcq-hidden': settingsOn }">
    <p class="mcq-question" v-html="questionText"></p>
    <div class="mcq-options">
      <button
        v-for="(option, index) in questionOptions"
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
        @click="$emit('selectAnswer', index)"
      >
        <span v-html="option"></span>
        <div class="mcq-options__marker"></div>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.mcq-body {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px;
  margin-bottom: 15px;
  min-height: 158px;

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
}
</style>
