let userLatitude = 0;
let userLongitude = 0;
let markers = []; // Initialize an array to store markers
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
let regionCoordinates = {
  0: [52.3676, 4.9041],
  1: [53.2194, 6.5665], // Groningen
  2: [53.1642, 5.7818], // Friesland (Fryslân)
  3: [52.8599, 6.6247], // Drenthe
  4: [52.4974, 6.2597], // IJsselland
  5: [52.2871, 6.7988], // Twente
  6: [52.2242, 5.9106], // Noord- en Oost-Gelderland
  7: [52.0570, 5.8854], // Gelderland-Midden
  8: [51.8708, 5.8534], // Gelderland-Zuid
  9: [52.0907, 5.1214], // Utrecht
  10: [52.6792, 4.7971], // Noord-Holland Noord
  11: [52.4726, 4.8494], // Zaanstreek-Waterland
  12: [52.4226, 4.6370], // Kennemerland
  13: [52.3676, 4.9041], // Amsterdam-Amstelland
  14: [52.2721, 5.1570], // Gooi en Vechtstreek
  15: [52.0524, 4.3168], // Haaglanden
  16: [52.1267, 4.4974], // Hollands Midden
  17: [51.9225, 4.4792], // Rotterdam-Rijnmond
  18: [51.8153, 4.6731], // Zuid-Holland Zuid
  19: [51.5142, 3.8497], // Zeeland
  20: [51.6373, 4.6031], // Midden- en West-Brabant
  21: [51.7292, 5.2970], // Brabant-Noord
  22: [51.4315, 5.4733], // Brabant-Zuidoost
  23: [51.4975, 6.1025], // Limburg-Noord
  24: [42.8772, 5.9220], // Zuid-Limburg
  25: [52.5281, 5.5215] // Flevoland
};
let regionZoom = {
  0: 8,
  1: 10, // Groningen
  2: 9, // Friesland (Fryslân)
  3: 9, // Drenthe
  4: 10, // IJsselland
  5: 11, // Twente
  6: 9, // Noord- en Oost-Gelderland
  7: 10, // Gelderland-Midden
  8: 10, // Gelderland-Zuid
  9: 10, // Utrecht
  10: 9, // Noord-Holland Noord
  11: 11, // Zaanstreek-Waterland
  12: 9, // Kennemerland
  13: 11, // Amsterdam-Amstelland
  14: 12, // Gooi en Vechtstreek
  15: 11, // Haaglanden
  16: 10, // Hollands Midden
  17: 11, // Rotterdam-Rijnmond
  18: 10, // Zuid-Holland Zuid
  19: 10, // Zeeland
  20: 10, // Midden- en West-Brabant
  21: 10, // Brabant-Noord
  22: 11, // Brabant-Zuidoost
  23: 9, // Limburg-Noord
  24: 8, // Zuid-Limburg
  25: 9 // Flevoland
};
var r = localStorage.getItem('selectedRegion');
var d = parseInt(localStorage.getItem('selectedService'));
let coordinates = regionCoordinates[parseInt(r)];
let zoomLevel = regionZoom[parseInt(r)];
let map = L.map('map').setView(coordinates, zoomLevel);; // Initialize map

// Check if dark mode is enabled in localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

function adjustUserLocation(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;
}

// Function to enable dark mode
function enableDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>  Lichte modus';
}

// Function to disable dark mode
function disableDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', null);
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Donkere modus';
}

//Code for darkmode toggle
document.addEventListener('DOMContentLoaded', function() {
  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    if (localStorage.getItem('darkMode') !== 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    window.location.reload();
  });
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'l') {//switch to list view
    setRegion();
  } else if (event.key === 'a') {
    showSection('section5'); // Show all notifications
  }else if (event.key === '1') {
    showSection('section1'); // d=1
  } else if (event.key === '2') {
    showSection('section2'); // d=2
  } else if (event.key === '3') {
    showSection('section3'); // d=3
  }else if (event.key === '4') {
    showSection('section4'); // d=4
  } else if (event.key === 't') { // go back
   window.location.href='index.html'
 } else if (event.key === 'm') {
     if (localStorage.getItem('darkMode') !== 'enabled') {
         enableDarkMode();
     } else {
         disableDarkMode();
     }
     window.location.reload();
 }
});

// Function to update markers on the map
function updateMarkers(newMarkers, all) {
 markers.forEach(marker => {
   map.removeLayer(marker); // Remove existing markers from the map
 });
 markers = []; // Clear the markers array

 // Add new markers to the map and markers array
 newMarkers.forEach(marker => {
   marker.addTo(map);
   markers.push(marker);
 });
}

//function to remember region when switching view
function setRegion() {
  var r = localStorage.getItem('selectedRegion');
  var d = localStorage.getItem('selectedService');
  localStorage.setItem('selectedRegion', r);
  localStorage.setItem('selectedService', d);
  window.location.href = 'list.html';
}

function displayMarkersOnMap(departmentNumber) {
  markers.forEach(marker => {
  const markerDepartment = marker.options.department; // Access department information from marker options

  // Check if the marker belongs to the specified department
  if (markerDepartment === departmentNumber || parseInt(departmentNumber) == 5) {
    marker.addTo(map);
  } else {
    map.removeLayer(marker); // Remove markers not belonging to the specified department
  }
});
}

function addUserMarker(){
  let userMarker;

  if (userLatitude !== 0 && userLongitude !== 0) {
    const userIcon = L.icon({
      iconUrl: 'userMarker.png',
      iconSize: [42, 42], // Adjust the size as needed
    });

    userMarker = L.marker([userLatitude, userLongitude], { icon: userIcon }).addTo(map);
    userMarker.bindPopup('Uw locatie'); // You can set a popup for the user's marker
  }
}

// Function to add markers to the temporary array
function addMarker(latitude, longitude, title, departmentNumber, timestamp, formattedContent, newMarkers, all) {
  let markerIcon;

  switch (parseInt(departmentNumber)) {
    case 1: // Fire department
      markerIcon = L.icon({
        iconUrl: 'fireMarker.png',
        iconSize: [42, 42],
      });
      break;
    case 2: // Ambulance department
      markerIcon = L.icon({
        iconUrl: 'ambulanceMarker.png',
        iconSize: [42, 42],
      });
      break;
    case 3: // Police department
      markerIcon = L.icon({
        iconUrl: 'policeMarker.png',
        iconSize: [42, 42],
      });
      break;
    case 4: // KNRM department
      markerIcon = L.icon({
        iconUrl: 'knrmMarker.png',
        iconSize: [42, 42],
      });
      break;
    default: // Default icon for other departments
      markerIcon = L.icon({
        iconUrl: 'defaultMarker.png',
        iconSize: [42, 42],
      });
      break;
  }
  const formattedTimestamp = new Date(timestamp).toLocaleString(); // Format timestamp
  const markerContent = `<div>
    <p>${title}</p>
    <p>Datum en tijd: ${formattedTimestamp}</p>
    </div>`;

  const newMarker = L.marker([latitude, longitude], { department: departmentNumber, icon: markerIcon })
    .bindPopup(markerContent); // Set marker's popup content

  if (all) {
    markers.push(newMarker);
  } else {
    newMarkers.push(newMarker);
  }
}

async function fetchDataByDepartment(r, d, containerId, all) {
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  let apiUrl = `https://feeds.livep2000.nl/`;
  const newMarkers = []; // Temporary array to store new markers

  if (r != 0) {
    apiUrl += `?r=${r}`;
  }
  if (d != 5 && r!=0) {
    apiUrl += `&d=${d}`;
  }
  if (d != 5 && r==0) {
    apiUrl += `?d=${d}`;
  }

  const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
  const data = await response.json(); // Get JSON response from proxy

  // Parse the fetched data from the proxy response
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');

  // Extract specific elements or attributes from the XML
  const incidents = xmlDoc.getElementsByTagName('item');
  const formattedContent = [];

  if (localStorage.getItem('darkMode') === 'enabled') {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);
  } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  }

  if (userLatitude!==0){
    addUserMarker();
  }
  for (let i = 0; i < incidents.length; i++) {
    const incident = incidents[i];
    const title = incident.querySelector('title')?.textContent || 'Title not available';
    const description = incident.querySelector('description')?.textContent || 'Description not available';
    const latitudeElement = incident.getElementsByTagNameNS('*', 'lat')[0];
    const longitudeElement = incident.getElementsByTagNameNS('*', 'long')[0];
    const pubDate = incident.querySelector('pubDate')?.textContent || 'Date not available';

    let latitude = 'Latitude not available';
    let longitude = 'Longitude not available';
    let formattedDate = 'Date not available';

    // Extract and format date and time
      const dateObj = new Date(pubDate);
      formattedDate = `${('0' + dateObj.getDate()).slice(-2)}/${('0' + (dateObj.getMonth() + 1)).slice(-2)}/${dateObj.getFullYear()} ${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}`;

    if (latitudeElement && longitudeElement) {
      latitude = latitudeElement.textContent || 'Latitude not available';
      longitude = longitudeElement.textContent || 'Longitude not available';

      formattedContent.push(`<div class="incident">
        <p class="title">${title}</p>
        <p class="date">Datum en tijd: ${formattedDate}</p>
      </div>`);
      addMarker(parseFloat(latitude), parseFloat(longitude), title, d, formattedDate, formattedContent[i], newMarkers, all);
    }
  }
  // Call updateMarkers to add all new markers to the map
  // After the loop, call the function to display markers for the current department on the map
  if(!all){
    updateMarkers(newMarkers);
    displayMarkersOnMap(d);
  } else {
    updateMarkers(markers);
  }
}

async function showSection(sectionId) {
  const sections = document.getElementsByClassName('section');
  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }
  document.getElementById(sectionId).style.display = 'block';
  const sectionNumber = sectionId.slice(-1);
  var r = localStorage.getItem('selectedRegion');
  localStorage.setItem('selectedService', sectionNumber);
  if (parseInt(sectionNumber) == 5){
    fetchDataByDepartment(r, 1, `liveFeed${5}`, true);
    fetchDataByDepartment(r, 2, `liveFeed${5}`, true);
    fetchDataByDepartment(r, 3, `liveFeed${5}`, true);
    fetchDataByDepartment(r, 4, `liveFeed${5}`, true);
    displayMarkersOnMap(sectionNumber);
  } else {
    fetchDataByDepartment(r, sectionNumber, `liveFeed${sectionNumber}`, false);
    displayMarkersOnMap(sectionNumber);
  }
}

//Initial load
if (d === 1) {
  showSection('section1');
} else if (d === 2) {
  showSection('section2');
} else if (d === 3) {
  showSection('section3');
} else if (d === 4) {
  showSection('section4');
} else {
  showSection('section5')
}

if (localStorage.getItem('darkMode') === 'enabled') {
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map);
} else {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);
}

// Set initial mode based on user's preference
if (isDarkMode) {
  enableDarkMode();
}

// Refresh the page every 60 seconds (60000 milliseconds)
setInterval(() => {
window.location.reload();
}, 60000);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(adjustUserLocation);
}
