# Neighborhood Map

A single-page application featuring a map of any neighborhood with some additional information related to the neighborhood. 

## Getting Started

### Pre-requisites

A device with any web browser with JavaScript enabled.

### Running the App

There is no need to install anything. To run the project simply open the **index.html** in any web browser. This app uses **[Google Maps API][4]** to show a map of your neighborhood. When you open the app, a map will laod on screen and a pop-up will be shown saying that the app wants to **Know your Location**. You can select to either accpet or decline that. If you accept it then app will use HTML5 Geolocation to determine your location for setting the map to your neighborhood and if you choose to decline then app will use **[Ipinfo API][1]** to get your location and set the map center to that neighborhood. In case of failure the map center is set to a default point.

The app then uses **[Apixu: Weather API][2]** for getting the weather data at the user's location and uses **[Foursquare API][3]** for getting Points of Interests(POIs) in the neighborhood of the user. All POIs are shown on the map in the form of markers and the location of the user is shown with a marker which keeps changing its color. By default a menu containing the POIs data, weather data and an input field for filtering the data is hidden. For seeing the menu the hamburger button at the top left of the app page needs to be clicked. User can select any POI and get more information on them in the form of infowindow which pops up on the map marker location of that POI. Users can filter the list of markers by inputing keywords to look for in the input box and hitting **Filter button**. If you wish to change the neighborhood then the *Self Location Marker* can be dragged to a new neighborhood and the weather and POIs data gets updated automatically. **[Foursquare API][3]** doesn't have POIs data for every neighborhood, so if a text with *No Data Found!!* pops up then you are in such neighborhood. Try changing the neighborhood by dragging the *Self Location Marker*.

## Acknowledgments
This app would not have been completed without data and help from following:
 * **[Ipinfo API][1]**
 * **[Apixu: Weather API][2]**
 * **[Foursquare API][3]**
 * **[Google Maps API][4]**
 * Map Style taken from Snazzymaps- **["Shades of Grey"][5]** by *Adam Krogh*
For Viewing this data in app, click the small "i" button at the top right of the screen.

[1]: https://ipinfo.io/developers
[2]: https://www.apixu.com/api.aspx
[3]: https://developer.foursquare.com
[4]: https://developers.google.com/maps/
[5]: https://snazzymaps.com/style/38/shades-of-grey