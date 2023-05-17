//------------------------------------------------------------------------------------------------------------//
// Anime search section
//------------------------------------------------------------------------------------------------------------//
//variable to store search data
var searchData;

//list items
var currentlyWatching = [];
var planToWatch = [];
var completed = [];

//search box elements
var searchBox = document.querySelector("#searchBox");
var searchButton = document.querySelector("#searchButton");

//Wherever we want the anime tiles to appear
var searchResultsContainer = document.querySelector("#searchResults");

//add to currently watching button
var addToCurrentlyWatching = document.querySelector(".add-to-currently-watching")

//list type selector
var listType = "";
//url variables
var searchCriteria = "";
var jikanUrl;

//event listener for add to currentlyWatching section button
addToCurrentlyWatching.addEventListener("click", function () {
    listType = "currentlyWatching";
})
//event listener for add to planToWatch section button

//event listener for add to completed section button

//event listener for search field
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    //if search box isn't empty
    if (searchBox.value !== "") {
        searchCriteria = searchBox.value.trim();
        jikanUrl = "https://api.jikan.moe/v4/anime?q=" + searchCriteria + "&sfw";
        console.log("searching " + jikanUrl);
        getSearchResults(searchCriteria);
    }
    //if search results are empty
    else {

    }
})

function getSearchResults(searchCriteria) {
    if (searchCriteria) {
        //search
        fetch(jikanUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //display data
                console.log(data);
                searchData = data;
                displaySearchResults(data);
            });
    }
    else {
        //display error
    }
}

function clearSearchResults() {
    while (searchResultsContainer.firstChild) {
        searchResultsContainer.removeChild(searchResultsContainer.firstChild);
    }
}

//need to get the list
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
        //create + buttons
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

//event listener for buttons
searchResultsContainer.addEventListener("click", function (event) {
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
        //console.log("Added to", listType, ":", clickedData);
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
// Event Listener: that calls for quotes form handler on click
//------------------------------------------------------------------------------------------------------------//
quotesFormEl.addEventListener('submit', quotesFormHandler);