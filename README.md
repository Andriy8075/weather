# Weather app

Node.js and Express weather application for laboratory work 4. The app uses HBS templates and gets weather data from OpenWeatherMap.

## Requirements

- Node.js 18 or newer
- npm
- OpenWeatherMap API key

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root. You can copy `.env.example` and replace the API key value:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
PORT=3000
```

You can obtain an API key from https://openweathermap.org/

## Launch

Start the app:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

Open the app in a browser:

```text
http://localhost:3000
```

Useful routes:

- `http://localhost:3000/weather/` - weather for your city.
- `http://localhost:3000/weather/Kyiv` - weather for a selected city.
- `http://localhost:3000/weather/Lviv` - another city example.
