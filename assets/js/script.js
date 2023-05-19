//------------------------------------------------------------------------------------------------------------//
// Local Storage Section
//------------------------------------------------------------------------------------------------------------//
var currentlyWatchingListDisplay = document.querySelector("#current-list");
var planToWatchListDisplay = document.querySelector("#plan-list");
var completedListDisplay = document.querySelector("#completed-list");
//------------------------------------------------------------------------------------------------------------//
// Load Storage: get list items from the local storage and update it
//------------------------------------------------------------------------------------------------------------//
function loadStorage() {
    var currentlyWatching = JSON.parse(localStorage.getItem("currentlyWatching")) || [];
    var planToWatch = JSON.parse(localStorage.getItem("planToWatch")) || [];
    var completed = JSON.parse(localStorage.getItem("completed")) || [];
    updateListDisplay(currentlyWatching, currentlyWatchingListDisplay);
    updateListDisplay(planToWatch, planToWatchListDisplay);
    updateListDisplay(completed, completedListDisplay);
}
//------------------------------------------------------------------------------------------------------------//
// Update List Display: list items from local storage
//------------------------------------------------------------------------------------------------------------//
function updateListDisplay(list, listDisplay) {
    var addButton = '';
    if(listDisplay.id == "current-list"){
        addButton = '<button id="completed-btn" class="button is-success is-rounded">✓ </button>'
    }else{
        addButton = '';
    }
    if (list) {
        listDisplay.innerHTML = ""
        for (x = 0; x < list.length; x++) {
            var malID = list[x].mal_id;
            var image = list[x].images.jpg.image_url;
            var title = list[x].title;
            listDisplay.innerHTML += 
            `<div class="column is-one-fifth" id = '${malID}'>
                <div class="card sunset glow">
                    <header class="card-header">
                        '${addButton}'
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
// Anime Search Section
//------------------------------------------------------------------------------------------------------------//
// Search Box Elements
var searchBox = document.querySelector("#searchBox");
var searchButton = document.querySelector("#searchButton");

// Anime Tiles Container
var searchResultsContainer = document.querySelector("#searchResults");

// Add to currently watching button
var addToCurrentlyWatching = document.querySelector(".add-to-currently-watching");
var addToPlanToWatch = document.querySelector(".add-to-plan-to-watch");
var addToCompleted = document.querySelector(".add-to-completed");
//------------------------------------------------------------------------------------------------------------//
// Set List Type
//------------------------------------------------------------------------------------------------------------//
var listType = '';

function setListType(value) {
    listType = value;
}
//------------------------------------------------------------------------------------------------------------//
// Search Result Constructor: take in input value for search anime form
//------------------------------------------------------------------------------------------------------------//
function searchResultConstructor(event) {
    event.preventDefault();
    var searchCriteria = searchBox.value.trim();
    getSearchResults(searchCriteria);
    searchBox.value = '';
}
//------------------------------------------------------------------------------------------------------------//
// Get Search Results: fetch from Jikan API for anime data
//------------------------------------------------------------------------------------------------------------//
function getSearchResults(searchCriteria) {
    var jikanUrl = "https://api.jikan.moe/v4/anime?q=" + searchCriteria + "&sfw";
    fetch(jikanUrl)
        .then(function (response) {
            response.json().then(function (data) {
                if (data.data.length === 0) {
                    return searchResultsContainer.textContent = '(._.) sorry...nothing was found...';
                } else {
                    displaySearchResults(data);
                }
            });
        })
}
//------------------------------------------------------------------------------------------------------------//
// Display Search Results: make anime tiles in serach result container
//------------------------------------------------------------------------------------------------------------//
function displaySearchResults(data) {
    searchResultsContainer.innerHTML = '';
    for (x = 0; x < data.data.length; x++) {
        var tileLink = data.data[x].images.jpg.image_url;
        var animeTile = document.createElement("div");
        animeTile.setAttribute('id', 'anime-tiles');
        animeTile.innerHTML = `<div class='image-container'><button class='add-button'>+</button><img src='${tileLink}' alt='animeImage'/></div>`
        searchResultsContainer.appendChild(animeTile);
    }

    var addButtons = document.querySelectorAll(".add-button");
    for (let i = 0; i < data.data.length; i++) {
        addButtons[i].addEventListener("click", function (event) {
            event.preventDefault();
            addToList(listType, data.data[i])
        })
    }
}
//------------------------------------------------------------------------------------------------------------//
// Move To Complete: move anime from the current list to the completed list
//------------------------------------------------------------------------------------------------------------//
function moveToComplete(event) {
    var completeButton = event.target;
    var columnDiv = completeButton.closest('.column');
    var malID = columnDiv.id;
    var currentlyWatching = JSON.parse(localStorage.getItem("currentlyWatching")) || [];
    var animeIndex = currentlyWatching.findIndex(element => element.mal_id == malID);
    if (animeIndex != -1) {
        addToList('completed', currentlyWatching[animeIndex]);
        removeFromList('currentlyWatching', malID);
    }
}
//------------------------------------------------------------------------------------------------------------//
// Add To List: add the targeted anime to the targeted list
//------------------------------------------------------------------------------------------------------------//
function addToList(whichList, whatToAdd) {
    var currentList = JSON.parse(localStorage.getItem(whichList)) || [];
    var isAlreadyThere = false;
    for (let i = 0; i < currentList.length; i++) {
        if (currentList[i].mal_id === whatToAdd.mal_id) {
            isAlreadyThere = true;
            break;
        }
    }
    if (isAlreadyThere) return
    currentList.push(whatToAdd),
        localStorage.setItem(whichList, JSON.stringify(currentList))
    loadStorage()
}
//------------------------------------------------------------------------------------------------------------//
// Remove From List: remove anime from the target list
//------------------------------------------------------------------------------------------------------------//
function removeFromList(whichList, idToRemove) {
    var currentList = JSON.parse(localStorage.getItem(whichList));
    var newList = currentList.filter(x => x.mal_id != idToRemove);
    localStorage.setItem(whichList, JSON.stringify(newList));
    loadStorage();
}
//------------------------------------------------------------------------------------------------------------//
// Remove Anime: determines which list to remove anime from
//------------------------------------------------------------------------------------------------------------//
function removeAnime(event) {
    var removeButton = event.target;
    var columnDiv = removeButton.closest('.column');
    var malID = columnDiv.id;

    // Determine the list type based on the parent container and create an updated array by filtering out the selected columnDiv
    if (columnDiv.parentNode === currentlyWatchingListDisplay) {
        removeFromList("currentlyWatching", malID)
    } else if (columnDiv.parentNode === planToWatchListDisplay) {
        removeFromList("planToWatch", malID)
    } else if (columnDiv.parentNode === completedListDisplay) {
        removeFromList("completed", malID)
    }
}
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
// Error Response: sends an error message for quote section
//------------------------------------------------------------------------------------------------------------//
function errorResponse() {
    quotesResult.innerHTML += '(._.) sorry...something went wrong...';
}
//------------------------------------------------------------------------------------------------------------//
// Event Listeners: for add to list buttons
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
// Event Listener: that target the completed button id
//------------------------------------------------------------------------------------------------------------//
document.addEventListener('click', function (event) {
    if (event.target.id === 'completed-btn') {
        moveToComplete(event);
    }
});
//------------------------------------------------------------------------------------------------------------//
// Event Listener: that target the remove button id
//------------------------------------------------------------------------------------------------------------//
document.addEventListener('click', function (event) {
    if (event.target.id === 'remove-btn') {
        removeAnime(event);
    }
});
//------------------------------------------------------------------------------------------------------------//
// Event Listener: for search anime constructor
//------------------------------------------------------------------------------------------------------------//
searchButton.addEventListener("click", searchResultConstructor);
//------------------------------------------------------------------------------------------------------------//
// Event Listener: that calls for quotes form handler on click
//------------------------------------------------------------------------------------------------------------//
quotesFormEl.addEventListener('submit', quotesFormHandler);
//------------------------------------------------------------------------------------------------------------//
// Animate.css Properties
//------------------------------------------------------------------------------------------------------------//
const hero = document.querySelector('.hero');
hero.style.setProperty('--animate-duration', '5s');

loadStorage();