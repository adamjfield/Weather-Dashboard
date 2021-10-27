var apiKey = "6f33e24ea72491f73e9b9372546da8d5";
var today = new Date().toLocaleDateString().slice(0, 10);
var searchFormEl = document.querySelector("#search-form");
var citySearchEl = document.querySelector("#citySearch");
var prvSearchContainEl = document.querySelector("#prvSearch-container");
var cntWeatherContainEl = document.querySelector("#cntWeather-container");
var forecastContainEl = document.querySelector("#forecast-container");

// fetch api call to get city geo coordinates
function getCoords(city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var cityLat = data.coord.lat;
          var cityLon = data.coord.lon;
          var cityName = data.name;
          getCntWeather(cityLat, cityLon, cityName);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
}

// api call to get current weather
function getCntWeather(lat, lon, name) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly,alerts&appid=" +
    apiKey;
  console.log(apiUrl);

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayPrvSearch(name);
      displayCntWeather(data, name);
      displayFutureForecast(data);
    });
  });
}

// function to handle search
function formSearchHandler(event) {
  event.preventDefault();

  // capture city that was searched
  var city = citySearchEl.value.trim();

  // send city to api function or alert if nothing entered
  if (city) {
    getCoords(city);
    citySearchEl.value = "";
  } else {
    alert("Please enter a city");
  }
}

// search click listener
searchFormEl.addEventListener("submit", formSearchHandler);

//function to display previous searches
function displayPrvSearch(data) {
  var prvSearchEl = document.createElement("p");
  prvSearchEl.textContent = data;
  prvSearchEl.classList = "prvSearch";

  prvSearchContainEl.prepend(prvSearchEl);
}

// function to display current weather
function displayCntWeather(data, name) {
  cntWeatherContainEl.textContent = "";

  var iconCode = data.current.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";

  var cntWeatherDiv = document.createElement("div");
  cntWeatherDiv.classList = "cntWeather";

  var searchedCity = document.createElement("span");
  searchedCity.textContent = name + " (" + today + ") ";

  var wIcon = document.createElement("img");
  wIcon.setAttribute("src", iconUrl);

  var cntTemp = document.createElement("p");
  cntTemp.textContent = "Temp: " + data.current.temp + "\u2109";

  var cntWind = document.createElement("p");
  cntWind.textContent = "Wind: " + data.current.wind_speed + " MPH";

  var cntHumidity = document.createElement("p");
  cntHumidity.textContent = "Humidity: " + data.current.humidity + "%";

  var cntUv = document.createElement("p");
  cntUv.textContent = "UV Index: " + data.current.uvi;

  cntWeatherContainEl.appendChild(cntWeatherDiv);
  cntWeatherDiv.appendChild(searchedCity);
  searchedCity.appendChild(wIcon);
  cntWeatherDiv.appendChild(cntTemp);
  cntWeatherDiv.appendChild(cntWind);
  cntWeatherDiv.appendChild(cntHumidity);
  cntWeatherDiv.appendChild(cntUv);
}

function displayFutureForecast(data) {
  forecastContainEl.textContent = "";

  var forecastTitle = document.createElement("h3");
  forecastTitle.textContent = "5-Day Forecast:";

  var forecastCardDiv = document.createElement("div");
  forecastCardDiv.setAttribute("class", "row");

  for (let i = 1; i < 6; i++) {
    var date = new Date(data.daily[i].dt * 1000)
      .toLocaleDateString()
      .slice(0, 10);

    var iconCode = data.daily[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";

    var temp = data.daily[i].temp.day;

    var wind = data.daily[i].wind_speed;

    var humidity = data.daily[i].humidity;

    var dailyForecastCard = document.createElement("div");
    dailyForecastCard.classList = "card col-sm-11 col-md-4 col-lg-2";

    var dailyDate = document.createElement("h4");
    dailyDate.textContent = date;

    var wIcon = document.createElement("img");
    wIcon.setAttribute("src", iconUrl);
    wIcon.classList = "forecastIcon";

    var forecastTemp = document.createElement("p");
    forecastTemp.textContent = "Temp: " + temp + "\u2109";

    var forecastWind = document.createElement("p");
    forecastWind.textContent = "Wind: " + wind + " MPH";

    var forecastHumidity = document.createElement("p");
    forecastHumidity.textContent = "Humidity: " + humidity + "%";

    forecastContainEl.appendChild(forecastTitle);
    forecastContainEl.appendChild(forecastCardDiv);
    forecastCardDiv.appendChild(dailyForecastCard);
    dailyForecastCard.appendChild(dailyDate);
    dailyForecastCard.appendChild(wIcon);
    dailyForecastCard.appendChild(forecastTemp);
    dailyForecastCard.appendChild(forecastWind);
    dailyForecastCard.appendChild(forecastHumidity);
  }
}
