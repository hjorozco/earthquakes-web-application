const amber300 = "#FFD54F";
const amberA400 = "#FFC400";
const selectedEarthquakeBoxShadow =
    "rgba(0, 0, 0, 0.16) 0px 1px 3px, rgb(93, 64, 55) 0px 0px 0px 2px";
const earthquakeBoxShadow = "rgba(0, 0, 0, 0.08) 0px 4px 12px"

// Map object that uses "Leaflet" JavaScript Library
var map = L.map('map-content');
var mapMarker;
var previousSelectedEarthquake;

/**
 * Asynchronous funtion that fetches data from the USGS Earthquakes API.
 * 
 * @param {String} minMagnitude The minimum magnitude of the earthquakes to fetch.
 * @param {String} maxMagnitude The maximum magnitude of the earthquakes to fetch.
 * @returns A JSON object containing the list of earthquakes fetched, or null if an error occurs.
 */
const fetchDataFromUsgs = async (minMagnitude, maxMagnitude) => {
    let limit = 20000;
    const alertErrorMessage = "Error on the connection to the United States Geological Survey";
    const usgsEarthquakesApiEndpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query";
    const queryParameters =
        `?format=geojson&limit=${limit}&minmagnitude=${minMagnitude}&maxmagnitude=${maxMagnitude}`
        + "&orderby=time";
    const fetchUrl = usgsEarthquakesApiEndpoint + queryParameters;
    console.log("URL used to fetch data from USGS Earthquakes API:\n" + fetchUrl);

    disableUpdateButton(true);
    document.getElementById("list-title").innerHTML = "Loading earthquakes list";
    document.getElementById("list-content").innerHTML = "";
    document.getElementById("details-content").style.display = "none";
    document.getElementById("map-content").style.display = "none";
    document.getElementById("details-container").style.border = "none";

    try {
        const response = await fetch(fetchUrl);
        if (response.ok) {
            try {
                const data = await response.json();
                return data;
            } catch (error) {
                alert(alertErrorMessage);
                return null;
            }
        } else {
            throw new Error(`${response.status} (${response.statusText})`);
        }
    } catch (error) {
        alert(alertErrorMessage);
        return null;
    }
}

/**
 * Create the container "earthquakeDiv" that will display information of an earthquake. It will 
 * have two children: "titleDiv" that will display the title of the earthquake, and "timeDiv" that 
 * will displays the time of the earthquake. 
 * 
 * Add a click event listener to the container that will display the details and map of that 
 * particular earthquake.
 * 
 * @param {JSON Object} properties Contains the properties of an earthquake (magnitude, location, date, etc.)
 * @param {Array} coordinates Contains the coordinates of an earthquake (latitude, longitude and depth)
 * @returns The container with the earthquake information.
 */
const createEarthquakeContainer = (properties, coordinates) => {

    let earthquakeDiv = document.createElement("div");
    earthquakeDiv.style.display = "flex";
    earthquakeDiv.style.marginTop = "5px";
    earthquakeDiv.style.marginLeft = "10px"
    earthquakeDiv.style.marginRight = "10px"
    earthquakeDiv.style.padding = "10px";
    earthquakeDiv.style.borderRadius = "10px";
    earthquakeDiv.style.backgroundColor = amber300;
    earthquakeDiv.style.boxShadow = earthquakeBoxShadow;
    earthquakeDiv.style.cursor = "pointer";

    let titleDiv = document.createElement("div");
    titleDiv.style.paddingRight = "20px";
    titleDiv.style.width = "40%";
    titleDiv.style.fontWeight = "bold";
    titleDiv.innerHTML = properties["title"];

    let timeDiv = document.createElement("div");
    timeDiv.style.width = "60%";
    timeDiv.style.textAlign = "right";
    timeDiv.innerHTML = new Date(properties["time"]);

    earthquakeDiv.appendChild(titleDiv);
    earthquakeDiv.appendChild(timeDiv);
    earthquakeDiv.addEventListener(
        "mouseenter", () => earthquakeDiv.style.backgroundColor = amberA400);
    earthquakeDiv.addEventListener(
        "mouseleave", () => earthquakeDiv.style.backgroundColor = amber300);
    earthquakeDiv.addEventListener("click", () => {
        previousSelectedEarthquake.style.boxShadow = earthquakeBoxShadow;
        previousSelectedEarthquake = earthquakeDiv;
        earthquakeDiv.style.boxShadow = selectedEarthquakeBoxShadow;
        displayEarthquakeDetails(properties, coordinates);
        displayEarthquakeMap(coordinates, properties["title"])
    });

    return earthquakeDiv;
}

/**
 * Display a list of earthquakes on the "list" section of the page, and the details and map of the
 * first earthquake on that list.
 * 
 * @param {JSON object} data Earthquakes fetched from the USGS earthquakes API.
 */
const displayEarthquakes = data => {

    let listTitle = document.getElementById("list-title");
    let listContent = document.getElementById("list-content");

    disableUpdateButton(false);

    if (data !== null) {

        let features = data["features"];
        listTitle.innerHTML = `${features.length} Earthquakes on the last 30 days`;
        let firstEarthquakeOnList = true;

        features.forEach(feature => {
            let properties = feature["properties"];
            let coordinates = feature["geometry"]["coordinates"]
            let earthquakeDiv = createEarthquakeContainer(properties, coordinates);

            if (firstEarthquakeOnList) {
                displayEarthquakeDetails(properties, coordinates);
                displayEarthquakeMap(coordinates, properties["title"]);
                previousSelectedEarthquake = earthquakeDiv;
                earthquakeDiv.style.boxShadow = selectedEarthquakeBoxShadow;
                firstEarthquakeOnList = false;
            }

            listContent.appendChild(earthquakeDiv);
        });
    } else {
        listTitle.innerHTML = "No earthquakes data was loaded, please try again"
    }
}

/**
 * Display the details of a particular earthquake on the "details" section of the page.
 * 
 * @param {JSON Object} properties Contains the properties of an earthquake (magnitude, location, date, etc.)
 * @param {Array} coordinates Contains the coordinates of an earthquake (latitude, longitude and depth)
 */
const displayEarthquakeDetails = (properties, coordinates) => {

    document.getElementById("details-content").style.display = "block";
    document.getElementById("details-container").style.border = "1px solid #5D4037";

    document.getElementById("magnitude").innerHTML =
        properties["mag"] === null ? "No magnitude" : properties["mag"];
    document.getElementById("location").innerHTML =
        properties["place"] === null ? "No location" : properties["place"];
    document.getElementById("date").innerHTML =
        properties["time"] === null ? "No date" : new Date(properties["time"]);
    document.getElementById("intensity").innerHTML = `reported ` +
        `${properties["cdi"] === null ? "no" : properties["cdi"]}, estimated ` +
        `${properties["mmi"] === null ? "no" : properties["mmi"]}`;
    document.getElementById("alert").innerHTML =
        properties["alert"] === null ? "No alert" : properties["alert"].toUpperCase();
    document.getElementById("tsunami").innerHTML = properties["tsunami"] === 1 ?
        "Danger of a tsunami in close costal areas" : "No danger of a tsunami"
    document.getElementById("felt").innerHTML =
        properties["felt"] === null ? "0" : properties["felt"];
    document.getElementById("epicenter").innerHTML =
        `${coordinates[1] === null ? "No latitude" : coordinates[1]}, ` +
        `${coordinates[0] === null ? "No longitude" : coordinates[0]}, ` +
        `${coordinates[2] === null ? "No depth" : coordinates[2] + "km"}`;
}

/**
 * Display the map of a particular earthquake on the "map" section of the page.
 * 
 * @param {JSON Object} properties Contains the properties of an earthquake (magnitude, location, date, etc.)
 * @param {Array} coordinates Contains the coordinates of an earthquake (latitude, longitude and depth)
 */
const displayEarthquakeMap = (coordinates, earthquakeTitle) => {

    document.getElementById("map-content").style.display = "block";

    // Removes the marker of the previous earthquake
    if (mapMarker !== undefined) map.removeLayer(mapMarker);

    let latitude = coordinates[1];
    let longitude = coordinates[0];

    map.setView([latitude, longitude], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapMarker = new L.Marker([latitude, longitude]);
    map.addLayer(mapMarker);
    mapMarker.bindPopup(earthquakeTitle).openPopup();
}

/**
 * Disable of enable the "Update" button.
 * 
 * @param {Boolean} disable True to disable the button, false to enable it.
 */
const disableUpdateButton = disable => {
    let updateButton = document.getElementById("update-button");
    updateButton.disabled = disable;
    updateButton.style.color = disable ? "lightgrey" : "white";
}

/**
 * Update the list of earthquakes displayed, by fetching new data from the USGS API with the 
 * minimum and maximum magnitudes inputted by the user.
 */
const updateEarthquakesList = () => {
    let minMagnitude = document.getElementById("min-magnitude-input").value;
    let maxMagnitude = document.getElementById("max-magnitude-input").value;
    localStorage.setItem("minMagnitude", minMagnitude);
    localStorage.setItem("maxMagnitude", maxMagnitude);
    fetchDataFromUsgs(minMagnitude, maxMagnitude).then(displayEarthquakes);
}

/**
 * When the page loads.
 */
let minMagnitude = localStorage.getItem("minMagnitude");
if (minMagnitude !== null) document.getElementById("min-magnitude-input").value = minMagnitude;
let maxMagnitude = localStorage.getItem("maxMagnitude");
if (maxMagnitude !== null) document.getElementById("max-magnitude-input").value = maxMagnitude;
updateEarthquakesList();
document.getElementById("update-button").addEventListener("click", updateEarthquakesList);



