// ===== Mock weather data =====
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

// ===== Boot app =====
initializeApp(allMockWeather);

// ===== Core =====
function initializeApp(weatherData) {
  renderAllCards(weatherData);
  updateAllStatsAndSorts();
  setupSortButtonListeners();
  setupTabs();
}

function setupTabs() {
  const buttons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-content');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach((p) => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');

      updateAllStatsAndSorts();
    });
  });
}

function renderAllCards(dataArray) {
  clearWeatherContainers();
  const favorites = getFavorites();

  dataArray.forEach((data) => {
    const formatted = formatWeatherData(data);
    const isFavorite = favorites.includes(formatted.location);
    const containerId = isFavorite
      ? 'favorites-container'
      : 'locations-container';
    const container = document.getElementById(containerId);

    const card = createWeatherCard(formatted, isFavorite);
    container.appendChild(card);
  });
}

function formatWeatherData(data) {
  return {
    location: `${data.location.name}, ${data.location.country}`,
    time: data.current.observation_time,
    description: data.current.weather_descriptions[0],
    temperature: data.current.temperature,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_speed,
    feelsLike: data.current.feelslike,
    sunrise: data.current.astro.sunrise,
    sunset: data.current.astro.sunset,
    timeZone: getTimezoneAbbreviation(data.location.timezone_id),
  };
}

function createWeatherCard(data, isFavorite = false) {
  const card = document.createElement('div');
  card.className = 'weather-card';
  card.dataset.location = data.location;

  const heartClasses = isFavorite
    ? 'fa-solid fa-heart is-favorite'
    : 'fa-regular fa-heart';

  card.innerHTML = `
    <i class="favorite-icon fa-heart ${heartClasses}"></i>
    <div class="weather-header">
      <div class="location">${data.location}</div>
      <div class="time">${data.time} (${data.timeZone})</div>
    </div>
    <div class="temp-desc">
      <div class="temperature">
        <span class="value">${data.temperature}</span>
        <span class="unit">°</span>
      </div>
      <div class="description">${data.description}</div>
    </div>
    <div class="weather-footer">
      <div class="details">
        <span>Humidity: ${data.humidity}%</span>
        <span>Wind: ${data.windSpeed} km/h</span>
        <span>Feels Like: ${data.feelsLike}&#8451;</span>
      </div>
      <div class="sun">
        <span>Sunrise: ${data.sunrise}</span>
        <span>Sunset: ${data.sunset}</span>
      </div>
    </div>
  `;

  const icon = card.querySelector('.favorite-icon');
  icon.addEventListener('click', () => {
    const loc = card.dataset.location;
    const nowFav = toggleFavorite(loc);
    icon.classList.toggle('fa-solid', nowFav);
    icon.classList.toggle('fa-regular', !nowFav);
    icon.classList.toggle('is-favorite', nowFav);

    const targetContainerId = nowFav
      ? 'favorites-container'
      : 'locations-container';
    document.getElementById(targetContainerId).appendChild(card);
    updateAllStatsAndSorts();
  });

  return card;
}

function updateAllStatsAndSorts() {
  ['locations', 'favorites'].forEach((tab) => {
    const container = document.getElementById(`${tab}-container`);
    const totalEl = document.getElementById(`${tab}-totals`);

    const cards = Array.from(container.querySelectorAll('.weather-card'));
    if (cards.length === 0) {
      totalEl.innerHTML = `<div class="totals-placeholder">No data to summarize yet.</div>`;
      return;
    }

    const total = calculateTotalTemperature(cards);
    totalEl.innerHTML = `Total Temp: ${total}&#8451;, Avg: ${(
      total / cards.length
    ).toFixed(1)}&#8451;`;

    const activeSortBtn = document.querySelector(
      `.sort-button.active[data-tab="${tab}-tab"]`
    );
    const isAZ = activeSortBtn?.textContent.includes('A-Z');
    if (activeSortBtn) sortCards(container, isAZ);
  });
}

function calculateTotalTemperature(cards) {
  return cards.reduce((sum, card) => {
    const temp = parseFloat(
      card.querySelector('.temperature')?.textContent || 0
    );
    return sum + (isNaN(temp) ? 0 : temp);
  }, 0);
}

function sortCards(container, ascending = true) {
  const cards = Array.from(container.querySelectorAll('.weather-card'));
  cards.sort((a, b) => {
    const nameA = a.querySelector('.location').textContent.trim().toUpperCase();
    const nameB = b.querySelector('.location').textContent.trim().toUpperCase();
    return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  cards.forEach((card) => container.appendChild(card));
}

function setupSortButtonListeners() {
  document.querySelectorAll('.sort-button').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      const container = document.getElementById(
        tab === 'locations-tab' ? 'locations-container' : 'favorites-container'
      );

      document
        .querySelectorAll(`.sort-button[data-tab="${tab}"]`)
        .forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const isAZ = button.textContent.includes('A-Z');
      sortCards(container, isAZ);
      updateAllStatsAndSorts();
    });
  });
}

function clearWeatherContainers() {
  document.getElementById('locations-container').innerHTML = '';
  document.getElementById('favorites-container').innerHTML = '';
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(list) {
  localStorage.setItem('favorites', JSON.stringify(list));
}

function toggleFavorite(location) {
  const list = getFavorites();
  const idx = list.indexOf(location);
  if (idx === -1) {
    list.push(location);
    saveFavorites(list);
    return true;
  } else {
    list.splice(idx, 1);
    saveFavorites(list);
    return false;
  }
}

function getTimezoneAbbreviation(timezoneId) {
  const date = new Date();
  return date
    .toLocaleTimeString('en-us', {
      timeZone: timezoneId,
      timeZoneName: 'short',
    })
    .split(' ')[2];
}
