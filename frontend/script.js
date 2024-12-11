let selectedAvatar = ''; // Initialize selectedAvatar variable

// Handle avatar selection
function selectAvatar(event) {
  const avatar = event.target;  // Get the clicked avatar element
  selectedAvatar = avatar.src;  // Store the src of the selected avatar

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
    alert("Please select an avatar!");  // Alert if no avatar is selected
    return;
  }

  const userName = document.getElementById("username").value;
  document.getElementById("user-name").textContent = userName;
  document.getElementById("user-avatar").src = selectedAvatar;
  document.getElementById("personalization").style.display = "none";
  document.getElementById("landing").style.display = "block";
});

// Function to generate random number between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random data for cases with updated ranking system
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
    const oq45 = getRandomInt(0, 180); // OQ-45 score between 0 and 180
    const appointmentRequestTime = new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000); // Random time in the last 30 days

    // Normalize OQ-45 score to be between 0 and 1
    const normalizedOQ45 = oq45 / 180;

    // Calculate the priority score based on the weights and risk mappings
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
      Appointment_Request_Time: appointmentRequestTime,
      Priority_Score: priorityScore,
      Priority_Ranking: null  // Initially no rank
    });
  }

  // Return unsorted data (do not sort here)
  return caseData;
}

// Populate the cases table
function populateCasesTable(data, animate = false) {
  const tbody = document.getElementById("cases-tbody");
  tbody.innerHTML = ""; // Clear previous rows
  data.forEach(caseItem => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${caseItem.Case_ID}</td>
      <td>${caseItem.Suicide_Risk}</td>
      <td>${caseItem.Self_Harm_Risk}</td>
      <td>${caseItem.OQ_45}</td>
      <td>${caseItem.Priority_Ranking !== null ? caseItem.Priority_Ranking : "N/A"}</td> <!-- Display rank or "N/A" -->
    `;
    if (animate) row.classList.add("highlight"); // Add animation class for re-ranked rows
    tbody.appendChild(row);
  });
}

// Generate 10 random cases
function generateCases() {
  const cases = generateRandomCases(10); // Generate 10 random cases
  populateCasesTable(cases);
  document.getElementById("cases-table").style.display = "block";
}

// Re-rank cases
function reRankCases() {
  const rows = document.querySelectorAll('#cases-tbody tr');
  const cases = [];
  rows.forEach(row => {
    const caseData = {
      Case_ID: row.cells[0].textContent,
      Suicide_Risk: row.cells[1].textContent,
      Self_Harm_Risk: row.cells[2].textContent,
      OQ_45: parseInt(row.cells[3].textContent),
      Priority_Ranking: row.cells[4].textContent !== "N/A" ? parseInt(row.cells[4].textContent) : null,
    };
    cases.push(caseData);
  });

  // Sorting logic: Priority is Suicide Risk -> Self Harm Risk -> OQ45
  cases.sort((a, b) => {
    const suicideRiskOrder = { 'High': 3, 'Moderate': 2, 'Low': 1 };
    const selfHarmRiskOrder = { 'High': 3, 'Moderate': 2, 'Low': 1 };

    // First, compare by suicide risk (High > Moderate > Low)
    if (suicideRiskOrder[a.Suicide_Risk] !== suicideRiskOrder[b.Suicide_Risk]) {
      return suicideRiskOrder[b.Suicide_Risk] - suicideRiskOrder[a.Suicide_Risk];
    }

    // If suicide risk is the same, compare by self-harm risk (High > Moderate > Low)
    if (selfHarmRiskOrder[a.Self_Harm_Risk] !== selfHarmRiskOrder[b.Self_Harm_Risk]) {
      return selfHarmRiskOrder[b.Self_Harm_Risk] - selfHarmRiskOrder[a.Self_Harm_Risk];
    }

    // If both suicide and self-harm risk are the same, compare by OQ-45 score (lower OQ-45 means higher priority)
    return a.OQ_45 - b.OQ_45;
  });

  // Assign ranks from 1 to 10 (highest priority gets rank 1, lowest gets rank 10)
  cases.forEach((item, index) => {
    item.Priority_Ranking = index + 1;  // Assign ranks from 1 to 10
  });

  // Re-populate the table with sorted data
  populateCasesTable(cases, true);
}

// Function to toggle between dark and light theme
function toggleTheme() {
  // Toggle the dark class on body
  document.body.classList.toggle('dark');

  // Change the icon based on the theme
  const icon = document.getElementById('theme-icon');
  if (document.body.classList.contains('dark')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

















  



  