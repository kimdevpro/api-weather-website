import { mockWeatherData } from './mockWeatherData.js';

const apiUrl = 'http://api.weatherstack.com/forecast?access_key=4482246f817f4420e56501e4cbc60616&query=New York'

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

// Theme Switcher
const toggleTheme = document.querySelector(themeTab);
const switcher = document.querySelectorAll(switcherBtn);
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    root.setAttribute(dataTheme, currentTheme);
    switcher.forEach(btn => btn.classList.remove(active));
    switcher[1].classList.add(active);
} else {
    root.setAttribute(dataTheme, light);
    switcher[0].classList.add(active);
}

toggleTheme.addEventListener('click', function () {
    const tab = this.closest('.theme-panel');
    tab.classList.toggle(open);
});

switcher.forEach(button => {
    button.addEventListener('click', function () {
        const selected = this.dataset.toggle;
        switcher.forEach(btn => btn.classList.remove(active));
        this.classList.add(active);
        root.setAttribute(dataTheme, selected);
        localStorage.setItem(theme, selected);
    });
});

// Tab Switching Logic
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons and tabs
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked button and corresponding tab
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// functions for favorites and local storage
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Sort Buttons
// const sortAscButton = document.getElementById('sort-asc');
// const sortDescButton = document.getElementById('sort-desc');

// sortAscButton.addEventListener('click', () => {
//   console.log('Sort ascending (A–Z) button clicked');
// });

// sortDescButton.addEventListener('click', () => {
//   console.log('Sort descending (Z–A) button clicked');
// });

// async function fetchData() {
//   try {
//     const response = await fetch(apiUrl);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Fetched Data:", data);
//   } catch (error) {
//     console.error("Fetch failed:", error);
//   }
// }


const popularCities = [
  "Tokyo, Japan",
  "Delhi, India",
  "Shanghai, China",
  "Dhaka, Bangladesh",
  "Cairo, Egypt",
  "São Paulo, Brazil",
  "Mexico City, Mexico",
  "Beijing, China",
  "Mumbai, India",
  "Osaka, Japan",
  "Chongqing, China",
  "Karachi, Pakistan",
  "Lagos, Nigeria",
  "Kinshasa, DRC",
  "Bangkok, Thailand",
  "Seoul, South Korea",
  "Buenos Aires, Argentina",
  "Istanbul, Turkey",
  "London, United Kingdom",
  "Paris, France",
  "New York, USA",
  "Los Angeles, USA",
  "Hong Kong",
  "Singapore",
  "Lima, Peru",
  "Ho Chi Minh City, Vietnam",
  "Tehran, Iran",
  "Sydney, Australia",
  "Madrid, Spain",
  "Berlin, Germany"
];

// create weather cards based on data from api fetch
function getTimezoneAbbreviation(timezoneId) {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const tzPart = parts.find(part => part.type === 'timeZoneName');

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

const locationContainer = document.getElementById("locations-container");

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
        favorites = favorites.filter(item => item !== city);
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




