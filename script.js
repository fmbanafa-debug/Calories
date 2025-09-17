const calorieCounter = document.getElementById('calorie-counter');
const budgetInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false;

// Function to add new input entry fields
function addEntry() {
  const targetId = entryDropdown.value;
  const targetInputContainer = document.getElementById(targetId).querySelector('.input-container');
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
    <label for="${targetId}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${targetId}-${entryNumber}-name" placeholder="Name" />
    <label for="${targetId}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
      type="number"
      min="0"
      id="${targetId}-${entryNumber}-calories"
      placeholder="Calories"
    />`;
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// Function to get calories from all entries for a specific section
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = item.value;
    const invalidInputMatch = currVal.match(/[^0-9]/g);
    
    // Check for invalid characters in the input
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch.join('')}`);
      isError = true;
      return null;
    }
    
    calories += Number(currVal);
  }
  return calories;
}

// Function to calculate and display the remaining calories
function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastCalories = getCaloriesFromInputs(document.querySelectorAll('#breakfast input[type=number]'));
  const lunchCalories = getCaloriesFromInputs(document.querySelectorAll('#lunch input[type=number]'));
  const dinnerCalories = getCaloriesFromInputs(document.querySelectorAll('#dinner input[type=number]'));
  const snacksCalories = getCaloriesFromInputs(document.querySelectorAll('#snacks input[type=number]'));
  const exerciseCalories = getCaloriesFromInputs(document.querySelectorAll('#exercise input[type=number]'));
  const budgetCalories = budgetInput.value ? Number(budgetInput.value) : 0;

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  
  const surplusOrDeficit = remainingCalories >= 0 ? 'Surplus' : 'Deficit';
  
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Daily Calorie Budget</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

// Function to clear all form inputs and hide the output
function clearForm() {
  const inputContainers = document.querySelectorAll('.input-container');
  
  for (const container of inputContainers) {
    container.innerHTML = '';
  }
  
  budgetInput.value = '';
  output.classList.add('hide');
}

// Event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
