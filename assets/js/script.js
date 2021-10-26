var apiKey = "6f33e24ea72491f73e9b9372546da8d5";
var today = new Date().toLocaleDateString().slice(0, 10);
var searchFormEl = document.querySelector("#search-form");
var citySearchEl = document.querySelector("#citySearch");
var prvSearchContainEl = document.querySelector("#prvSearch-container");
var cntWeatherContainEl = document.querySelector("#cntWeather-container");

// fetch api call to get city geo coordinates
var getCoords = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var cityLat = data.coord.lat;
          var cityLon = data.coord.lon;
          getCntWeather(cityLat, cityLon);
          displayPrvSearch(data);
          displayCntWeather(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// api call to get current weather
var getCntWeather = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=" +
    apiKey;
  console.log(apiUrl);
};

// function to handle search
var formSearchHandler = function (event) {
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
};

// search click listener
searchFormEl.addEventListener("submit", formSearchHandler);

//function to display previous searches
var displayPrvSearch = function (data) {
  var prvSearchEl = document.createElement("p");
  prvSearchEl.textContent = data.name;
  prvSearchEl.classList = "prvSearch";

  prvSearchContainEl.appendChild(prvSearchEl);
};

// function to display current weather
var displayCntWeather = function (data) {
  var iconCode = data.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

  var cntWeatherDiv = document.createElement("div");
  cntWeatherDiv.classList = "cntWeather";

  var searchedCity = document.createElement("span");
  searchedCity.textContent = data.name + " (" + today + ") ";

  var wIcon = document.createElement("img");
  wIcon.setAttribute("src", iconUrl);

  var cntTemp = document.createElement("p");
  cntTemp.textContent = "Temp: " + data.main.temp + "\u2109";

  var cntWind = document.createElement("p");
  cntWind.textContent = "Wind: " + data.wind.speed + " MPH";

  var cntHumidity = document.createElement("p");
  cntHumidity.textContent = "Humidity: " + data.main.humidity + "%";

  var cntUv = document.createElement("p");
  cntUv.textContent = "UV Index: " + "'UV Index'";

  cntWeatherContainEl.appendChild(cntWeatherDiv);
  cntWeatherDiv.appendChild(searchedCity);
  searchedCity.appendChild(wIcon);
  cntWeatherDiv.appendChild(cntTemp);
  cntWeatherDiv.appendChild(cntWind);
  cntWeatherDiv.appendChild(cntHumidity);
  cntWeatherDiv.appendChild(cntUv);
};
