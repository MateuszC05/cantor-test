const { app, BrowserWindow, shell, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

const configPath = path.join(app.getPath('userData'), 'config.json');
let mainWindow; // Zmienna globalna przechowująca referencję do okna

function initializeConfig() {
    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            address: "WOJSKA POLSKIEGO 207",
            weatherCity: "Białystok",
            marqueeText: "KANTOR",
            currencies: [
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
            ]
        };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
        shell.openPath(configPath);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    initializeConfig();
    createWindow();

    // Rejestracja skrótu klawiszowego F11 do obsługi pełnego ekranu
    globalShortcut.register('F11', () => {
        if (mainWindow) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    // Wyrejestruj skrót przed zamknięciem aplikacji
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('get-config', () => {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
});

ipcMain.handle('get-coords', async (event, city) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        }
        return null;
    } catch (error) {
        console.error('Błąd podczas pobierania współrzędnych:', error);
        return null;
    }
});
