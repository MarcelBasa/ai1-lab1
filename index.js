const pogodaButton = document.querySelector("#pogodaButton");
const adresInput = document.querySelector("#adresInput");

let req = new XMLHttpRequest();

pogodaButton.addEventListener("click", async () => {
    const adres = adresInput.value;

    req.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${adres}&appid=47f3f381e59270750978135dec54446d&units=metric`, true);
    req.addEventListener("load", function(event) {
        console.log("XMLHttpRequest: " + req.responseText);

        const weatherData = JSON.parse(req.responseText);
        const pogodaDiv = document.querySelector("#pogoda");
        pogodaDiv.innerHTML = "";

        const todayDiv = document.createElement("div");
        todayDiv.classList.add("today-weather");

        const h2 = document.createElement("h2");
        h2.textContent = "Today's Weather";

        const temp = document.createElement("p");
        temp.textContent = `Temperature: ${weatherData.main.temp}°C`;

        const description = document.createElement("p");
        description.textContent = `Description: ${weatherData.weather[0].description}`;

        todayDiv.appendChild(h2);
        todayDiv.appendChild(temp);
        todayDiv.appendChild(description);

        pogodaDiv.appendChild(todayDiv);
    });
    req.send(null);

    await getForecast(adres);
});

async function getForecast(adres) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${adres}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log("fetch: ", json);

        const pogodaDiv = document.querySelector("#pogoda");

        const forecastHeader = document.createElement("h2");
        forecastHeader.textContent = "5-Day Forecast";
        pogodaDiv.appendChild(forecastHeader);

        for (let i = 0; i < 5; i++) {
            const forecastData = json.list[i * 8]; 

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("forecast-day");

            const date = new Date(forecastData.dt * 1000);
            const dateElement = document.createElement("h3");
            dateElement.textContent = date.toDateString();

            const temp = document.createElement("p");
            temp.textContent = `Temperature: ${forecastData.main.temp}°C`;

            const description = document.createElement("p");
            description.textContent = `Description: ${forecastData.weather[0].description}`;

            dayDiv.appendChild(dateElement);
            dayDiv.appendChild(temp);
            dayDiv.appendChild(description);

            // Append each day's forecast div to the main pogoda div
            pogodaDiv.appendChild(dayDiv);
        }
    } catch (error) {
        console.error(error.message);
    }
}
