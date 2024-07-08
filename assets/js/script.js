// my api key to access the api
const API_KEY = "RKO3ggIBsa3Gmb7z5iDLOmzgaF0";

// api url to make calls to the api- const so we dont have to re type it each time
const API_URL = "https://ci-jshint.herokuapp.com/api";

// create a bootstrap modal with JS, see bootstrap doc for more info
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

/*
get button with the id "status" add click event listener to it
then call the getStatus function when clicked
"e" is a reference to the event good practice to pass the event object into our handler event
getStatus function- makes a GET request to the API_URL with the API_KEY then pass
this data to a function to display it 

*/ 

document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`; // same as-https://ci-jshint.herokuapp.com/api?api_key=RKO3ggIBsa3Gmb7z5iDLOmzgaF0

    const response = await fetch(queryString); // fetch the data and await a response

    const data = await response.json(); // convert response to json

    if (response.ok) {
        displayStatus(data); // calls the displayStatus function, passes it the data const and displays it as a modal
    } else {
        throw new Error(data.error); // if api key wrong or other error, returns error message
    }

}

function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    // get these elements and change their text/html to the variables above
    document.getElementById("resultsModalTitle").innerText = heading; 
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show(); // show the results modal with the info above

}