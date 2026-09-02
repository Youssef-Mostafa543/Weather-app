const weather_API_Key = "9a49c25970a1456096f145847263108";
const maptiler_API_Key = "1C99a5IlKSUYG87WjWJ9";
const btnSubmit = document.getElementById("btn-submit-city");
const resultsDiv = document.getElementById("results");
const cityNameBox = document.getElementById("city-name");

let userLocationStored = null; // city + country  to avoid doubles
async function getUserLocation() {
  console.log("User location function called :");
  if (userLocationStored) return userLocationStored;

  try {
    const response = await fetch(
      `https://api.maptiler.com/geolocation/ip.json?key=${maptiler_API_Key}`
    );

    console.log(response);
    const data = await response.json();
    console.log(data);

    userLocationStored = data.city + " " + data.country;
    return userLocationStored;
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}

async function getJsonWeatherData(cityname, days) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${weather_API_Key}&q=${cityname}&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch JSON:", error);
    return null;
  }
}

async function showResult() {
  console.log("submit button pressed ");
  const Days = 3;
  let cityName = cityNameBox.value;
  if (!cityName) {
    cityName = await getUserLocation();
    cityNameBox.value = cityName;
  }

  const data = await getJsonWeatherData(cityName, Days);
  const loc = data.location;
  console.log(data);

  resultsDiv.innerHTML = ``; /// clear
  for (let i = 0; i < Days; i++) {
    const content = data.forecast.forecastday[i].day;

    const dayDate = data.forecast.forecastday[i].date;
    const dateObj = new Date(dayDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    let newDiv = document.createElement("div");

    newDiv.classList.add("weather-card");

    newDiv.innerHTML = `
        <h3 class="weather-card-header">${loc.name}, ${loc.country}</h3>
        <p class="weather-card-date">${dayName} (${dayDate})</p>
        
        <img src="https:${content.condition.icon}" alt="${content.condition.text}" class="w-20 h-20" />
        <p class="weather-card-condition">${content.condition.text}</p>
        
        <div class="weather-card-details">
            <p><strong>Avg:</strong> ${content.avgtemp_c}°C</p>
            <p class="text-red-500"><strong>Max:</strong> ${content.maxtemp_c}°C</p>
            <p class="text-blue-500"><strong>Min:</strong> ${content.mintemp_c}°C</p>
        </div>
    `;
    resultsDiv.appendChild(newDiv);
  }
}

btnSubmit.addEventListener("click", showResult);
