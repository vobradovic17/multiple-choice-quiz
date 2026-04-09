import { beforeAll, describe, expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { screen } from '@testing-library/dom'

import MultipleChoiceQuiz from '../App.vue'
import { setActivePinia, createPinia } from 'pinia'
import { quizData } from '../store/store'
import mockData from './mockData.js'

describe('Multiple Choice Quiz', () => {
  let store = null

  beforeAll(() => {
    setActivePinia(createPinia())
    store = quizData()
    // override function not to call API
    store.getQuizData = () => {
      // mock question data
      store.questions = mockData
    }
  })

  test('Header is rendered', async () => {
    await render(MultipleChoiceQuiz)

    let headerElement = await screen.findByTestId('mcq-header')

    await expect.element(headerElement).toBeInTheDocument()
  })

    test('Header title is displayed', async () => {
      await render(MultipleChoiceQuiz)
      
      let headerTitle = await screen.findByText('Multiple Choice Quiz')

      await expect.element(headerTitle).toBeInTheDocument()
  })

  test('Question bullets are displayed in component header', async () => {
    await render(MultipleChoiceQuiz);

    let bullets = await screen.findAllByTestId('mcq-bullet');

    let bulletsNumber = bullets.length;
    let questionNumber = store.questions.length;

    expect(bulletsNumber).toBeTruthy()
    expect(questionNumber).toBeTruthy()
    expect(bulletsNumber).toBe(questionNumber);

    await expect.element(bullets[0]).toHaveClass('mcq-bullets__bullet--active')

    await expect.element(bullets[0]).toHaveStyle({
      'box-shadow': '0 0 1px 1px #3992ef',
      'border': '1px solid #3992ef'
    })
  })

  test('Question text is displayed', async () => {
    await render(MultipleChoiceQuiz);

    let questionText = await screen.findByTestId("mcq-question");

    expect(questionText.innerText).toBeTruthy()
  })

  test('Question options are displayed', async () => {
    await render(MultipleChoiceQuiz);

    let buttons = await screen.findAllByTestId('mcq-option');

    buttons.forEach(async (button) => {
      await expect.element(button).toBeInTheDocument();
      expect(button.innerText).toBeTruthy();
    })
  })

  test('Footer is rendered', async () => {
    await render(MultipleChoiceQuiz)

    let footerElement = await screen.findByTestId('mcq-footer')

    await expect.element(footerElement).toBeInTheDocument()
  })

  test('Check button is rendered correctly', async () => {
    await render(MultipleChoiceQuiz);

    let checkButton = await screen.findByTestId('mcq-check-button');

    await expect.element(checkButton).toBeInTheDocument();
    expect(checkButton.innerText).toBe("Check")
    
  })

  test('Reset button is rendered correctly', async () => {
    await render(MultipleChoiceQuiz);

    let resetButton = await screen.findByTestId('mcq-reset-button');

    await expect.element(resetButton).toBeInTheDocument();
    expect(resetButton.innerText).toBe("↺")
  })

  test('Settings button is rendered correctly', async () => {
    await render(MultipleChoiceQuiz);

    let settingsButton = await screen.findByTestId('mcq-settings-button');

    await expect.element(settingsButton).toBeInTheDocument();
    expect(settingsButton.innerText).toBe("!")
  })

  test('Settings button is functioning', async () => {
    await render(MultipleChoiceQuiz);

    let settingsButton = await screen.findByTestId('mcq-settings-button');

    await userEvent.click(settingsButton)

    let settingsWrapper = await screen.findByTestId('mcq-settings');

    await expect.element(settingsWrapper).toBeInTheDocument();

    let toggleSettingsButton = await screen.findByTestId('mcq-toggle-settings');

    await userEvent.click(toggleSettingsButton)

    await expect.element(settingsWrapper).not.toBeInTheDocument();
  })

  test('Answer is selected', async () => {
    await render(MultipleChoiceQuiz);

    let correctOptionButton = await page.getByRole('button').filter({ has: page.getByText('Albany') })

    await userEvent.click(correctOptionButton)

    await expect.element(correctOptionButton).toHaveClass('mcq-options__option--selected')

    await expect.element(correctOptionButton).toHaveStyle({
      'background-color': '#95c2f1',
      'border': '1px solid #3992ef'
    })
  })

  test('Reset button is functioning', async () => {
    await render(MultipleChoiceQuiz);

    let resetButton = await screen.findByTestId('mcq-reset-button');

    await userEvent.click(resetButton)

    let correctOptionButton = await page.getByRole('button').filter({ has: page.getByText('Albany') })

    await expect.element(correctOptionButton).not.toHaveClass('mcq-options__option--selected')
  })

  test('Correct answer is submitted', async () => {
    await render(MultipleChoiceQuiz);

    let correctOptionButton = await page.getByRole('button').filter({ has: page.getByText('Albany') })

    await userEvent.click(correctOptionButton)

    let checkButton = await screen.findByTestId('mcq-check-button');

    await userEvent.click(checkButton)

    await expect.element(checkButton).toHaveTextContent('Correct')

    await expect.element(correctOptionButton).toHaveClass('mcq-options__option--correct')
    await expect.element(correctOptionButton).toBeDisabled();

    await expect.element(correctOptionButton).toHaveStyle({
      'box-shadow': '0 0 1px 1px #51861a',
      'border': '1px solid #51861a'
    })
  })

  test('Next button is displayed', async () => {
    await render(MultipleChoiceQuiz);

    let nextButton = await screen.findByTestId('mcq-next-button');

    await expect.element(nextButton).toBeInTheDocument();
    expect(nextButton.innerText).toBe(">>")
  })

  test('Move to next question', async () => {
    await render(MultipleChoiceQuiz);

    let nextButton = await screen.findByTestId('mcq-next-button');

    await userEvent.click(nextButton)

    let questionText = await screen.findByTestId("mcq-question");

    expect(questionText).toHaveTextContent('In which English county is the city of Portsmouth?')
  })

  test('Wrong answer is selected and submitted', async () => {
    await render(MultipleChoiceQuiz);

    let wrongOptionButton = await page.getByRole('button').filter({ has: page.getByText('Buckinghamshire') })

    await userEvent.click(wrongOptionButton)

    let checkButton = await screen.findByTestId('mcq-check-button');

    await userEvent.click(checkButton)

    await expect.element(checkButton).toHaveTextContent('Wrong')

    await expect.element(wrongOptionButton).toHaveClass('mcq-options__option--wrong')
    await expect.element(wrongOptionButton).toBeDisabled();

    await expect.element(wrongOptionButton).toHaveStyle({
      'box-shadow': '0 0 1px 1px #ca041c',
      'border': '1px solid #ca041c'
    })
  })

  test('Show solution is clicked and displayed correctly', async () => {
    await render(MultipleChoiceQuiz);

    let showSolutionButton = await screen.findByTestId('mcq-solution-button');

    await userEvent.click(showSolutionButton)

    let solutionOption = await page.getByRole('button').filter({ has: page.getByText('Hampshire') })

    await expect.element(solutionOption).toHaveClass('mcq-options__option--showsolution')

    await expect.element(solutionOption).toHaveStyle({
      'box-shadow': '0 0 1px 1px #51861a',
      'border': '1px solid #51861a'
    })
  })

})