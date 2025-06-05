// DOM Elements
const moodButtons = document.querySelectorAll(".mood-btn");
const journalEntry = document.getElementById("journal-entry");
const vaultForm = document.getElementById("vault-form");
const vaultPasswordInput = document.getElementById("vault-password");
const vaultsList = document.getElementById("vaults");
const clearDataBtn = document.getElementById("clear-data");
const sortSelector = document.getElementById("sort-vaults");
const quoteSpan = document.getElementById("quote");
const refreshQuoteBtn = document.getElementById("refresh-quote");

let selectedMood = "";
let vaults = [];

// Quotes
const quotes = [
  "Every day is a fresh start.",
  "Progress, not perfection.",
  "You’ve survived 100% of your worst days.",
  "Your feelings are valid.",
  "You are doing better than you think.",
  "Storms don’t last forever.",
  "Be proud of how far you’ve come.",
  "Start where you are. Use what you have. Do what you can.",
  "Believe you can, and you're halfway there.",
  "Dream big. Work hard. Stay focused.",
  "Be stronger than your excuses.",
  "Fall seven times, stand up eight.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "Don’t wait for opportunity. Create it.",
  "The best way out is always through.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You are capable of amazing things.",
  "Keep going. Everything you need will come to you at the perfect time.",
  "Difficult roads often lead to beautiful destinations.",
  "Make today so awesome that yesterday gets jealous.",
  "Act as if what you do makes a difference. It does.",
  "Your only limit is your mind.",
  "Success doesn’t come from what you do occasionally, but what you do consistently.",
  "Growth begins at the end of your comfort zone.",
  "Great things never come from comfort zones.",
  "You don’t have to be perfect to be amazing.",
  "Be fearless in the pursuit of what sets your soul on fire.",
  "Do something today that your future self will thank you for.",
  "You are allowed to be both a masterpiece and a work in progress.",
  "Life is 10% what happens to us and 90% how we react to it.",
];

// ========= FUNCTIONS ===========

// Load from localStorage
function loadVaults() {
  const data = localStorage.getItem("moodVaults");
  vaults = data ? JSON.parse(data) : [];
  renderVaults();
}

// Save to localStorage
function saveVaults() {
  localStorage.setItem("moodVaults", JSON.stringify(vaults));
}

// Refresh motivational quote
function refreshQuote() {
  if (quotes.length === 0) {
    quoteSpan.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteSpan.textContent = quotes[randomIndex];
}

// Render vaults to UI
function renderVaults() {
  vaultsList.innerHTML = "";

  if (vaults.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent =
      "No vaults created yet. Start by saving your first mood!";
    emptyMessage.style.textAlign = "center";
    vaultsList.appendChild(emptyMessage);
    return;
  }

  const sorted = getSortedVaults();
  sorted.forEach((vault, index) => createVaultEntry(vault, index));
}

// Create a vault entry (reusable)
function createVaultEntry(vault, index) {
  const li = document.createElement("li");
  li.className = "vault-entry";

  const content = document.createElement("div");
  content.className = "vault-content";
  content.innerHTML = `
    <p><strong>Mood:</strong> ${vault.mood}</p>
    <p><strong>Date:</strong> ${vault.date}</p>
    <p><strong>Status:</strong> ${
      vault.locked ? "🔒 Locked" : "🔓 Unlocked"
    }</p>
  `;

  const actions = document.createElement("div");
  actions.className = "vault-actions";

  // Unlock Button
  const unlockBtn = document.createElement("button");
  unlockBtn.innerHTML = "👁️";
  unlockBtn.title = "Unlock";
  unlockBtn.onclick = () => unlockVault(index);

  // Update Button
  const updateBtn = document.createElement("button");
  updateBtn.innerHTML = "✏️";
  updateBtn.title = "Update";
  updateBtn.onclick = () => updateVault(index);

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Delete";
  deleteBtn.onclick = () => deleteVault(index);

  actions.appendChild(unlockBtn);
  actions.appendChild(updateBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(content);
  li.appendChild(actions);
  vaultsList.appendChild(li);
}

// Sort vaults based on dropdown
function getSortedVaults() {
  const method = sortSelector.value;
  return [...vaults].sort((a, b) => {
    if (method === "alphabetical") {
      return a.mood.localeCompare(b.mood);
    } else if (method === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });
}

// Create a vault
vaultForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const entry = journalEntry.value.trim();
  const password = vaultPasswordInput.value.trim();

  if (!selectedMood) {
    alert("Please select a mood.");
    return;
  }

  if (!entry || !password) {
    alert("Please write something and set a password.");
    return;
  }

  const newVault = {
    mood: selectedMood,
    entry,
    password,
    date: new Date().toLocaleString(),
    locked: true,
  };

  vaults.push(newVault);
  saveVaults();
  renderVaults();

  // Reset form
  journalEntry.value = "";
  vaultPasswordInput.value = "";
  selectedMood = "";
  moodButtons.forEach((btn) => btn.classList.remove("active"));

  alert("Vault successfully created!");
});

// Unlock a vault
function unlockVault(index) {
  const input = prompt("Enter password to unlock:");
  if (input === vaults[index].password) {
    vaults[index].locked = false;
    alert(
      `Vault Unlocked!\n\nMood: ${vaults[index].mood}\nNote: ${vaults[index].entry}`
    );
    renderVaults();
    saveVaults();
  } else {
    alert("Incorrect password!");
  }
}

// Update a vault
function updateVault(index) {
  if (vaults[index].locked) {
    alert("Please unlock the vault before editing.");
    return;
  }

  const newEntry = prompt("Update your journal entry:", vaults[index].entry);
  if (newEntry !== null && newEntry.trim()) {
    vaults[index].entry = newEntry.trim();
    alert("Vault updated!");
    renderVaults();
    saveVaults();
  }
}

// Delete a vault
function deleteVault(index) {
  if (confirm("Are you sure you want to delete this vault?")) {
    vaults.splice(index, 1);
    renderVaults();
    saveVaults();
    alert("Vault deleted!");
  }
}

// Clear all data
clearDataBtn.addEventListener("click", () => {
  if (confirm("This will delete all your vaults. Proceed?")) {
    localStorage.removeItem("moodVaults");
    vaults = [];
    renderVaults();
    alert("All data cleared!");
  }
});

// Mood button selection
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedMood = btn.dataset.mood;
    moodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Sorting logic
sortSelector.addEventListener("change", renderVaults);

// Quote button
refreshQuoteBtn.addEventListener("click", refreshQuote);

// Initial load
window.onload = () => {
  loadVaults();
  refreshQuote();
};
