function _indexUppercase(unformatted) {
    return unformatted.split(" ").map(w => {
        return w[0].toUpperCase() + w.substring(1)
    }).join(" ")
}

function getCurrentLatLog(callback) {
    return navigator.geolocation.getCurrentPosition((position) => {
        callback(position.coords);
    });
}
function updateWeather(weatherId) {
    unit = "cel"
    appId = "fd2c04ed7f9802656bd2cc23bddc7ad9"
    apiUrl = "http://api.openweathermap.org/data/2.5/weather"
    getCurrentLatLog((coords) => {
        latitude = coords.latitude;
        longitude = coords.longitude;
        fetchUrl = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${appId}&units=metric`
        fetch(fetchUrl)
            .then(response => {return response.json()})
            .then(jsonData => {
                temp = Math.floor(jsonData["main"]["temp"])
                locationName = jsonData["sys"]["country"]
                weatherType = jsonData["weather"][0]["main"]

                temp = !unit.includes("cel") ?
                            getFahrenheit(temp) + "&deg;F" : temp + "&deg;C"
                weatherText = `${locationName}, ${temp}, ${_indexUppercase(weatherType)}` 
                document.getElementById(weatherId).innerHTML = weatherText
            })
        });
}