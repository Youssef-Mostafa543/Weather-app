const weather_API_Key = "9a49c25970a1456096f145847263108";
const maptiler_API_Key = "1C99a5IlKSUYG87WjWJ9";
const btnSubmit = document.getElementById("btn-submit-city");
const cityNameBox = document.getElementById("city-name");

let userLocationStored = null; // city + country  to avoid doubles
async function getUserLocation() {
  console.log("User location function called :");
  if (userLocationStored) return userLocationStored;

  try {
    const response = await fetch(
      `https://api.maptiler.com/geolocation/ip.json?key=${maptiler_API_Key}`
    );

    // console.log(response);
    const data = await response.json();
    // console.log(data);

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
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch JSON:", error);
    return null;
  }
}

// -----------------------------------
const day1Div = document.querySelector("day1");
const day2Div = document.querySelector("day2");
const day3Div = document.querySelector("day3");

function getDayName(date) {
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  return dayName;
}


async function showResult() {
  // console.log("submit button pressed ");
  let cityName = cityNameBox.value;
  if (!cityName) {
    cityName = await getUserLocation();
    cityNameBox.value = cityName;
  }

  const data = await getJsonWeatherData(cityName, 3);
  const loc = data.location;

  console.log(data);
  console.log(loc);
  // Data and Loc are ready --------------------------------
  // Banners part :
  {
    document.querySelector(".day1 .day-name").textContent =
      getDayName(data.forecast.forecastday[0].date) + " ( today ) ";
    document.querySelector(".day1 .day-date").textContent =
      data.forecast.forecastday[0].date;

    document.querySelector(".day2 .day-name").textContent = getDayName(
      data.forecast.forecastday[1].date
    );
    document.querySelector(".day2 .day-date").textContent =
      data.forecast.forecastday[1].date;

    document.querySelector(".day3 .day-name").textContent = getDayName(
      data.forecast.forecastday[2].date
    );
    document.querySelector(".day3 .day-date").textContent =
      data.forecast.forecastday[2].date;
  }

  // body of day 1 :
  document.getElementById("location").textContent =
    loc.name + " " + loc.country;

  document.getElementById("degree").textContent =
    data.forecast.forecastday[0].day.avgtemp_c + "°C";

  document.getElementById("today-icon").src =
    data.forecast.forecastday[0].day.condition.icon;

  document.getElementById("condition").textContent =
    data.forecast.forecastday[0].day.condition.text;

  // day2 , 3 :
  /// .day2 .
  for (let i = 2; i <= 3; i++) {
    document.querySelector(`.day${i} .icon`).src =
      data.forecast.forecastday[i - 1].day.condition.icon;
    document.querySelector(`.day${i} .max-degree`).textContent =
      data.forecast.forecastday[i - 1].day.maxtemp_c + "°C";
    document.querySelector(`.day${i} .min-degree`).textContent =
      data.forecast.forecastday[i - 1].day.mintemp_c + "°C";

    document.querySelector(`.day${i} .condition`).textContent =
      data.forecast.forecastday[i - 1].day.condition.text;
  }
}

btnSubmit.addEventListener("click", showResult);
