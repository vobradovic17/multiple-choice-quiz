<script setup>
import { ref, computed } from 'vue'
import { quizData } from '../store/store'
const store = quizData()

// set values on component create. checked later to see if resetQuiz needs to be trigerred.
const quizType = ref(store.apiParams.type)
const quizQuestions = ref(store.apiParams.questionstotal)

const settingsChanged = computed(() => {
  return quizType.value != store.apiParams.type || quizQuestions.value != store.apiParams.questionstotal
})

function closeSettings() {
  if (settingsChanged.value) {
    store.resetQuiz();
  }
  else {
    store.closeSettings()
  }
}
</script>
<template>
  <div class="mcq-settings" data-testid="mcq-settings">
    <div class="mcq-header">
      <p class="mcq-title">Settings</p>
    </div>
    <hr />
    <div class="mcq-settings__wrapper">
      <div class="mcq-settings__container">
        <label class="mcq-settings__label" for="type-select">Quiz type:</label>
        <select
          class="mcq-settings__select"
          name="type"
          id="type-select"
          :value="store.apiParams.type"
          @change="store.updateSettings"
        >
          <option value="history">History</option>
          <option value="geography">Geography</option>
        </select>
      </div>
      <div class="mcq-settings__container">
        <label class="mcq-settings__label" for="questionstotal-select">Number of questions:</label>
        <input
          class="mcq-settings__input"
          type="number"
          name="questionstotal"
          id="questionstotal-select"
          min="3"
          max="10"
          :value="store.apiParams.questionstotal"
          @change="store.updateSettings"
        />
      </div>
    </div>
    <div class="mcq-settings__footer">
      <button
        class="mcq-button mcq-button--reset mcq-button--align-right"
        @click="store.resetQuiz"
        aria-label="reset quiz"
      >
        &#8634;
      </button>
      <button
        class="mcq-button mcq-button--align-right"
        @click="closeSettings"
        data-testid="mcq-toggle-settings"
        aria-label="toggle settings"
      >
        !
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.mcq-settings {
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  padding: 10px;
  outline: 1px solid var(--outer-border-color);
  outline-offset: -1px;
  border-radius: 4px 4px 8px 8px;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  z-index: 1;

  hr {
    width: 100%;
  }

  .mcq-settings__wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 12px;
  }

  .mcq-settings__container {
    display: flex;
    flex-direction: column;

    label {
      display: block;
    }
  }

  .mcq-settings__label {
    font-size: 1.12em;
  }

  .mcq-settings__input {
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
}
</style>
