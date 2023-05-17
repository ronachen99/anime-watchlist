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
var addToCurrentlyWatching = document.querySelector(".currently-watching")

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
                console.log(data);
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
        animeTile.setAttribute("style", "height:350px; width:250px; border-style:solid; border-radius:20px position: relative; display: inline; margin: 10px;");
        //create container for image element
        var animeImgContainer = document.createElement("div");
        //set image container attributes
        animeImgContainer.setAttribute("style", "position:relative;");
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
        addButton.setAttribute("style", "border-radius: 20px; font-size:30px; position: absolute; top: 0; right: 0;width:40px;height:40px;");
        //set a unique id for each container
        addButton.setAttribute("id", "animeTile-" + x);
        //append buttons to tile
        animeImgContainer.appendChild(addButton);
        //append image to container
        animeImgContainer.appendChild(animeImg);
        //append image container to tile
        animeTile.appendChild(animeImgContainer);
        //click event for addButtons
        addButton.addEventListener("click", function (event) {
            //switch case for which list to add to
            switch (listType) {
                case "currentlyWatching":
                    //compare chosen anime id to all other anime id's currently in list
                    for (y = 0; y > currentlyWatching.length; y++) {
                        //if chosen anime isnt already on the list, add it
                        if (currentlyWatching.data[y].mal_id !== data.data[(addButton.id.split("-")[1])].mal_id) {
                            console.log(currentlyWatching[0]);
                            //push anime object to currentlyWatching list
                            currentlyWatching.push(data.data[addButton.id.split("-")[1]]);
                        }
                    }

                    console.log(currentlyWatching[0]);
                    break;
            }


            //if anime isn't already added to the list, add it



        })

        //tile classes if needed
        animeTile.classList = "";

        searchResultsContainer.appendChild(animeTile);
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
                return '(._.) sorry...nothing was found' //Need to make it into a modal etc.
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
                return '(._.) sorry...nothing was found' //Need to make it into a modal etc.
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
// Event Listener: that calls for quotes form handler on click
//------------------------------------------------------------------------------------------------------------//
quotesFormEl.addEventListener('submit', quotesFormHandler);