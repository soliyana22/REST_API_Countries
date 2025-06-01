
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("border-btn")) {
    const country = e.target.textContent;
    window.location.href = `details.html?country=${encodeURIComponent(country)}`;
  }
});

 document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("country-details");
  const backBtn = document.querySelector(".back_btn");

  backBtn.addEventListener("click", () => {
    window.history.back();
  });

  
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("country");


  if (!countryName) {
    container.innerHTML = "<p>No country specified.</p>";
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      const country = data[0];
      renderCountryDetails(country);
    })
    .catch(err => {
      console.error("Error fetching country data:", err);
      container.innerHTML = "<p>Unable to fetch country details.</p>";
    });

  function renderCountryDetails(country) {
    const {
      name,
      population,
      region,
      subregion,
      capital,
      flags,
      tld,
      currencies,
      languages,
      borders,
    } = country;

    const nativeName = Object.values(name.nativeName || {})[0]?.common || "N/A";
    const currency = currencies ? Object.values(currencies)[0].name : "N/A";
    const languageList = languages ? Object.values(languages).join(", ") : "N/A";
    const borderCountries = borders ? borders.join(", ") : "None";

    container.innerHTML = `
      <div class="detail-card">
        <img src="${flags.png}" alt="Flag of ${name.common}" class="detail-flag">
        <div class="detail-info">
          <h2>${name.common}</h2>
          <p><strong>Native Name:</strong> ${nativeName}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Subregion:</strong> ${subregion || "N/A"}</p>
          <p><strong>Capital:</strong> ${capital?.[0] || "N/A"}</p>
          <p><strong>Top Level Domain:</strong> ${tld?.[0] || "N/A"}</p>
          <p><strong>Currency:</strong> ${currency}</p>
          <p><strong>Languages:</strong> ${languageList}</p>
          <button><strong>Border Countries:</strong> ${borderCountries}</button>
        </div>
      </div>
    `;
    
  }
});
