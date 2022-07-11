// set global variables
var citiesListArr = [];
var numOfCities = 9;
var personalAPIKey = "appid=f36d0d370b01530f88dd47a551233cb1";
var unit = "units=imperial";
var dailyWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUVIndexApiStarts = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/onecall?";

// designate field from html
let searchCityForm = $("#searchCityForm");
let searchedCities = $("#searchedCity");

// request info from OpenWeather API start here
// search city by name function
var getCityWeather = function (cityName) {
    // request the OpenWeather api url
    var apiUrl =
      dailyWeatherApiStarts + cityName + "&" + personalAPIKey + "&" + unit;
    // make a request to url
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        return response.json().then(function (response) {
          $("#cityName").html(response.name);
          // display time line
          var unixTime = response.dt;
          var date = moment.unix(unixTime).format("MM/DD/YY");
          $("#currentdate").html(date);
          // display weather icon
          var weatherIconUrl =
            "http://openweathermap.org/img/wn/" +
            response.weather[0].icon +
            "@2x.png";
          $("#weatherIconToday").attr("src", weatherIconUrl);
          $("#tempToday").html(response.main.temp + " \u00B0F");
          $("#humidityToday").html(response.main.humidity + " %");
          $("#windSpeedToday").html(response.wind.speed + " MPH");
          // return coordinate for getUVIndex to call
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          getUVIndex(lat, lon);
          getForecast(lat, lon);
        });
      } else {
        alert("Please provide a valid city name.");
      }
    });
  };

