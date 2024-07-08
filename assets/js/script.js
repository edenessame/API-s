// test code as you go to make sure data is submitted it the right format

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
get button with the id "submit" add click event listener to it

*/ 

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

/**
 * is passed the html form data as a parameter (form) from the postForm function bellow
 * 
 * we create an empty array
 * 
 * the data passed comes as many seperate arrays as key:value pairs all with the key "options" 
 * eg ["options", "jquery"] ["options", "es6"]
 * we want one array to send to the API with just with the values
 * so a for loop iterates through the form entries 
 * if the key [0] is "options" push its value [1] to the new array
 * 
 * then delete all the "options"
 * 
 * then add one "options to the array"
 */
function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options"); // deletes all occurences of "options" in the form data

    form.append("options", optArray.join()); // just adds one "options" to the start of the list

    return form;
}


/**
 * async function to await results of a promise
 * FormData() captures all the fields of a form and returns it as an object
 * we can then give the object to fetch and don't need to do any processing
 * 
 * passes it to the processOptions function above
 * 
 * makes a POST request to the API
 * authorizes it with the API key and attaches the form as the body of the request
 * 
 * then convert the response to json and display it
 * then calls the displayErrors hunction and passes the json data into it
 */
async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform")));

    /**
     * to check if the data is right a for loop that loops through the form entries and logs them 
     * for (let entry of form.entries()) {
        console.log(entry);
    }
     */

    for (let entry of form.entries()) {
        console.log(entry);
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

}

/**
 * getStatus function- makes a GET request to the API_URL with the API_KEY then pass
this data to a function to display it 
 * 
 */
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

/**
 * declare empty results variable
 * passes it the data variable defined in the PostForm function - const data = await response.json();
 * and update the results variable depending on the errors to an html div
 * if errors are 0 display first div
 * otherwise iterate through using a for loop 
 * and update the span with the amount of errors 
 * 
 * to get the keywords to add after data eg data.total_errors data.error_list
 * check the json that is returned in the console 
 */
function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`; 
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    // get these elements and change their text/html to the variables above
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show(); // shows the modal
}

function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}