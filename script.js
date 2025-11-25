document.addEventListener('DOMContentLoaded', async () => {
    // Pobierz konfigurację z procesu głównego
    const config = await window.electronAPI.getConfig();

    // Ustaw dane z konfiguracji w HTML
    document.querySelector('.address').textContent = config.address;
    document.querySelector('.marquee-text').textContent = config.marqueeText;

    // Wypełnij tabelę walut
    const currencyTable = document.getElementById('currency-table');
    currencyTable.innerHTML = ''; // Wyczyść istniejące dane
    config.currencies.forEach(currency => {
        const row = `<tr>
            <td><img src="${currency.flag}" alt="${currency.name}"></td>
            <td>${currency.symbol}</td>
            <td>${currency.name}</td>
            <td>${currency.buy.toFixed(4)}</td>
            <td>${currency.sell.toFixed(4)}</td>
        </tr>`;
        currencyTable.innerHTML += row;
    });

    // Zegar
    function updateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('date-time').textContent = now.toLocaleDateString('pl-PL', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Pogoda
    async function getWeather() {
        const city = config.weatherCity;
        const coords = await window.electronAPI.getCoords(city);

        if (!coords) {
            document.getElementById('weather').textContent = `Nie znaleziono miasta: ${city}`;
            return;
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const temp = data.current_weather.temperature;
            const weather = `Pogoda w ${city}: ${temp}°C`;
            document.getElementById('weather').textContent = weather;
        } catch (error) {
            console.error('Błąd podczas pobierania pogody:', error);
            document.getElementById('weather').textContent = 'Nie udało się załadować pogody.';
        }
    }

    getWeather();
    setInterval(getWeather, 900000); // Odświeżaj co 15 minut
});
