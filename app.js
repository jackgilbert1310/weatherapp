var app = document.getElementById('app');
var locationInputEl = document.getElementById('locationInput');
var searchLocationBtnEl = document.getElementById('searchLocation');
var errorBanner = document.getElementById('errorBanner');
var addToWatchlistBtn = document.getElementById('addToWatchlist');

const API_KEY = "a079101f1ffd163a4a5b2b4b8e3cc1d4";

locationInputEl.focus();
    
if (localStorage.lastSearch) {
    getWeather(localStorage.lastSearch);
}

async function getWeather(location) {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => showData(data));
}

function showData(data) {
    console.log(data);

    if (data.cod == "200") {
        saveToLocalStorage(data.name);
        addToWatchlist.dataset.location = data.name;
        errorBanner.style.display = "none";
        var locationTitle = document.getElementById('locationTitle');
        var locationMainStatus = document.getElementById('locationMainStatus');
        var locationTemp = document.getElementById('locationTemp');
        var currentDate = document.getElementById('currentDate');
        
        getWeatherIcon(data.weather[0].icon);
        
        locationTitle.innerHTML = data.name + ", " + data.sys.country;
        locationMainStatus.innerHTML = data.weather[0].description;
        locationTemp.innerHTML = Math.floor(data.main.temp) + '&deg;';
        currentDate.innerHTML = new Date();
    } else if (data.cod == "404"){
        showError('Location not found, please try again...');
    }
}

function searchForLocation() {
    if (locationInputEl.value.length <= 0) {
        showError('Enter a location...');
    } else {
        var location = locationInputEl.value;
        getWeather(location);
    }
}

function saveToLocalStorage(location) {
    if (!localStorage.lastSearch) {
        localStorage.setItem("lastSearch", location);
    } else {
        localStorage.lastSearch = location;
    }
}

function getWeatherIcon(iconCode) {
    var icon = document.getElementById('weatherIcon');
    icon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function addToWatchList() {
    console.log(localStorage);
    console.log(this.dataset.location);
    if (localStorage.watchList) {
        localStorage.watchList.push(JSON.stringify(this.dataset.location));
    } else {
        localStorage.setItem("watchList", [this.dataset.location]);
    }
    console.log(localStorage.watchList);
}

function showError(message) {
    var errorTextEl = document.getElementById('errorText');
    errorBanner.style.display = "block";
    errorTextEl.innerHTML = message;
}

searchLocationBtnEl.addEventListener('click', searchForLocation);
addToWatchlistBtn.addEventListener('click', addToWatchList);