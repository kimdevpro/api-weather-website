export const mockWeatherData =  {
    request: {
        type: "City",
        query: "New York, United States of America",
        language: "en",
        unit: "m"
    },
    location: {
        name: "New York",
        country: "United States of America",
        region: "New York",
        lat: "40.714",
        lon: "-74.006",
        timezone_id: "America/New_York",
        localtime: "2025-08-06 00:30",
        localtime_epoch: 1754440200,
        utc_offset: "-4.0"
    },
    current: {
        observation_time: "04:30 AM",
        temperature: 23,
        weather_code: 143,
        weather_icons: [
            "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0006_mist.png"
        ],
        weather_descriptions: [
            "Mist"
        ],
        astro: {
            sunrise: "05:58 AM",
            sunset: "08:05 PM",
            moonrise: "06:49 PM",
            moonset: "02:37 AM",
            moon_phase: "Waxing Gibbous",
            moon_illumination: 88
        },
        air_quality: {
            co: "567.95",
            no2: "63.085",
            o3: "43",
            so2: "13.135",
            pm2_5: "43.105",
            pm10: "44.4",
            "us-epa-index": "3",
            "gb-defra-index": "3"
        },
        wind_speed: 9,
        wind_degree: 128,
        wind_dir: "SE",
        pressure: 1028,
        precip: 0,
        humidity: 74,
        cloudcover: 0,
        feelslike: 26,
        uv_index: 0,
        visibility: 13,
        is_day: "no"
    }
};
