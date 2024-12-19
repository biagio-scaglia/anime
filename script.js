const API_URL = "https://api.jikan.moe/v4";
const resultsEl = document.getElementById("results");
const watchlistEl = document.getElementById("watchlist");
const searchBar = document.getElementById("search-bar");
const typeFilter = document.getElementById("type-filter");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalDescription = document.getElementById("modal-description");
const modalAddToWatchlist = document.getElementById("modal-add-to-watchlist");
const closeModal = document.getElementById("close-modal");
const feedback = document.getElementById("feedback");
const downloadBtn = document.getElementById("download-pdf");

let watchlist = [];
let currentItem = null;

// Fetch Anime or Manga
async function fetchMedia(query, type) {
  const url = `${API_URL}/${type}?q=${query}&order_by=title&limit=20`;
  const response = await fetch(url);
  const data = await response.json();
  displayResults(data.data);
}

// Display Results
function displayResults(items) {
  resultsEl.innerHTML = "";
  items.forEach(item => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.innerHTML = `
      <img src="${item.images.jpg.image_url}" alt="${item.title}">
      <h3>${item.title}</h3>
    `;
    resultItem.addEventListener("click", () => showDetails(item));
    resultsEl.appendChild(resultItem);
  });
}

// Show Modal with Details
function showDetails(item) {
    currentItem = item; // Salva l'elemento corrente
    modalTitle.textContent = item.title;
    modalImage.src = item.images.jpg.image_url;
  
    // Limita la descrizione se troppo lunga
    modalDescription.textContent = item.synopsis
      ? item.synopsis.length > 300
        ? item.synopsis.substring(0, 300) + "..."
        : item.synopsis
      : "No description available.";
  
    modal.style.display = "flex";
  }
  

// Close Modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  currentItem = null;
});

// Add to Watchlist
modalAddToWatchlist.addEventListener("click", () => {
  if (currentItem && !watchlist.includes(currentItem.title)) {
    watchlist.push(currentItem.title);
    const listItem = document.createElement("li");
    listItem.classList.add("watchlist-item");
    listItem.textContent = currentItem.title;
    watchlistEl.appendChild(listItem);
    showFeedback("Added to watchlist!", false);
  } else {
    showFeedback("Already in watchlist!", true);
  }
  modal.style.display = "none"; // Close modal
  currentItem = null; // Reset current item
});

// Feedback Notification
function showFeedback(message, isError) {
  feedback.textContent = message;
  feedback.className = isError ? "feedback error" : "feedback";
  feedback.style.display = "block";
  setTimeout(() => {
    feedback.style.display = "none";
  }, 2000);
}

// Download Watchlist as PDF
function downloadPDF() {
  const doc = new jsPDF();
  doc.text("My Watchlist", 10, 10);
  watchlist.forEach((title, index) => {
    doc.text(`${index + 1}. ${title}`, 10, 20 + index * 10);
  });
  doc.save("watchlist.pdf");
}

// Dynamic Search
searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim();
  const type = typeFilter.value || "anime";
  if (query.length > 2) {
    fetchMedia(query, type);
  } else {
    resultsEl.innerHTML = "";
  }
});

// Fetch Initial Data
fetchMedia("", "anime");
const downloadTxtBtn = document.getElementById("download-txt");
const downloadCsvBtn = document.getElementById("download-csv");

// Scarica la watchlist in formato TXT
function downloadTXT() {
  const blob = new Blob([watchlist.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "watchlist.txt";
  link.click();
}

// Scarica la watchlist in formato CSV
function downloadCSV() {
  const csvContent = "data:text/csv;charset=utf-8," + watchlist.map(title => `"${title}"`).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "watchlist.csv";
  link.click();
}

// Aggiungi Event Listeners
downloadTxtBtn.addEventListener("click", downloadTXT);
downloadCsvBtn.addEventListener("click", downloadCSV);
const themeSelector = document.getElementById("theme-selector");

themeSelector.addEventListener("change", (e) => {
  const selectedTheme = e.target.value;
  document.body.className = ""; // Rimuove eventuali classi esistenti
  document.body.classList.add(`${selectedTheme}-theme`); // Applica il nuovo tema
});

// Imposta un tema predefinito
document.body.classList.add("dark-theme");
