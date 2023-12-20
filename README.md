Alarmeringen Nederland

Alarmeringen Nederland is an application that displays emergency service notifications across regions in the Netherlands. This application integrates with live feeds to show real-time alerts for fire departments, ambulance services, police, and KNRM (Koninklijke Nederlandse Redding Maatschappij - Royal Netherlands Sea Rescue Institution).

Features

Live Feeds: Real-time updates from emergency service feeds.
Department-Specific Notifications: Filter notifications by emergency service departments.
Map View: Visual representation of incidents on a map.
Region Selection: Choose a specific region to view alerts.

Installation

Clone the repository:

bash

git clone https://github.com/NoelleBoer/p2000.git
cd p2000
node server.js

Open index.html in your preferred web browser.

run `npm install` to install dependencies for the javascript code

Usage

Navigation:
    Use the navigation buttons to switch between different emergency service departments or view all notifications.
    The "Verander uw locatie" button allows users to change their location.
    "Lijst" button redirects users to a list view.
    "Kaart" button redirects users to a map view

Map Display:
    The map displays incident locations.
    Clicking on the markers provides information about each incident.

Dependencies

    Leaflet: Mapping library for displaying incidents geographically.
    Font Awesome: Icon set for UI elements.

Contributing

Contributions are welcome! If you'd like to enhance this project or fix issues, please fork the repository and submit a pull request.
