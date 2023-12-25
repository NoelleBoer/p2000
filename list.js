function showSection(sectionId) {
  const sections = document.getElementsByClassName('section');
  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }
  document.getElementById(sectionId).style.display = 'block';

  const sectionNumber = sectionId.slice(-1);
  localStorage.setItem('selectedService', sectionNumber);
  const r = localStorage.getItem('selectedRegion');
  fetchData(r, sectionNumber, `liveFeed${sectionNumber}`);
}

// Keydown event handler
document.addEventListener('keydown', handleKeyPress);

// Geolocation setup
let userLatitude = 0;
let userLongitude = 0;
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  if (isDarkMode) {
    enableDarkMode();
  }
  darkModeToggle.addEventListener('click', toggleDarkMode);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(adjustUserLocation);
  }
});

// Functions for key press handling
function handleKeyPress(event) {
  switch (event.key) {
    case 'k':
      setRegion();
      break;
    case 'a':
      showSection('section5');
      break;
    case '1':
    case '2':
    case '3':
    case '4':
      showSection(`section${event.key}`);
      break;
    case 't':
      window.location.href = 'index.html';
      break;
    case 'm':
      toggleDarkMode();
      break;
    default:
      break;
  }
}

// Dark mode functionalities
function enableDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Lichte modus';
}

function disableDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', null);
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Donkere modus';
}

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

// Geolocation functionalities
function adjustUserLocation(position) {
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  const selectedService = localStorage.getItem('selectedService');
  const selectedRegion = localStorage.getItem('selectedRegion');
  fetchData(selectedRegion, selectedService, `liveFeed${selectedService}`);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => (angle * Math.PI) / 180;

  // The differences between the latitudes and longitudes
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula to calculate distance
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in kilometers

  return distance;
}

// Other utility functions
function setRegion() {
  const r = localStorage.getItem('selectedRegion');
  const d = localStorage.getItem('selectedService');
  localStorage.setItem('selectedRegion', r);
  localStorage.setItem('selectedService', d);
  window.location.href = 'map.html';
}

async function fetchData(r, d, containerId) {
  try {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    let apiUrl = `https://feeds.livep2000.nl/`;
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
      formattedDate = dateObj.toLocaleString();

      if (latitudeElement && longitudeElement) {
        if (userLatitude !== 0) {
          let distance = calculateDistance(parseFloat(latitudeElement.textContent), parseFloat(longitudeElement.textContent), parseFloat(userLatitude), parseFloat(userLongitude)).toFixed(2);
          latitude = latitudeElement.textContent || 'Latitude not available';
          longitude = longitudeElement.textContent || 'Longitude not available';

          formattedContent.push(`<div class="incident">
            <p class="title">${title}</p>
            <p class="description">${description}</p>
            <p class="coordinates">Hemelsbrede afstand: ${distance} km</p>
            <p class="date">Datum en tijd: ${formattedDate}</p>
          </div>`);
        } else {
          latitude = latitudeElement.textContent || 'Latitude not available';
          longitude = longitudeElement.textContent || 'Longitude not available';

          formattedContent.push(`<div class="incident">
            <p class="title">${title}</p>
            <p class="description">${description}</p>
            <p class="coordinates">Breedtegraad: ${latitude}, Lengtegraad: ${longitude}</p>
            <p class="date">Datum en tijd: ${formattedDate}</p>
          </div>`);
        }
      } else {
        formattedContent.push(`<div class="incident">
          <p class="title">${title}</p>
          <p class="description">${description}</p>
          <p class="date">Datum en tijd: ${formattedDate}</p>
        </div>`);
      }
    }

    // Display the formatted content in the respective section's div
    document.getElementById(containerId).innerHTML = formattedContent.join('');
  } catch (error) {
    console.error('Error fetching data:', error);
    // Display a message on the screen indicating the absence of data with chosen filters
    document.getElementById(containerId).innerHTML = '<p>Er is geen data beschikbaar met de gekozen filters.</p>';
  }
}

// Initial load
const d = parseInt(localStorage.getItem('selectedService'));
showSection(d === 1 || d === 2 || d === 3 || d === 4 ? `section${d}` : 'section5');
