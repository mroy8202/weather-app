const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially, 
let oldTab = userTab;
const API = "574d4e9824d9931bff0d466cb123ba35";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab) {
    // when user clicks on unclicked tab
    if(oldTab != newTab) {
        oldTab.classList.remove("current-tab"); // remove applied css from old tab
        oldTab = newTab;
        oldTab.classList.add("current-tab"); // apply css on new tab

        // Now, i could have clicked on search tab from user tab
        if(!searchForm.classList.contains("active")) {
            // if search form container is invisble, then make it visible and make rest UI invisible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        // now i, could have clicked on user tab from search tab
        else {
            // initially, i was on search tab, now i have to visit your weather(user tab)
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now, i have visited "Your Weather" tab, i have to display weather.
            // let's check local storage first for co-ordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener('click', () => {
    // passing clicked tab as input paramater
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    //passing clicked tab as an input parameter
    switchTab(searchTab);
});


// This function checks if co-ordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // if local coordinates are not found, then display grant location page
        grantAccessContainer.classList.add("active");
    }
    else {
        // if coordinates are found
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // maek grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        const data = await response.json();
        // now, we have recieved our data. Let's remove loader screen
        loadingScreen.classList.remove("active");
        // now display userInfoContainer
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        console.log("Error..." , err);
    }
}

function renderWeatherInfo(weatherInfo) {
    // first, we fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Fetch values form weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innertext = weatherInfo?.wind?.speed;
    humidity.innertext = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("GeoLocation support not available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log("error hai", err);
    }
}
