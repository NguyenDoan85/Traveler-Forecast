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
// select from html element
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");