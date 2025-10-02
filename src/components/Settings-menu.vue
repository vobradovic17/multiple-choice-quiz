<script setup>
defineProps(['settingsData'])
const emit = defineEmits(['updateSettings', 'resetQuiz', 'toggleSettings'])

function updateValue(event) {
  emit('updateSettings', {
    [event.target.name]: event.target.value,
  })
}
</script>
<template>
  <div class="mcq-settings">
    <div class="mcq-header">
      <p class="mcq-title">Settings</p>
    </div>
    <hr />
    <div class="mcq-settings__wrapper">
      <div class="mcq-settings__container">
        <label class="mcq-settings__label" for="amount-select">Number of questions:</label>
        <input
          class="mcq-settings__input"
          type="number"
          name="amount"
          id="amount-select"
          min="3"
          max="10"
          :value="settingsData.amount"
          @change="updateValue"
        />
      </div>
      <div class="mcq-settings__container">
        <label class="mcq-settings__label" for="category-select">Choose category:</label>
        <select
          class="mcq-settings__select"
          name="category"
          id="category-select"
          :value="settingsData.category"
          @change="updateValue"
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
          :value="settingsData.difficulty"
          @change="updateValue"
        >
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
    <div class="mcq-settings__footer">
      <button
        class="mcq-button mcq-button--reset mcq-button--align-right"
        @click="$emit('resetQuiz')"
        aria-label="reset quiz"
      >
        &#8634;
      </button>
      <button
        class="mcq-button mcq-button--align-right"
        @click="$emit('toggleSettings')"
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
}
</style>
