// set global variables
let cityArray = [];
let numOfCities = 9;
const personalApiKey = "appid=f36d0d370b01530f88dd47a551233cb1";
const unit = "units=imperial";
let weatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=";
let uvIndexApi = "https://api.openweathermap.org/data/2.5/uvi?";
let forecastApi =
    "https://api.openweathermap.org/data/2.5/onecall?";

// designate field from html
const searchCityForm = $("#searchCityForm");
const searchedCities = $("#searchedCity");

// request info from OpenWeather API start here
// search city by name function
const cityWeather = function (cityName) {
    // request the OpenWeather api url
    let apiUrl =
        weatherApi + cityName + "&" + personalApiKey + "&" + unit;
    // make a request to url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);
                // display time line
                const unixTime = response.dt;
                const date = moment.unix(unixTime).format("MM/DD/YY");
                $("#currentdate").html(date);
                // display weather icon
                const weatherIconUrl =
                    "http://openweathermap.org/img/wn/" +
                    response.weather[0].icon +
                    "@2x.png";
                $("#weatherIconToday").attr("src", weatherIconUrl);
                $("#tempToday").html(response.main.temp + " \u00B0F");
                $("#humidityToday").html(response.main.humidity + " %");
                $("#windSpeedToday").html(response.wind.speed + " MPH");
                // return coordinate for getUvIndex to call
                const lat = response.coord.lat;
                const lon = response.coord.lon;
                getUvIndex(lat, lon);
                getForecast(lat, lon);
            });
        } else {
            alert("Please provide a valid city name.");
        }
    });
};

// request UV info function
const getUvIndex = function (lat, lon) {
    // formate the OpenWeather api url
    const apiUrl =
        uvIndexApi +
        personalApiKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon +
        "&" +
        unit;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // remove all class background
            $("#UVIndexToday").removeClass();
            $("#UVIndexToday").html(response.value);
            if (response.value < 3) {
                $("#UVIndexToday").addClass("p-1 rounded bg-success text-white");
            } else if (response.value < 8) {
                $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
            } else {
                $("#UVIndexToday").addClass("p-1 rounded bg-danger text-white");
            }
        });
};

// forecast weather API
const getForecast = function (lat, lon) {
    // formate the OpenWeather api url
    const apiUrl =
        forecastApi +
        "lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,minutely,hourly" +
        "&" +
        personalApiKey +
        "&" +
        unit;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            for (let i = 1; i < 6; i++) {
                //display date
                const unixTime = response.daily[i].dt;
                const date = moment.unix(unixTime).format("MM/DD/YY");
                $("#Date" + i).html(date);
                // display weather icon
                const weatherIncoUrl =
                    "http://openweathermap.org/img/wn/" +
                    response.daily[i].weather[0].icon +
                    "@2x.png";
                $("#weatherIconDay" + i).attr("src", weatherIncoUrl);
                // display temperature
                const temp = response.daily[i].temp.day + " \u00B0F";
                $("#tempDay" + i).html(temp);
                // display humidity
                const humidity = response.daily[i].humidity;
                $("#humidityDay" + i).html(humidity + " %");
            }
        });
};
// request info from OpenWeather API end here

const creatBtn = function (btnText) {
    const btn = $("<button>")
        .text(btnText)
        .addClass("list-group-item list-group-item-action")
        .attr("type", "submit");
    return btn;
};

// load local storage function
const loadSavedCity = function () {
    cityArray = JSON.parse(localStorage.getItem("weatherInfo"));
    if (cityArray == null) {
        cityArray = [];
    }
    for (let i = 0; i < cityArray.length; i++) {
        const cityNameBtn = creatBtn(cityArray[i]);
        searchedCities.append(cityNameBtn);
    }
};

// call function
loadSavedCity();

// save city search into local storage
const saveCityName = function (cityName) {
    let newcity = 0;
    cityArray = JSON.parse(localStorage.getItem("weatherInfo"));
    if (cityArray == null) {
        cityArray = [];
        cityArray.unshift(cityName);
    } else {
        for (let i = 0; i < cityArray.length; i++) {
            if (cityName.toLowerCase() == cityArray[i].toLowerCase()) {
                return newcity;
            }
        }
        if (cityArray.length < numOfCities) {
            // create object
            cityArray.unshift(cityName);
        } else {
            // control the length of the array. do not allow to save more than 10 cities
            cityArray.pop();
            cityArray.unshift(cityName);
        }
    }
    localStorage.setItem("weatherInfo", JSON.stringify(cityArray));
    newcity = 1;
    return newcity;
};

// city search button
var createCityNameBtn = function (cityName) {
    var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));
    // check the cityName parameter against all children of citiesListArr
    if (saveCities.length == 1) {
        var cityNameBtn = creatBtn(cityName);
        searchedCities.prepend(cityNameBtn);
    } else {
        for (let i = 1; i < saveCities.length; i++) {
            if (cityName.toLowerCase() == saveCities[i].toLowerCase()) {
                return;
            }
        }
        // check whether there are already have too many elements in this list of button
        if (searchedCities[0].childElementCount < numOfCities) {
            var cityNameBtn = creatBtn(cityName);
        } else {
            searchedCities[0].removeChild(searchedCities[0].lastChild);
            var cityNameBtn = creatBtn(cityName);
        }
        searchedCities.prepend(cityNameBtn);
        $(":button.list-group-item-action").on("click", function () {
            BtnClickHandler(event);
        });
    }
};

// event listener from form submit button
const formSubmitHandler = function (event) {
    event.preventDefault();
    // name of the city
    const cityName = $("#searchCity").val().trim();
    const newcity = saveCityName(cityName);
    cityWeather(cityName);
    if (newcity == 1) {
        createCityNameBtn(cityName);
    }
};
const BtnClickHandler = function (event) {
    event.preventDefault();
    // name of the city
    let cityName = event.target.textContent.trim();
    cityWeather(cityName);
};

// call function with submit button
$("#searchCityForm").on("submit", function () {
    formSubmitHandler(event);
  });
  $(":button.list-group-item-action").on("click", function () {
    BtnClickHandler(event);
  });