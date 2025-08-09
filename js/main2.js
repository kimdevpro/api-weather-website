// Mock weather data in the same shape as Weatherstack + astro
const allMockWeather = [
  {
    location: {
      name: 'New York',
      country: 'United States',
      timezone_id: 'America/New_York',
    },
    current: {
      observation_time: '10:00 AM',
      weather_descriptions: ['Partly cloudy'],
      temperature: 22,
      humidity: 60,
      wind_speed: 14,
      feelslike: 21,
      astro: {
        sunrise: '6:02 AM',
        sunset: '8:10 PM',
      },
    },
  },
  {
    location: {
      name: 'London',
      country: 'United Kingdom',
      timezone_id: 'Europe/London',
    },
    current: {
      observation_time: '3:00 PM',
      weather_descriptions: ['Light rain'],
      temperature: 18,
      humidity: 72,
      wind_speed: 9,
      feelslike: 17,
      astro: {
        sunrise: '5:21 AM',
        sunset: '9:02 PM',
      },
    },
  },
  {
    location: {
      name: 'Tokyo',
      country: 'Japan',
      timezone_id: 'Asia/Tokyo',
    },
    current: {
      observation_time: '11:00 PM',
      weather_descriptions: ['Clear'],
      temperature: 26,
      humidity: 55,
      wind_speed: 7,
      feelslike: 27,
      astro: {
        sunrise: '4:45 AM',
        sunset: '6:58 PM',
      },
    },
  },
  {
    location: {
      name: 'Sydney',
      country: 'Australia',
      timezone_id: 'Australia/Sydney',
    },
    current: {
      observation_time: '12:00 AM',
      weather_descriptions: ['Cloudy'],
      temperature: 15,
      humidity: 80,
      wind_speed: 12,
      feelslike: 14,
      astro: {
        sunrise: '6:45 AM',
        sunset: '5:12 PM',
      },
    },
  },
  {
    location: {
      name: 'Paris',
      country: 'France',
      timezone_id: 'Europe/Paris',
    },
    current: {
      observation_time: '4:00 PM',
      weather_descriptions: ['Sunny'],
      temperature: 25,
      humidity: 50,
      wind_speed: 10,
      feelslike: 25,
      astro: {
        sunrise: '6:18 AM',
        sunset: '9:25 PM',
      },
    },
  },
  {
    location: {
      name: 'Bangkok',
      country: 'Thailand',
      timezone_id: 'Asia/Bangkok',
    },
    current: {
      observation_time: '10:00 PM',
      weather_descriptions: ['Humid and partly cloudy'],
      temperature: 30,
      humidity: 78,
      wind_speed: 8,
      feelslike: 36,
      astro: {
        sunrise: '6:05 AM',
        sunset: '6:47 PM',
      },
    },
  },
];

initializeApp(allMockWeather);

const root = document.documentElement;
const theme = 'theme';
const dataTheme = 'data-theme';
const themeTab = '.theme-tab';
const switcherBtn = '.switcher-btn';
const dark = 'dark';
const light = 'light';
const open = 'open';
const active = 'active';
const isVisible = 'is-visible';



// functions for favorites and local storage
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// create weather cards based on data from api fetch
function getTimezoneAbbreviation(timezoneId) {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const tzPart = parts.find((part) => part.type === 'timeZoneName');

  return tzPart ? tzPart.value : '';
}

const weatherData = {
  location: `${mockWeatherData.location.name}, ${mockWeatherData.location.region}`,
  time: mockWeatherData.current.observation_time,
  description: mockWeatherData.current.weather_descriptions[0],
  temperature: mockWeatherData.current.temperature,
  humidity: mockWeatherData.current.humidity,
  windSpeed: mockWeatherData.current.wind_speed,
  feelsLike: mockWeatherData.current.feelslike,
  sunrise: mockWeatherData.current.astro.sunrise,
  sunset: mockWeatherData.current.astro.sunset,
  timeZone: getTimezoneAbbreviation(mockWeatherData.location.timezone_id),
};

const locationContainer = document.getElementById('locations-container');

locationContainer.innerHTML = `
  <div class="weather-card">
    <i class="fa-regular fa-heart favorite-icon" title="Add to favorites"></i>
    <div class="weather-header">
      <div class="location">${weatherData.location}</div>
      <div class="time">As of ${weatherData.time} ${weatherData.timeZone}</div>
    </div>
    <div class="weather-main">
      <div class="temperature">${weatherData.temperature}<sup>°</sup></div>
      <div class="description">${weatherData.description}</div>
    </div>
    <div class="weather-details">
      <div class="feels-like">feels like: ${weatherData.feelsLike}<sup>°</sup></div>
      <div class="sunrise">sunrise: ${weatherData.sunrise}</div>
      <div class="sunrise">sunset: ${weatherData.sunset}</div>
      <div class="humidity">humidity: ${weatherData.humidity}%</div>
    </div>
  </div>
`;

const card = document.querySelector('.weather-card');
const icon = card.querySelector('.favorite-icon');
const locationName = card.querySelector('.location').textContent;
const favorites = getFavorites();

if (favorites.includes(locationName)) {
  icon.classList.remove('fa-regular');
  icon.classList.add('fa-solid', 'active');
  document.getElementById('favorites-container').appendChild(card);
}

// favorite icon code
document.querySelector('.favorite-icon').addEventListener('click', function () {
  const icon = this;
  const card = icon.closest('.weather-card');
  const city = card.querySelector('.location').textContent;
  let favorites = getFavorites();

  if (icon.classList.contains('fa-solid')) {
    // Unfavorite
    icon.classList.remove('fa-solid', 'active');
    icon.classList.add('fa-regular');
    document.getElementById('locations-container').appendChild(card);
    favorites = favorites.filter((item) => item !== city);
  } else {
    // Favorite
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid', 'active');
    document.getElementById('favorites-container').appendChild(card);
    if (!favorites.includes(city)) {
      favorites.push(city);
    }
  }
  saveFavorites(favorites);
});
