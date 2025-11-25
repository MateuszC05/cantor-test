document.addEventListener('DOMContentLoaded', () => {
    // Dane walut (docelowo mogą być pobierane z API)
    const currencies = [
        { symbol: 'USD', name: 'Dolar Amerykański', flag: 'flags/us.svg', buy: 4.05, sell: 4.15 },
        { symbol: 'EUR', name: 'Euro', flag: 'flags/eu.svg', buy: 4.30, sell: 4.40 },
        { symbol: 'GBP', name: 'Funt Brytyjski', flag: 'flags/gb.svg', buy: 5.00, sell: 5.10 },
        { symbol: 'CHF', name: 'Frank Szwajcarski', flag: 'flags/ch.svg', buy: 4.50, sell: 4.60 },
        { symbol: 'AUD', name: 'Dolar Australijski', flag: 'flags/au.svg', buy: 2.70, sell: 2.80 },
        { symbol: 'CAD', name: 'Dolar Kanadyjski', flag: 'flags/ca.svg', buy: 3.00, sell: 3.10 },
        { symbol: 'DKK', name: 'Korona Duńska', flag: 'flags/dk.svg', buy: 0.58, sell: 0.62 },
        { symbol: 'SEK', name: 'Korona Szwedzka', flag: 'flags/se.svg', buy: 0.38, sell: 0.42 },
        { symbol: 'NOK', name: 'Korona Norweska', flag: 'flags/no.svg', buy: 0.39, sell: 0.43 },
        { symbol: 'RUB', name: 'Rubel Rosyjski', flag: 'flags/ru.svg', buy: 0.04, sell: 0.05 }
    ];

    const currencyTable = document.getElementById('currency-table');
    currencies.forEach(currency => {
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
    function getWeather() {
        // Współrzędne Białegostoku
        const lat = 53.13;
        const lon = 23.16;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = data.current_weather.temperature;
                const weather = `Pogoda w Białymstoku: ${temp}°C`;
                document.getElementById('weather').textContent = weather;
            })
            .catch(error => {
                console.error('Błąd podczas pobierania pogody:', error);
                document.getElementById('weather').textContent = 'Nie udało się załadować pogody.';
            });
    }
    getWeather();
     setInterval(getWeather, 900000); // Odświeżaj co 15 minut
});
