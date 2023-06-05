const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially, 
let oldTab = userTab;
oldTab.classList.add("current-tab");


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


