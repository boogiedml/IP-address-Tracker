
const secretApi = "at_PM73NZNkqUd3tep5ei31yCGMg7bVp";
// const bypassCorsUrl = "https://cors-anywhere.herokuapp.com";
const apiUri = "https://geo.ipify.org/api/";
let currentVersion = "v2";

let currentIp = document.getElementById("currentIp");
let currentTown = document.getElementById("currentTown");
let currentZone = document.getElementById("currentZone");
let currentIsp = document.getElementById("currentIsp");

// form 
const enteredIpAddress = document.getElementById("ipAddress");
const searchBtn = document.getElementById("searchBtn");

const headersOption = {
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
}


const map = L.map('map'); ///////


updateMarker = (update_marker = [6.54971, 3.400621]) => {
    map.setView(update_marker, 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker(update_marker).addTo(map)
    
    L.circle([51.508, -0.11], {
        color: '#1F4690',
        fillColor: '#47B5FF',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    onMapClick = (e) => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
}

document.addEventListener("load", updateMarker())

getIpDetails = (default_ip) => {
    if(default_ip == undefined){
        var ipUrl = `${apiUri}${currentVersion}/country?apiKey=${secretApi}`
    }else{
        var ipUrl = `${apiUri}${currentVersion}/country?apiKey=${secretApi}&ipAddress=${default_ip}`
    }

    fetch(ipUrl, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            currentIp.innerHTML = data.ip;
            currentTown.innerHTML = `${data.location.region}, ${data.location.country}`;
            currentZone.innerHTML = `UTC ${data.location.timezone}`;
            currentIsp.innerHTML = data.isp;

            console.log(currentTown);

            let llIpUrl = `https://api.opencagedata.com/geocode/v1/json?q=$Bariga%2C%20${data.location.country}&key=bccb57848eb2424fbdaba5b60f52ecff&language=en&pretty=1`
            fetch(llIpUrl, {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {

                lat = data.results[0].geometry.lat;
                lng = data.results[0].geometry.lng
                
                console.log(lat, lng);
                updateMarker([lat, lng])
                
            })
            .catch(err => console.log(err))


        })
        .catch(err => {
            console.log(err)
            alert("Oops! something went wrong")
        })

}

getIpDetails();




searchBtn.addEventListener("click", e => {
    e.preventDefault();
    if(enteredIpAddress.value != " " && enteredIpAddress.value != null){
        return getIpDetails(enteredIpAddress.value)
    }else{
        alert("Please enter a valid IP address")
    }
})