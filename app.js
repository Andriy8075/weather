const path = require("path");
const express = require("express");
const hbs = require("hbs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const AUTHOR_CITY = "Kyiv";

const cities = [
  { name: "Kyiv", title: "Kyiv" },
  { name: "Lviv", title: "Lviv" },
  { name: "Odesa", title: "Odesa" },
  { name: "Kharkiv", title: "Kharkiv" },
  { name: "Zhytomyr", title: "Zhytomyr" }
];

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(express.static(path.join(__dirname, "public")));

function buildMenu(currentCity) {
  return cities.map((city) => ({
    ...city,
    isActive: city.name.toLowerCase() === currentCity.toLowerCase()
  }));
}

async function getWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("Не задано OPENWEATHER_API_KEY у файлі .env.");
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "uk");

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося отримати дані погоди.");
  }

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    wind: data.wind.speed,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  };
}

async function renderWeather(req, res) {
  const city = req.params.city || AUTHOR_CITY;
  const viewData = {
    title: `Погода: ${city}`,
    authorCity: AUTHOR_CITY,
    currentCity: city,
    cities: buildMenu(city)
  };

  try {
    viewData.weather = await getWeather(city);
  } catch (error) {
    viewData.error = error.message;
  }

  res.render("weather", viewData);
}

app.get("/", (req, res) => {
  res.redirect("/weather/");
});

app.get("/weather/", renderWeather);
app.get("/weather/:city", renderWeather);

app.use((req, res) => {
  res.status(404).render("weather", {
    title: "404 Not Found",
    authorCity: AUTHOR_CITY,
    currentCity: AUTHOR_CITY,
    cities: buildMenu(AUTHOR_CITY),
    error: "404 Not Found. Такого маршруту не існує."
  });
});

app.listen(PORT, () => {
  console.log(`Weather app is running at http://localhost:${PORT}`);
});
