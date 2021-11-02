var apiKey = "6f33e24ea72491f73e9b9372546da8d5";
var today = new Date().toLocaleDateString().slice(0, 10);
var searchFormEl = document.querySelector("#search-form");
var citySearchEl = document.querySelector("#citySearch");
var prvSearchContainEl = document.querySelector("#prvSearch-container");
var prvSearchEl = document.querySelector("#prvSearch-btn");
var cntWeatherContainEl = document.querySelector("#cntWeather-container");
var forecastContainEl = document.querySelector("#forecast-container");
var cities = [];

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
          saveSearch(cityName);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
}

function saveSearch(search) {
  if (cities.indexOf(search) !== -1) {
    return;
  }
  cities.push(search);
  localStorage.setItem("cities", JSON.stringify(cities));
  displayPrvSearch();
}

function setupSearchHistory() {
  var storedCities = localStorage.getItem("cities");
  if (storedCities) {
    cities = JSON.parse(storedCities);
  }
  displayPrvSearch();
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

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayPrvSearch(cities);
      displayCntWeather(data, name);
      displayFutureForecast(data);
    });
}

//function to display previous searches
function displayPrvSearch() {
  prvSearchContainEl.innerHTML = "";

  for (var i = cities.length - 1; i >= 0; i--) {
    var prvSearchEl = document.createElement("button");
    prvSearchEl.setAttribute("type", "button");
    prvSearchEl.setAttribute("id", "prvSearch-btn");
    prvSearchEl.classList.add("prvSearch");

    prvSearchEl.setAttribute("dataSearch", cities[i]);

    prvSearchEl.textContent = cities[i];
    prvSearchContainEl.append(prvSearchEl);
  }
}

// function to display current forecast
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
  cntUv.textContent = "UV Index: ";

  var cntUvIndex = document.createElement("span");
  cntUvIndex.textContent = data.current.uvi;
  cntUvIndex.classList = "uv-index";
  if (data.current.uvi <= 2) {
    cntUvIndex.classList = "green";
  } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
    cntUvIndex.removeAttribute("class");
    cntUvIndex.classList = "yellow";
  } else if (data.current.uvi >= 6 && data.current.uvi < 7) {
    cntUvIndex.removeAttribute("class");
    cntUvIndex.classList = "orange";
  } else {
    cntUvIndex.removeAttribute("class");
    cntUvIndex.classList = "red";
  }

  cntWeatherContainEl.appendChild(cntWeatherDiv);
  cntWeatherDiv.appendChild(searchedCity);
  searchedCity.appendChild(wIcon);
  cntWeatherDiv.appendChild(cntTemp);
  cntWeatherDiv.appendChild(cntWind);
  cntWeatherDiv.appendChild(cntHumidity);
  cntWeatherDiv.appendChild(cntUv);
  cntUv.appendChild(cntUvIndex);
}

// display 5 day forecast
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

// function to handle search
function formSearchHandler(event) {
  event.preventDefault();

  // capture city that was searched
  var city = citySearchEl.value.trim();

  console.log(city);

  // send city to api function or alert if nothing entered
  if (city) {
    getCoords(city);
    citySearchEl.value = "";
  } else {
    alert("Please enter a city");
  }
}

function handleHistorySearchClick(event) {
  event.preventDefault();

  // capture city that was searched
  var city = prvSearchContainEl;
  console.log(city);
  // getCoords(city);
}

// search click listener
setupSearchHistory();
searchFormEl.addEventListener("submit", formSearchHandler);
prvSearchContainEl.addEventListener("click", handleHistorySearchClick);
