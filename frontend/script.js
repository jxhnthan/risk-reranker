let selectedAvatar = ''; // Initialize selectedAvatar variable
let correctOrder = []; // To store the correct priority order
let liveScore = 0; // Initialize live score
let timeLeft = 120; // Set timer (in seconds)
let timerInterval; // To hold the timer interval

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handle avatar selection
function selectAvatar(event) {
  const avatar = event.target;
  selectedAvatar = avatar.src;

  // Remove the 'selected' class from all avatars
  document.querySelectorAll('.avatar').forEach(img => img.classList.remove('selected'));

  // Add the 'selected' class to the clicked avatar
  avatar.classList.add('selected');
}

// Handle personalization form submission
document.getElementById("personalization-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Check if avatar is selected
  if (!selectedAvatar) {
    alert("Please select an avatar!");
    return;
  }

  const userName = document.getElementById("username").value;
  document.getElementById("user-name").textContent = userName;
  document.getElementById("user-avatar").src = selectedAvatar;
  document.getElementById("personalization").style.display = "none";
  document.getElementById("landing").style.display = "block";

  startGame(); // Automatically start the game
});

// Start the game: Generate cases, populate the cards, and initialize the timer
function startGame() {
  const cases = generateRandomCases(10); // Generate 10 random cases

  // Sort cases to calculate the correct order based on priority
  correctOrder = cases.slice().sort((a, b) => b.Priority_Score - a.Priority_Score).map(caseItem => caseItem.Case_ID);

  populateCasesAsCards(cases);
  document.getElementById("timer").style.display = "block";

  startTimer(); // Start the timer
}

// Generate random data for cases
function generateRandomCases(numCases) {
  const caseData = [];
  const suicideRiskLevels = ["High", "Moderate", "Low"];
  const selfHarmRiskLevels = ["High", "Moderate", "Low"];

  const riskMapping = {
    'High': 3,
    'Moderate': 2,
    'Low': 1
  };

  const weightSuicideRisk = 0.4;
  const weightSelfHarmRisk = 0.3;
  const weightNormalizedOQ45 = 0.3;

  for (let i = 1; i <= numCases; i++) {
    const caseID = `C${i.toString().padStart(3, "0")}`;
    const suicideRisk = suicideRiskLevels[getRandomInt(0, suicideRiskLevels.length - 1)];
    const selfHarmRisk = selfHarmRiskLevels[getRandomInt(0, selfHarmRiskLevels.length - 1)];
    const oq45 = getRandomInt(0, 180);

    // Normalize OQ-45 score
    const normalizedOQ45 = oq45 / 180;

    // Calculate the priority score
    const priorityScore = (
      riskMapping[suicideRisk] * weightSuicideRisk +
      riskMapping[selfHarmRisk] * weightSelfHarmRisk +
      normalizedOQ45 * weightNormalizedOQ45
    );

    caseData.push({
      Case_ID: caseID,
      Suicide_Risk: suicideRisk,
      Self_Harm_Risk: selfHarmRisk,
      OQ_45: oq45,
      Priority_Score: priorityScore, // Remove priority score display in the card
      Priority_Ranking: null
    });
  }

  return caseData;
}

// Populate the cases as cards
function populateCasesAsCards(data) {
  const container = document.getElementById("cases-container");
  container.innerHTML = ""; // Clear previous cases

  data.forEach(caseItem => {
    const card = document.createElement("div");
    card.classList.add("case-card");

    card.innerHTML = `
      <div class="case-header">${caseItem.Case_ID}</div>
      <div class="case-body">
        <p>Suicide Risk: ${caseItem.Suicide_Risk}</p>
        <p>Self Harm Risk: ${caseItem.Self_Harm_Risk}</p>
        <p>OQ-45 Score: ${caseItem.OQ_45}</p>
      </div>
      <div class="case-footer">
        <button class="move-up" onclick="moveRowUp(this.closest('.case-card'))">
          <i class="fa fa-arrow-up"></i>
        </button>
        <button class="move-down" onclick="moveRowDown(this.closest('.case-card'))">
          <i class="fa fa-arrow-down"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Move row up (for card)
function moveRowUp(card) {
  const container = document.getElementById("cases-container");
  const previousCard = card.previousElementSibling;

  if (previousCard) {
    container.insertBefore(card, previousCard); // Move card above the previous one
  }

  updateLiveScore(); // Update the live score whenever a card is reordered
}

// Move row down (for card)
function moveRowDown(card) {
  const container = document.getElementById("cases-container");
  const nextCard = card.nextElementSibling;

  if (nextCard) {
    container.insertBefore(nextCard, card); // Move card below the next one
  }

  updateLiveScore(); // Update the live score whenever a card is reordered
}

// Update live score
function updateLiveScore() {
  const cards = document.querySelectorAll(".case-card");
  const userOrder = Array.from(cards).map(card => card.querySelector(".case-header").textContent);

  let correctCount = 0;

  // Compare user order with correct order
  userOrder.forEach((caseID, index) => {
    if (caseID === correctOrder[index]) {
      correctCount++;
    }
  });

  liveScore = (correctCount / correctOrder.length) * 100;
  document.getElementById("live-score").textContent = `Score: ${liveScore.toFixed(2)}%`;
}

// Start the timer
function startTimer() {
  const timerElement = document.getElementById("timer");
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! Your rankings have been submitted.");
      submitRankings();
    }
  }, 1000);
}

// Submit rankings and finalize score
function submitRankings() {
  clearInterval(timerInterval); // Stop the timer
  updateLiveScore(); // Final score update

  // Hide cards and show final feedback
  document.getElementById("cases-container").style.display = "none";

  document.getElementById("final-score").textContent = `Final Score: ${liveScore.toFixed(2)}%`;
  document.getElementById("feedback-message").textContent =
    liveScore === 100
      ? "Excellent! All rankings are correct."
      : "Keep trying! Review the rankings to improve.";
}

// Toggle theme (Day/Night)
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById("theme-icon");
  
  body.classList.toggle("dark-mode");
  
  if (body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}



















  



  