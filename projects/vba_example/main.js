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
        this.time = 0;
        this.thermalEfficiency = 0.02; // How fast indoor temp changes
        
        // DOM Elements
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
        // 1. Update Weather (Outdoor)
        // Sine wave oscillation between 5°C and 35°C
        this.time += 0.005;
        this.outdoorTemp = 20 + Math.sin(this.time) * 15;
        
        // 2. Update Indoor Temp
        // Indoor temp moves towards AC setting but is pulled by Outdoor temp
        const deltaAC = this.acSetting - this.indoorTemp;
        const deltaOutdoor = this.outdoorTemp - this.indoorTemp;
        
        // Simulating AC power vs Insulation leakage
        this.indoorTemp += deltaAC * 0.01 + deltaOutdoor * 0.002;
        
        // 3. Update Humidity (Slowly fluctuates)
        this.humidity = 40 + Math.sin(this.time * 0.5) * 20;

        // 4. Update UI
        this.outdoorDisplay.innerText = `${this.outdoorTemp.toFixed(1)}°C`;
        this.indoorDisplay.innerText = `${this.indoorTemp.toFixed(1)}°C`;
        this.humidityDisplay.innerText = `${Math.round(this.humidity)}%`;
        
        // 5. Update Characters
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
