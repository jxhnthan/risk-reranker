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

// Generate random data for cases without sorting
function generateRandomCases(numCases) {
  const caseData = [];
  const suicideRiskLevels = ["High", "Moderate", "Low"];
  const selfHarmRiskLevels = ["High", "Moderate", "Low"];

  const riskMapping = {
    'High': 0.9,
    'Moderate': 0.6,
    'Low': 0.3
  };

  const weightSuicideRisk = 0.4;
  const weightSelfHarmRisk = 0.4;
  const weightNormalizedOQ45 = 0.2;

  for (let i = 1; i <= numCases; i++) {
    const caseID = `C${i.toString().padStart(3, "0")}`;
    const suicideRisk = suicideRiskLevels[getRandomInt(0, suicideRiskLevels.length - 1)];
    const selfHarmRisk = selfHarmRiskLevels[getRandomInt(0, selfHarmRiskLevels.length - 1)];
    const oq45 = getRandomInt(0, 180);  // OQ-45 score between 0 and 180
    const appointmentRequestTime = new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000);  // Random time in the last 30 days

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
    });
  }

  // Normalize priority scores to be within a range of 1 to 10
  const minPriorityScore = Math.min(...caseData.map(c => c.Priority_Score));
  const maxPriorityScore = Math.max(...caseData.map(c => c.Priority_Score));

  caseData.forEach(item => {
    item.Priority_Ranking = 1 + (item.Priority_Score - minPriorityScore) / (maxPriorityScore - minPriorityScore) * 9;
  });

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
      <td>${caseItem.Priority_Ranking.toFixed(2)}</td>
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
      Priority_Ranking: parseFloat(row.cells[4].textContent) || 0,
    };
    cases.push(caseData);
  });

  // Sort by suicide risk (High > Moderate > Low) first
  cases.sort((a, b) => {
    const suicideRiskOrder = { 'High': 3, 'Moderate': 2, 'Low': 1 };
    if (suicideRiskOrder[a.Suicide_Risk] === suicideRiskOrder[b.Suicide_Risk]) {
      // If suicide risk is the same, compare by priority ranking
      return b.Priority_Ranking - a.Priority_Ranking;
    }
    return suicideRiskOrder[b.Suicide_Risk] - suicideRiskOrder[a.Suicide_Risk];
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











  



  