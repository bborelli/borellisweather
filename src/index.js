const conditionsMap = {
  "clear sky": "clear-sky",
  "few clouds": "few-clouds",
  "scattered clouds": "few-clouds",
  "broken clouds": "broken-clouds",
  "overcast clouds": "broken-clouds",
  "shower rain": "rainy",
  "light rain": "rainy",
  rain: "rainy",
  "heavy rain": "rainy",
  drizzle: "rainy",
  thunderstorm: "rainy",
  snow: "snowy",
  haze: "windy",
  mist: "windy",
  fog: "windy",
  smoke: "windy",
  squall: "windy",
  tornado: "windy",
  cloudy: "broken-clouds",
};

const iconMap = {
  "clear-sky": "src/icons/sunny.png",
  "few-clouds": "src/icons/sunclouds.png",
  "broken-clouds": "src/icons/cloudy.png",
  rainy: "src/icons/rainy.png",
  snowy: "src/icons/snowy.png",
  windy: "src/icons/windy.png",
};

function refreshWeather(response) {
  if (!response.data) {
    console.error("No data found in the API response.");
    return;
  }

  const temperatureElement = document.querySelector("#temperature");
  const cityElement = document.querySelector("#city");
  const descriptionElement = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const windSpeedElement = document.querySelector("#wind-speed");
  const timeElement = document.querySelector("#time");
  const iconElement = document.querySelector("#weather-icon");
  const weatherApp = document.querySelector(".weather-app");

  const condition = response.data.condition.description.toLowerCase();
  const className = conditionsMap[condition] || "";

  weatherApp.setAttribute("data-condition", className);
  iconElement.src = iconMap[className] || "";

  document.body.className = "";
  if (className) {
    document.body.classList.add(className);
  }

  temperatureElement.innerHTML = `${Math.round(
    response.data.temperature.current
  )}<span class="small-degree">°C</span>`;
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = formatDescription(
    response.data.condition.description
  );
  humidityElement.innerHTML = response.data.temperature.humidity;
  windSpeedElement.innerHTML = response.data.wind.speed;
  timeElement.innerHTML = formatDate(new Date(response.data.time * 1000));
}

function formatDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

function formatDescription(description) {
  return description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function searchCity(city) {
  const apiKey = "4fbe9b2c44d0f8a0833d1te403cbb78o";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Unable to retrieve weather information. Please try again.");
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-form-input");
  if (searchInput.value) searchCity(searchInput.value);
  getForecast(searchInput.value);
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "4fbe9b2c44d0f8a0833d1te403cbb78o";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 4) {
      forecastHtml =
        forecastHtml +
        `
  <div class="weather-forecast-day">
    <div class="weather-forecast-date">${formatDay(day.time)}</div>
    <div class="weather-forecast-temperatures">
      <div class="weather-forecast-temperature">
        <strong>${Math.round(day.temperature.maximum)}°</strong>
      </div>
      <div class="weather-forecast-temperature">${Math.round(
        day.temperature.minimum
      )}°</div>
    </div>
  </div>
`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

document
  .querySelector("#search-form")
  .addEventListener("submit", handleSearchSubmit);
searchCity("Lisbon");
getForecast("Lisbon");
