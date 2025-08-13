const cities = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Paris',
  'Bangkok',
  'Los Angeles',
  'Chicago',
  'Toronto',
  'Vancouver',
  'Mexico City',
  'São Paulo',
  'Buenos Aires',
  'Cape Town',
  'Cairo',
  'Dubai',
  'Mumbai',
  'Delhi',
  'Beijing',
  'Shanghai',
  'Seoul',
  'Hong Kong',
  'Singapore',
  'Jakarta',
  'Kuala Lumpur',
  'Moscow',
  'Istanbul',
  'Rome',
  'Barcelona',
  'Berlin',
];

const apiKey = 'a5e61be07633478e9b703149251308';

// ===== Core =====
function initialize(weatherData) {
  renderAllCards(weatherData);
  updateAllStatsAndSorts();
  setupSortButtonListeners();
  setupTabs();
}

function renderLoadingCards(count = 6) {
  clearWeatherContainers();
  const container = document.getElementById('locations-container');

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'weather-card loading';
    card.innerHTML = `
      <div class="weather-header">
        <div class="location">Loading...</div>
        <div class="time">--</div>
      </div>
      <div class="temp-desc">
        <div class="temperature"><span class="value">--</span></div>
        <div class="description">Fetching weather...</div>
      </div>
      <div class="weather-footer">
        <div class="left"><div>Humidity: --%</div><div>Wind: -- mph</div></div>
        <div class="right"><div>Feels Like: --° F</div><div>Heat Index: --° F</div></div>
      </div>
    `;
    container.appendChild(card);
  }
}

async function loadAllCityWeather() {
  renderLoadingCards();
  const weatherData = [];

  for (const city of cities) {
    try {
      const data = await getOneCityWeather(city);
      weatherData.push(data);
    } catch (err) {
      console.error(`Error loading weather for ${city}:`, err);
    }
  }
  initialize(weatherData);
}

async function getOneCityWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    city
  )}&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WeatherAPI failed for ${city}: ${res.status}`);
  return res.json(); // return the full JSON
}

loadAllCityWeather();

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
  const loc = data?.location || {};
  const cur = data?.current || {};

  return {
    location: `${loc.name}, ${loc.country}`,
    time: loc.localtime,
    description: cur.condition?.text,
    temperature: cur.temp_f,
    humidity: cur.humidity,
    windSpeed: cur.wind_mph,
    feelsLike: cur.feelslike_f,
    heatIndex: cur.heatindex_f,
    timeZone: getTimezoneAbbreviation(loc.tz_id),
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
        <span class="value">${data.temperature}° F</span>
      </div>
      <div class="description">${data.description}</div>
    </div>
    <div class="weather-footer">
  <div class="left">
    <div>Humidity: ${data.humidity}%</div>
    <div>Wind: ${data.windSpeed} mph</div>
  </div>
  <div class="right">
    <div>Feels Like: ${data.feelsLike}° F</div>
    <div>Heat Index: ${data.heatIndex}° F</div>
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
      const message =
        tab === 'locations'
          ? 'No data to summarize yet. <br> Check your Favorites tab.'
          : 'You have no favorites yet.  <br> Pick some from Locations tab.';
      totalEl.innerHTML = `<div class="totals-placeholder">${message}</div>`;
      return;
    }

    const total = calculateTotalTemperature(cards);
    totalEl.innerHTML = `Total Temp: ${total.toFixed(1)}° F, Avg: ${(
      total / cards.length
    ).toFixed(1)}° F`;

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
