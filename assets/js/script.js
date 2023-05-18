//------------------------------------------------------------------------------------------------------------//
// Anime search section
//------------------------------------------------------------------------------------------------------------//

// Variable to store search data
var searchData;

// List Arrays
var currentlyWatching = [];
var planToWatch = [];
var completed = [];

// Search Box Elements
var searchBox = document.querySelector("#searchBox");
var searchButton = document.querySelector("#searchButton");

// Anime Tiles Container (from search results)
var searchResultsContainer = document.querySelector("#searchResults");

// Add to currently watching button
var addToCurrentlyWatching = document.querySelector(".add-to-currently-watching");
var addToPlanToWatch = document.querySelector(".add-to-plan-to-watch");
var addToCompleted = document.querySelector(".add-to-completed");

// List Type Selector
var listType = "";

// List Type Functions
function getListType() {
    return listType;
}
function setListType(value) {
    listType = value;
}

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
                }  
                searchData = data;
                displaySearchResults(data);
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
    //clear existing search results
    clearSearchResults();
    //loop through each result
    for (x = 0; x < data.data.length; x++) {
        //display the anime pictures
        var animeTile = document.createElement("div");
        //values for anime tile size
        animeTile.setAttribute('id', 'anime-tiles');
        //create container for image element
        var animeImgContainer = document.createElement("div");
        //set image container attributes
        animeImgContainer.classList.add('img-container');
        //create image element
        var animeImg = document.createElement("img");
        //get the anime picture(s)
        var tileLink = data.data[x].images.jpg.image_url;
        //set animeImg attributes
        animeImg.setAttribute("src", tileLink);
        animeImg.setAttribute("alt", "animeImage");
        //construct and add buttons to items
        var addButton = document.createElement("button");
        //button attributes
        addButton.textContent = "+";
        addButton.classList.add('add-button');
        //append buttons to tile
        animeImgContainer.appendChild(addButton);
        //append image to container
        animeImgContainer.appendChild(animeImg);
        //append image container to tile
        animeTile.appendChild(animeImgContainer);
        //tile classes if needed
        animeTile.classList = "";
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
        //add the clickedData to the selected list if it's not already in the list
        if (listType === "currentlyWatching" && !currentlyWatching.includes(clickedData)) {
            currentlyWatching.push(clickedData);
            console.log("Updated currentlyWatching array: ");
            console.log(currentlyWatching);
        } else if (listType === "planToWatch" && !planToWatch.includes(clickedData)) {
            planToWatch.push(clickedData);
        } else if (listType === "completed" && !completed.includes(clickedData)) {
            completed.push(clickedData);
        }
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

// addToPlanToWatch.addEventListener("click", function () {
//     setListType("planToWatch");
// });

// addToCompleted.addEventListener("click", function () {
//     setListType("completed");
// });

//------------------------------------------------------------------------------------------------------------//
// Event Listener for search anime constructor
//------------------------------------------------------------------------------------------------------------//
searchButton.addEventListener("click", function (event) {
    //prevent the page from refreshing
    event.preventDefault();
    searchResultConstructor(event);
});
//------------------------------------------------------------------------------------------------------------//
// Event listener for add to list buttons
//------------------------------------------------------------------------------------------------------------//
searchResultsContainer.addEventListener("click", function (event) {
    addItemsToList(event);
})
//------------------------------------------------------------------------------------------------------------//
// Event Listener: that calls for quotes form handler on click
//------------------------------------------------------------------------------------------------------------//
quotesFormEl.addEventListener('submit', quotesFormHandler);
//------------------------------------------------------------------------------------------------------------//
// Animate.css Properties
//------------------------------------------------------------------------------------------------------------//
const hero = document.querySelector('.hero');
hero.style.setProperty('--animate-duration', '5s');

const nav = document.querySelector('navbar-menu');
nav.style.setProperty('--animate-duration', '10s');