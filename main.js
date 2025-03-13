const input = document.querySelector("#inputField");
const btn = document.querySelector("#fetchButton");
const tempDivInfo = document.querySelector("#temp-div");
const weatherInfoDiv = document.querySelector("#weather-info");
const weatherIcon = document.querySelector("#weather-icon");
const houryForecastDiv = document.querySelector("#hourly-forecast");
const apiKey = "";

const letsFetch = async () => {
  const city = input.value;
  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      throw new Error(
        `Current weather fetch failed: ${currentResponse.statusText}`
      );
    }
    const currentData = await currentResponse.json();
    displayWeather(currentData);

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Forecast fetch failed: ${forecastResponse.statusText}`);
    }
    const forecastData = await forecastResponse.json();
    displayHourlyForecast(forecastData);
  } catch (error) {
    console.log("Error fetching data: ", error);
    alert("Error fetching weather data. Please try again");
  }
};

const displayWeather = (data) => {
  weatherInfoDiv.innerHTML = "";
  houryForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHtml = `<p>${temperature}°C</p>`;
    const weatherHtml = `
      <p>${cityName}</p>
      <p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHtml;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }
};

const displayHourlyForecast = (hourlyData) => {
  const next24Hours = hourlyData.list.slice(0, 8);
  console.log(next24Hours);

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>  <!-- Korrektur: </span> statt </span>-->
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>`;
    houryForecastDiv.innerHTML += hourlyItemHtml;
  });
};

const showImage = () => {
  weatherIcon.style.display = "block";
};

btn.addEventListener("click", letsFetch);
