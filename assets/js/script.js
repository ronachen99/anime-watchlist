//------------------------------------------------------------------------------------------------------------//
// Local storage section
//------------------------------------------------------------------------------------------------------------//
//list items
var currentlyWatching = JSON.parse(localStorage.getItem("currentlyWatching")) || [];
var planToWatch = JSON.parse(localStorage.getItem("planToWatch")) || [];
var completed = JSON.parse(localStorage.getItem("completed")) || [];

//list sections
var currentlyWatchingListDisplay = document.querySelector("#current-list");
var planToWatchListDisplay = document.querySelector("#plan-list");
var completedListDisplay = document.querySelector("#completed-list");

// List Type Selector
var listType = "";

//update lists
updateListDisplay(currentlyWatching, currentlyWatchingListDisplay);
updateListDisplay(planToWatch, planToWatchListDisplay);
updateListDisplay(completed, completedListDisplay);

// List Type Functions
function getListType() {
    return listType;
}
function setListType(value) {
    listType = value;
}
//functions
//update lists from local storage
function updateLocalStorageLists() {
    var currentlyWatching = JSON.parse(localStorage.getItem("currentlyWatching")) || [];
    console.log(currentlyWatching);
    var planToWatch = JSON.parse(localStorage.getItem("planToWatch")) || [];
    console.log(planToWatch);
    var completed = JSON.parse(localStorage.getItem("completed")) || [];
    console.log(completed);
}

//save list items to local storage
function setLocalStorageLists() {
    localStorage.setItem("currentlyWatching", JSON.stringify(currentlyWatching));
    localStorage.setItem("planToWatch", JSON.stringify(planToWatch));
    localStorage.setItem("completed", JSON.stringify(completed));
}

function clearLocalStorage() {
    localStorage.clear();
}

//------------------------------------------------------------------------------------------------------------//
// Display list items from local storage
//------------------------------------------------------------------------------------------------------------//



function updateListDisplay(listType, listDisplay) {
    //update local storage
    updateLocalStorageLists();
    //for each container
    console.log("updating list display");
    //update storage lists
    if (listType) {
        for (x = 0; x < listType.length; x++) {
            console.log("displaying item: " + x);
            console.log(listType[x]);
            var malID = listType[x].mal_id;
            var image = listType[x].images.jpg.image_url;
            var title = listType[x].title;
            listDisplay.innerHTML += `<div class="column is-one-fifth" id = '${malID}'>
            <div class="card sunset glow">
                <header class="card-header">
                    <button id="completed-btn" class="button is-success is-rounded">✓ </button>
                    <button id="remove-btn" class="button is-danger is-rounded">✕</button>
                </header>
                <figure class="image is-4by3">
                    <img src= '${image}' alt="Placeholder image">
               </figure>
                <div class="card-content">
                    <h2>'${title}'</h2>
                </div>
            </div>
            </div>`;
        }
    }
}

//------------------------------------------------------------------------------------------------------------//
// Anime search box section
//------------------------------------------------------------------------------------------------------------//

// Variable to store search data
var searchData;

// Search Box Elements
var searchBox = document.querySelector("#searchBox");
var searchButton = document.querySelector("#searchButton");

// Anime Tiles Container (from search results)
var searchResultsContainer = document.querySelector("#searchResults");

// Add to currently watching button
var addToCurrentlyWatching = document.querySelector(".add-to-currently-watching");
var addToPlanToWatch = document.querySelector(".add-to-plan-to-watch");
var addToCompleted = document.querySelector(".add-to-completed");



// Search Result Constructor
function searchResultConstructor(event) {
    event.preventDefault();
    var searchCriteria = searchBox.value.trim();
    getSearchResults(searchCriteria);
    searchBox.value = '';
}

// Fetch Anime Data
function getSearchResults(searchCriteria) {
    var jikanUrl = "https://api.jikan.moe/v4/anime?q=" + searchCriteria + "&sfw";
    console.log("searching " + jikanUrl);
    fetch(jikanUrl)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                if (data.data.length === 0) {
                    return searchResultsContainer.textContent = '(._.) sorry...nothing was found...';
                } else {
                    searchData = data;
                    displaySearchResults(data);
                }
            });
        })
}

// Empty Search Results
function clearSearchResults() {
    while (searchResultsContainer.firstChild) {
        searchResultsContainer.removeChild(searchResultsContainer.firstChild);
    }
}

// Create Anime Search Tiles
function displaySearchResults(data) {
    // Clear existing search results
    clearSearchResults();
    // Loop through each result
    for (x = 0; x < data.data.length; x++) {
        var tileLink = data.data[x].images.jpg.image_url;
        var animeTile = document.createElement("div");
        animeTile.setAttribute('id', 'anime-tiles');
        animeTile.innerHTML = `<div class='image-container'><button class='add-button'>+</button><img src='${tileLink}' alt='animeImage'/></div>`
        searchResultsContainer.appendChild(animeTile);
    }
}

// Add selecteed items to list
function addItemsToList(event) {
    //check if the button is clicked
    if (event.target.classList.contains("add-button")) {
        //get the button's parent element
        var animeImgContainer = event.target.parentNode;
        //get the index of the object to be added
        var tileIndex = Array.from(searchResultsContainer.children).indexOf(animeImgContainer.parentNode);
        //set clickedData equal to the search data
        var clickedData = searchData.data[tileIndex];
        //add the clicked data to the respective list
        //add the clickedData to the selected list if it's not already in ANY of the lists
        // console.log(clickedData);
        // console.log(currentlyWatching);
        if (!currentlyWatching.includes(clickedData) && !planToWatch.includes(clickedData) && !completed.includes(clickedData)) {
            switch (listType) {
                case ("currentlyWatching"):
                    currentlyWatching.push(clickedData);
                    setLocalStorageLists();
                    console.log("Updated local storage");
                    currentlyWatchingListDisplay.innerHTML = "";
                    updateListDisplay(currentlyWatching, currentlyWatchingListDisplay);
                    break;
                case ("planToWatch"):
                    planToWatch.push(clickedData);
                    setLocalStorageLists();
                    console.log("Updated local storage");
                    planToWatchListDisplay.innerHTML = "";
                    updateListDisplay(planToWatch, planToWatchListDisplay);
                    break;
                case ("completed"):
                    completed.push(clickedData);
                    setLocalStorageLists();
                    console.log("Updated local storage");
                    completedListDisplay.innerHTML = "";
                    updateListDisplay(completed, completedListDisplay);
                    break;
                default:
                    console.log("item already added to list");
            }
            updateListDisplay();
            setLocalStorageLists();
        }
    }
}
//------------------------------------------------------------------------------------------------------------//
// Remove Anime: remove anime from the list
//------------------------------------------------------------------------------------------------------------//
function removeAnime(event) {
    var removeButton = event.target;
    var columnDiv = removeButton.closest('.column');
    var malID = columnDiv.id;

    // Determine the list type based on the parent container and create an updated array by filtering out the selected columnDiv
    if (columnDiv.parentNode === currentlyWatchingListDisplay) {
        currentlyWatching = currentlyWatching.filter(x => x.mal_id != malID)
        localStorage.setItem("currentlyWatching", JSON.stringify(currentlyWatching));
    } else if (columnDiv.parentNode === planToWatchListDisplay) {
        planToWatch = planToWatch.filter(x => x.mal_id != malID)
        localStorage.setItem("planToWatch", JSON.stringify(planToWatch));
    } else if (columnDiv.parentNode === completedListDisplay) {
        completed = completed.filter(x => x.mal_id != malID)
        localStorage.setItem("completed", JSON.stringify(completed));
    }
    // Remove the columnDiv
    columnDiv.remove();
}

// Update the event listener to target the remove button id
document.addEventListener('click', function (event) {
    if (event.target.id === 'remove-btn') {
        removeAnime(event);
    }
});
//------------------------------------------------------------------------------------------------------------//
// Quote Search Section
//------------------------------------------------------------------------------------------------------------//
var quotesFormEl = document.querySelector('#quotes-form');
var keywordEl = document.querySelector('#keyword');
var optionEl = document.querySelector('#option');
var quotesResult = document.querySelector('#quotes-result');
//------------------------------------------------------------------------------------------------------------//
// Quotes Form Handler: take in the input value and the selected option
//------------------------------------------------------------------------------------------------------------//
function quotesFormHandler(event) {
    event.preventDefault();
    var keyword = keywordEl.value.trim();
    var option = optionEl.value.trim();
    runData(keyword, option);
    keywordEl.value = '';
}
//------------------------------------------------------------------------------------------------------------//
// Run Data: run fetch data from Anime Chan API 
//------------------------------------------------------------------------------------------------------------//
function runData(keyword, option) {
    quotesResult.innerHTML = '';
    if (option == 1) {
        fetchByTitle(keyword);
    } else
        fetchByName(keyword);
}
//------------------------------------------------------------------------------------------------------------//
// Fetch by Title: fetch data from AnimeChan through anime title
//------------------------------------------------------------------------------------------------------------//
function fetchByTitle(keyword) {
    var animechanURL = 'https://animechan.vercel.app/api/quotes/anime?title=' + keyword
    fetch(animechanURL)
        .then(function (response) {
            if (!response.ok) {
                return errorResponse();
            }
            response.json().then(function (data) {
                createQuotes(data);
            })
        })
}
//------------------------------------------------------------------------------------------------------------//
// Fetch by Name: fetch data from AnimeChan through anime character
//------------------------------------------------------------------------------------------------------------//
function fetchByName(keyword) {
    var animechanURL = 'https://animechan.vercel.app/api/quotes/character?name=' + keyword
    fetch(animechanURL)
        .then(function (response) {
            if (!response.ok) {
                return errorResponse();
            }
            response.json().then(function (data) {
                createQuotes(data);
            })
        })
}
//------------------------------------------------------------------------------------------------------------//
// Create Quotes
//------------------------------------------------------------------------------------------------------------//
function createQuotes(data) {
    for (x = 0; x < data.length; x++) {
        quotesResult.innerHTML += `<li><p> ${data[x].character} </p><q> ${data[x].quote} </q></li>`
    }
}
//------------------------------------------------------------------------------------------------------------//
// Error Response: sends an error message
//------------------------------------------------------------------------------------------------------------//
function errorResponse() {
    quotesResult.innerHTML += '(._.) sorry...something went wrong...';
}
//------------------------------------------------------------------------------------------------------------//
// Event Listeners for add to list buttons
//------------------------------------------------------------------------------------------------------------//
addToCurrentlyWatching.addEventListener("click", function () {
    setListType("currentlyWatching");
});

addToPlanToWatch.addEventListener("click", function () {
    setListType("planToWatch");
});

addToCompleted.addEventListener("click", function () {
    setListType("completed");
});

//------------------------------------------------------------------------------------------------------------//
// Event Listener for search anime constructor
//------------------------------------------------------------------------------------------------------------//
searchButton.addEventListener("click", searchResultConstructor);
//------------------------------------------------------------------------------------------------------------//
// Event listener for add to list buttons
//------------------------------------------------------------------------------------------------------------//
searchResultsContainer.addEventListener("click", addItemsToList)
//------------------------------------------------------------------------------------------------------------//
// Event Listener: that calls for quotes form handler on click
//------------------------------------------------------------------------------------------------------------//
quotesFormEl.addEventListener('submit', quotesFormHandler);
//------------------------------------------------------------------------------------------------------------//
// Animate.css Properties
//------------------------------------------------------------------------------------------------------------//
const hero = document.querySelector('.hero');
hero.style.setProperty('--animate-duration', '5s');
