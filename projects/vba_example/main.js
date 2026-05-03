/**
 * VBA Simulation - Main Logic
 * Aimed at: Veri Bilimi ve Analitiği Students
 */

class Simulation {
    constructor() {
        this.outdoorTemp = 24;
        this.indoorTemp = 22;
        this.acSetting = 22;
        this.humidity = 45;
        this.windSpeed = 10;
        this.simTime = 12.0; // Starting at 12:00 PM
        this.thermalEfficiency = 0.02; 
        
        // DOM Elements
        this.timeDisplay = document.getElementById('sim-time-display');
        this.outdoorDisplay = document.getElementById('outdoor-temp-display');
        this.indoorDisplay = document.getElementById('indoor-temp-display');
        this.acDisplay = document.getElementById('ac-setting-display');
        this.acSlider = document.getElementById('ac-slider');
        this.humidityDisplay = document.getElementById('humidity-display');
        this.acStatus = document.getElementById('ac-status');
        
        this.init();
    }

    init() {
        this.acSlider.addEventListener('input', (e) => {
            this.acSetting = parseInt(e.target.value);
            this.acDisplay.innerText = `${this.acSetting}°C`;
            this.updateACStatus();
        });

        // Initialize Characters
        this.chars = [
            new Character('char-1', '#38bdf8'),
            new Character('char-2', '#fb923c'),
            new Character('char-3', '#4ade80')
        ];

        // Start Loop
        this.loop();
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

    loop() {
        // 1. Update Time (1 day = 60 seconds)
        // 24 hours / (60 seconds * 60 fps) = 0.0066...
        this.simTime = (this.simTime + 0.00666) % 24;
        
        // 2. Update Weather (Outdoor)
        // Temperature peaks at 14:00 (2 PM) and is lowest at 02:00 AM
        // Using a shifted cosine wave for natural daily cycle
        const hourOffset = (this.simTime - 14) * (Math.PI / 12);
        const baseTemp = 20;
        const amplitude = 12;
        this.outdoorTemp = baseTemp + Math.cos(hourOffset) * amplitude;
        
        // 3. Update Indoor Temp
        const deltaAC = this.acSetting - this.indoorTemp;
        const deltaOutdoor = this.outdoorTemp - this.indoorTemp;
        this.indoorTemp += deltaAC * 0.015 + deltaOutdoor * 0.003;
        
        // 4. Update Other Stats
        this.humidity = 40 + Math.sin(this.simTime * Math.PI / 12) * 15;
        this.windSpeed = 10 + Math.random() * 5;

        // 5. Update UI
        const hours = Math.floor(this.simTime);
        const minutes = Math.floor((this.simTime % 1) * 60);
        this.timeDisplay.innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        this.outdoorDisplay.innerText = `${this.outdoorTemp.toFixed(1)}°C`;
        this.indoorDisplay.innerText = `${this.indoorTemp.toFixed(1)}°C`;
        this.humidityDisplay.innerText = `${Math.round(this.humidity)}%`;
        document.getElementById('wind-display').innerText = `${this.windSpeed.toFixed(1)} km/h`;
        
        // 6. Update Characters
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
                    <!-- Heavy Coat -->
                    <rect x="25" y="45" width="50" height="100" rx="10" fill="${this.accentColor}" />
                    <rect x="20" y="50" width="15" height="80" rx="7" fill="${this.accentColor}" />
                    <rect x="65" y="50" width="15" height="80" rx="7" fill="${this.accentColor}" />
                    <!-- Scarf -->
                    <path d="M35 45 Q 50 60 65 45" stroke="#ef4444" stroke-width="8" fill="none" />
                    <rect x="60" y="45" width="10" height="30" rx="2" fill="#ef4444" />
                `;
            case 'jacket':
                return `
                    <!-- Jacket -->
                    <rect x="25" y="45" width="50" height="90" rx="5" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="12" height="80" rx="5" fill="${this.accentColor}" />
                    <rect x="68" y="45" width="12" height="80" rx="5" fill="${this.accentColor}" />
                    <!-- Zipper line -->
                    <line x1="50" y1="45" x2="50" y2="135" stroke="rgba(0,0,0,0.2)" stroke-width="2" />
                `;
            case 'long-sleeves':
                return `
                    <!-- Long Sleeve Shirt -->
                    <rect x="30" y="45" width="40" height="95" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="10" height="85" fill="${this.accentColor}" />
                    <rect x="70" y="45" width="10" height="85" fill="${this.accentColor}" />
                `;
            default: // short-sleeves
                return `
                    <!-- T-Shirt -->
                    <rect x="30" y="45" width="40" height="90" fill="${this.accentColor}" />
                    <rect x="20" y="45" width="10" height="30" fill="${this.accentColor}" />
                    <rect x="70" y="45" width="10" height="30" fill="${this.accentColor}" />
                    <!-- Arms -->
                    <rect x="22" y="75" width="6" height="50" fill="#ffdbac" />
                    <rect x="72" y="75" width="6" height="50" fill="#ffdbac" />
                `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simulation = new Simulation();
});
