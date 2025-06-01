document.addEventListener("DOMContentLoaded", () => {
  const countriesContainer = document.getElementById("countries_container");
  const searchInput = document.getElementById("search");
  const regionFilter = document.getElementById("region-filter");
  const themeToggle = document.getElementById("theme-toggle");
  let allCountries = [];

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
    updateThemeText();
  });

  function updateThemeText() {
    const isDark = document.body.dataset.theme === "dark";
    themeToggle.querySelector("p").textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.querySelector("i").className = isDark ? "fa fa-sun-o" : "fa fa-moon-o";
  }

  // Fetch country data from API
  fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then(data => {
      allCountries = data;
      displayCountries(allCountries);
    })
    .catch(error => {
      console.error("Failed to fetch countries:", error);
      countriesContainer.innerHTML = "<p>Failed to load countries. Please try again later.</p>";
    });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allCountries.filter(country => 
      country.name.common.toLowerCase().includes(searchTerm)
    );
    displayCountries(filtered);
  });

  // Region filter
  regionFilter.addEventListener("change", (e) => {
    const region = e.target.value;
    if (!region) {
      displayCountries(allCountries);
      return;
    }
    const filtered = allCountries.filter(country => country.region === region);
    displayCountries(filtered);
  });

  // Display countries
  function displayCountries(countries) {
    if (!countries.length) {
      countriesContainer.innerHTML = "<p>No countries found. Try a different search.</p>";
      return;
    }

    countriesContainer.innerHTML = "";
    countries.forEach(country => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.addEventListener("click", () => {
        window.location.href = `details.html?code=${country.cca3}`;
      });

      const flag = country.flags?.png || "";
      const name = country.name?.common || "N/A";
      const population = country.population?.toLocaleString() || "N/A";
      const region = country.region || "N/A";
      const capital = country.capital ? country.capital[0] : "N/A";

      card.innerHTML = `
        <img src="${flag}" alt="${name} Flag">
        <div class="info">
          <h3>${name}</h3>
          <p><strong>Population:</strong> ${population}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Capital:</strong> ${capital}</p>
        </div>
      `;
      countriesContainer.appendChild(card);
    });
    
  }
  
 
function displayCountries(countries) {
  const countriesContainer = document.getElementById("countries_container");
  countriesContainer.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.cursor = "pointer"; // Show it's clickable
    card.addEventListener("click", function() {
      try {
          window.location.href = "details.html?country=" + encodeURIComponent(country.name.common);
      } catch (error) {
          console.error("Navigation error:", error);
          alert("Could not open details page. Please check if details.html exists.");
      }
  });
    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} Flag">
      <div class="info">
        <h3>${country.name.common}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      </div>
    `;

    // Add click handler
    card.addEventListener("click", () => {
      // Store country data temporarily (optional)
      sessionStorage.setItem('currentCountry', JSON.stringify(country));
      // Navigate to details page
      window.location.href = `details.html?country=${encodeURIComponent(country.name.common)}`;
    });

    countriesContainer.appendChild(card);
  });
}
});