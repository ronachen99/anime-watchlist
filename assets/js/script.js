//search box elements
var searchBox = document.querySelector("#searchBox");
var searchButton = document.querySelector("#searchButton");
//Wherever we want the anime tiles to appear
var searchResultsContainer = document.querySelector("#searchResults");
var searchCriteria = "";
//get a list of anime from jikan
var jikanUrl;

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    //if search box isn't empty
    if (searchBox.value !== "") {
        searchCriteria = searchBox.value.trim();
        jikanUrl = "https://api.jikan.moe/v4/anime?q=" + searchCriteria + "&sfw";
        console.log("searching " + jikanUrl);
        getSearchResults(searchCriteria);
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
}

function clearSearchResults(){
    while(searchResultsContainer.firstChild){
        searchResultsContainer.removeChild(searchResultsContainer.firstChild);
    }
}

function displaySearchResults(data) {
    //clear existing search results
    clearSearchResults();
    for (x = 0; x < data.data.length; x++) {
        //display the anime pictures
        console.log(data.data[x]);
        var animeTile = document.createElement("img");
        //tile classes if needed
        animeTile.classList = "";
        //get the anime picture(s)
        var tileLink = data.data[x].images.jpg.image_url;
        //
        animeTile.setAttribute("src", tileLink, "alt", "testing");
        searchResultsContainer.appendChild(animeTile);
        console.log(animeTile.attributes);
    }
}


//search criteria 








