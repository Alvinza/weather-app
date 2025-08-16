import React, { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState(""); // Store user input (city name)
  const [weather, setWeather] = useState(null); // Store fetched weather data
  const [loading, setLoading] = useState(false); // Loading state for fetch
  const [error, setError] = useState(""); // Store error messages

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Determine background gradient based on weather condition
  const getBackground = () => {
    if (!weather || !weather.weather) {
      return "from-cyan-300 to-blue-600"; // Default gradient
    }

    const main = weather.weather[0].main.toLowerCase();

    switch (main) {
      case "clear":
        return "from-yellow-300 to-blue-500"; // Sunny
      case "clouds":
        return "from-gray-400 to-blue-500"; // Cloudy
      case "rain":
      case "drizzle":
      case "thunderstorm":
        return "from-gray-600 to-blue-800"; // Rainy
      case "snow":
        return "from-blue-200 to-white"; // Snowy
      case "mist":
      case "fog":
      case "haze":
        return "from-gray-400 to-gray-600"; // Foggy
      default:
        return "from-cyan-300 to-blue-600"; // Default
    }
  };

  // Fetch weather data from API
  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true); 
    setError(""); 
    setWeather(null); 

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (res.ok) {
        setWeather(data); 
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch weather. Please try again.");
    } finally {
      setLoading(false); 
      setCity("");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-r transition-all duration-700 ${getBackground()}`}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold mb-5">Weather App</h2>

        {/* Input and button */}
        <div className="flex mb-5 gap-3">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={getWeather}
            className="bg-cyan-500 text-white px-4 rounded-md hover:bg-cyan-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Weather results */}
        {weather && weather.main && (
          <div>
            <h3 className="text-xl font-medium">
              {weather.name}, {weather.sys.country}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto my-2 w-20 h-20"
            />
            <p className="text-3xl font-bold">{weather.main.temp}°C</p>
            <p className="capitalize">{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
