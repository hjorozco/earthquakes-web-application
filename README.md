### Earthquakes website.
***About the website.***

The purpose of this website is to let visitors get information about earthquakes in the whole world, that happened on the last 30 days. The visitor can filter the information by defining a minimum and maximum magnitude. The earthquakes are displayed as a list and the visitor can click on a particular earthquake to see its details and a map showing the location.

The *About* section contains information about the data that the USGS provides and a little glossary.

The *Comments* section lets the visitor send comments about the website.

Visit the Earthquakes website [here](https://hjorozco.github.io/earthquakes-website).

***About the code.***
- The data displayed comes from the [USGS Earthquake Catalog API](https://earthquake.usgs.gov/fdsnws/event/1/), an implementation of the [FDSN Event Web Service Specification](http://www.fdsn.org/webservices/FDSN-WS-Specifications-1.0.pdf), which allows custom searches for earthquake information using a variety of parameters.
- The maps are displayed using [Leaflet](https://leafletjs.com/), an open-source JavaScript library
for creating interactive maps.
- Leaflet uses data from [OpenStreetMap](https://www.openstreetmap.org/) which provides free open map data.
- The *Contact* form uses [SmtpJS.com](https://smtpjs.com/), a license free script written in JavaScript that uses the SMTP protocol to send emails.