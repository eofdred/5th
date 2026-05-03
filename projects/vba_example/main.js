/**
 * VBA Simulation - Main Logic
 * Aimed at: Veri Bilimi ve Analitiği Students
 */

class Simulation {
    constructor() {
        this.outdoorTemp = 20;
        this.indoorTemp = 20;
        this.acSetting = 22;
        this.humidity = 45;
        this.windSpeed = 10;
        this.simTime = 0.0; // Starting at 00:00
        this.thermalEfficiency = 0.02; 
        this.isRunning = false;
        this.totalEnergy = 0; // kWh
        
        // Data for charts
        this.dataPoints = {
            labels: [],
            outdoor: [],
            indoor: [],
            ac: [],
            humidity: [],
            wind: []
        };
        
        // DOM Elements
        this.timeDisplay = document.getElementById('sim-time-display');
        this.outdoorDisplay = document.getElementById('outdoor-temp-display');
        this.indoorDisplay = document.getElementById('indoor-temp-display');
        this.acDisplay = document.getElementById('ac-setting-display');
        this.acSlider = document.getElementById('ac-slider');
        this.humidityDisplay = document.getElementById('humidity-display');
        this.acStatus = document.getElementById('ac-status');
        this.btnPlay = document.getElementById('btn-play');
        this.powerDisplay = document.getElementById('current-power');
        this.energyDisplay = document.getElementById('total-energy');
        
        this.init();
    }

    init() {
        this.acSlider.addEventListener('input', (e) => {
            this.acSetting = parseInt(e.target.value);
            this.acDisplay.innerText = `${this.acSetting}°C`;
            this.updateACStatus();
        });

        this.btnPlay.addEventListener('click', () => {
            if (!this.isRunning) {
                this.resetSimulation();
                this.isRunning = true;
                this.btnPlay.disabled = true;
                this.btnPlay.innerText = 'ÇALIŞIYOR...';
                this.loop();
            }
        });

        // Initialize Chart
        this.initChart();

        // Initialize Characters
        this.chars = [
            new Character('char-1', '#38bdf8'),
            new Character('char-2', '#fb923c'),
            new Character('char-3', '#4ade80')
        ];

        this.updateUI();
    }

    resetSimulation() {
        this.simTime = 0;
        this.totalEnergy = 0;
        this.dataPoints.labels = [];
        this.dataPoints.outdoor = [];
        this.dataPoints.indoor = [];
        this.dataPoints.ac = [];
        this.dataPoints.humidity = [];
        this.dataPoints.wind = [];
        this.chart.update();
    }

    initChart() {
        const ctx = document.getElementById('simulationChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.dataPoints.labels,
                datasets: [
                    { label: 'Dış Sıcaklık (°C)', data: this.dataPoints.outdoor, borderColor: '#fb923c', tension: 0.4, borderWidth: 2, pointRadius: 0 },
                    { label: 'İç Sıcaklık (°C)', data: this.dataPoints.indoor, borderColor: '#38bdf8', tension: 0.4, borderWidth: 2, pointRadius: 0 },
                    { label: 'AC Ayarı (°C)', data: this.dataPoints.ac, borderColor: '#f8fafc', borderDash: [5, 5], tension: 0, borderWidth: 1, pointRadius: 0 },
                    { label: 'Nem (%)', data: this.dataPoints.humidity, borderColor: '#4ade80', tension: 0.4, borderWidth: 1, pointRadius: 0, hidden: true },
                    { label: 'Rüzgar (km/h)', data: this.dataPoints.wind, borderColor: '#94a3b8', tension: 0.4, borderWidth: 1, pointRadius: 0, hidden: true }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', maxRotation: 0 } }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc', boxWidth: 12, font: { size: 11 } } }
                }
            }
        });
    }

    updateACStatus() {
        if (this.acSetting < this.indoorTemp) {
            this.acStatus.innerText = 'SOĞUTMA MODU';
            this.acStatus.style.color = '#38bdf8';
        } else if (this.acSetting > this.indoorTemp) {
            this.acStatus.innerText = 'ISITMA MODU';
            this.acStatus.style.color = '#fb923c';
        } else {
            this.acStatus.innerText = 'BEKLEMEDE';
            this.acStatus.style.color = '#94a3b8';
        }
    }

    calculateEnergy(delta) {
        // High efficiency inverter AC model
        // Base power 100W, Max 1500W
        const basePower = 0.1; // kW
        const loadFactor = Math.min(Math.abs(delta) * 0.2, 1.4); // Max 1.4kW additional load
        const currentPowerKW = basePower + loadFactor;
        
        // simTime advances by 0.0066 hours per frame (1 day in 60s)
        const frameTimeHours = 0.00666; 
        const frameEnergy = currentPowerKW * frameTimeHours;
        
        this.totalEnergy += frameEnergy;
        return currentPowerKW * 1000; // Return Watts
    }

    updateUI() {
        const hours = Math.floor(this.simTime);
        const minutes = Math.floor((this.simTime % 1) * 60);
        this.timeDisplay.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        this.outdoorDisplay.innerText = `${this.outdoorTemp.toFixed(1)}°C`;
        this.indoorDisplay.innerText = `${this.indoorTemp.toFixed(1)}°C`;
        this.humidityDisplay.innerText = `${Math.round(this.humidity)}%`;
        document.getElementById('wind-display').innerText = `${this.windSpeed.toFixed(1)} km/h`;
        this.energyDisplay.innerText = `${this.totalEnergy.toFixed(2)} kWh`;
    }

    loop() {
        if (!this.isRunning) return;

        // 1. Update Time
        this.simTime += 0.00666;
        
        if (this.simTime >= 24) {
            this.simTime = 24;
            this.isRunning = false;
            this.btnPlay.disabled = false;
            this.btnPlay.innerText = 'TEKRARLAT';
            this.updateUI();
            return;
        }

        // 2. Update Weather
        const hourOffset = (this.simTime - 14) * (Math.PI / 12);
        const baseTemp = 20;
        const amplitude = 12;
        this.outdoorTemp = baseTemp + Math.cos(hourOffset) * amplitude;
        this.humidity = 40 + Math.sin(this.simTime * Math.PI / 12) * 15;
        this.windSpeed = 10 + Math.random() * 2;

        // 3. Update Indoor Temp & Energy
        const deltaAC = this.acSetting - this.indoorTemp;
        const deltaOutdoor = this.outdoorTemp - this.indoorTemp;
        this.indoorTemp += deltaAC * 0.015 + deltaOutdoor * 0.003;
        
        const currentWatts = this.calculateEnergy(deltaAC);
        this.powerDisplay.innerText = `${Math.round(currentWatts)} W`;

        // 4. Update Data Points for Chart (every 30 sim minutes)
        if (Math.floor(this.simTime * 2) > this.dataPoints.labels.length - 1) {
            const hours = Math.floor(this.simTime);
            const minutes = Math.floor((this.simTime % 1) * 60);
            this.dataPoints.labels.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            this.dataPoints.outdoor.push(this.outdoorTemp.toFixed(1));
            this.dataPoints.indoor.push(this.indoorTemp.toFixed(1));
            this.dataPoints.ac.push(this.acSetting);
            this.dataPoints.humidity.push(this.humidity.toFixed(1));
            this.dataPoints.wind.push(this.windSpeed.toFixed(1));
            this.chart.update('none'); // Update without animation for performance
        }

        // 5. Update UI & Characters
        this.updateUI();
        this.chars.forEach(char => char.update(this.indoorTemp));

        requestAnimationFrame(() => this.loop());
    }
}

class Character {
    constructor(containerId, accentColor) {
        this.container = document.getElementById(containerId);
        this.accentColor = accentColor;
        this.currentClothes = '';
        this.render();
    }

    update(temp) {
        let clothingType = 'short-sleeves';
        if (temp < 12) clothingType = 'parka';
        else if (temp < 18) clothingType = 'jacket';
        else if (temp < 24) clothingType = 'long-sleeves';
        
        if (this.currentClothes !== clothingType) {
            this.currentClothes = clothingType;
            this.render();
        }
    }

    render() {
        const clothes = this.getClothingSVG();
        this.container.innerHTML = `
            <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Head -->
                <circle cx="50" cy="30" r="15" fill="#ffdbac" />
                <!-- Body/Clothes -->
                ${clothes}
                <!-- Legs -->
                <rect x="35" y="140" width="12" height="50" fill="#334155" />
                <rect x="53" y="140" width="12" height="50" fill="#334155" />
                <!-- Shoes -->
                <rect x="30" y="185" width="18" height="10" rx="5" fill="#000" />
                <rect x="52" y="185" width="18" height="10" rx="5" fill="#000" />
            </svg>
        `;
    }

    getClothingSVG() {
        switch(this.currentClothes) {
            case 'parka':
                return `
                    <rect x="25" y="45" width="50" height="100" rx="10" fill="${this.accentColor}" />
                    <rect x="20" y="50" width="15" height="80" rx="7" fill="${this.accentColor}" />
                    <rect x="65" y="50" width="15" height="80" rx="7" fill="${this.accentColor}" />
                    <path d="M35 45 Q 50 60 65 45" stroke="#ef4444" stroke-width="8" fill="none" />
                    <rect x="60" y="45" width="10" height="30" rx="2" fill="#ef4444" />
                `;
            case 'jacket':
                return `
                    <rect x="25" y="45" width="50" height="90" rx="5" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="12" height="80" rx="5" fill="${this.accentColor}" />
                    <rect x="68" y="45" width="12" height="80" rx="5" fill="${this.accentColor}" />
                    <line x1="50" y1="45" x2="50" y2="135" stroke="rgba(0,0,0,0.2)" stroke-width="2" />
                `;
            case 'long-sleeves':
                return `
                    <rect x="30" y="45" width="40" height="95" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="10" height="85" fill="${this.accentColor}" />
                    <rect x="70" y="45" width="10" height="85" fill="${this.accentColor}" />
                `;
            default: // short-sleeves
                return `
                    <rect x="30" y="45" width="40" height="90" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="10" height="30" fill="${this.accentColor}" />
                    <rect x="70" y="45" width="10" height="30" fill="${this.accentColor}" />
                    <rect x="22" y="75" width="6" height="50" fill="#ffdbac" />
                    <rect x="72" y="75" width="6" height="50" fill="#ffdbac" />
                `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.simulation = new Simulation();
});
