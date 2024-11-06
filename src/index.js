const conditionsMap = {
  "clear sky": "clear-sky",
  "few clouds": "few-clouds",
  "broken clouds": "broken-clouds",
  rain: "rainy",
  snow: "snowy",
  mist: "windy",
};

const iconMap = {
  "clear-sky": "src/icons/sunny.png",
  "few-clouds": "src/icons/cloudy.png",
  "broken-clouds": "src/icons/cloudy.png",
  rainy: "src/icons/rain.png",
  snowy: "src/icons/snow.png",
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
