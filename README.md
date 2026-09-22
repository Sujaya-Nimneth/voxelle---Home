# Voxelle Home 🏡✨

> **Next-Generation Smart Home Web Application with Apple Home Design Aesthetics & 100% On-Device Local AI Model Intelligence.**

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Local AI](https://img.shields.io/badge/Local%20AI-Ollama%20%7C%20LM%20Studio%20%7C%20Built--in-10b981.svg)](#local-ai-model-engine)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device-34d399.svg)](#privacy-first-architecture)

---

## 🌟 Overview

**Voxelle Home** is a smart home interface designed to mirror the refined visual elegance of **Apple Home across macOS Sequoia, iPadOS, and iOS 18**, while introducing a privacy-first **Local AI Model Engine**.

Unlike conventional smart home hubs that transmit private camera feeds, audio recordings, and daily routines to remote cloud servers, Voxelle Home processes natural language intents, device mutations, scene orchestrations, and visual object detection **100% locally on your hardware**.

---

## 📸 Interface Showcase

| macOS Studio Desktop | iPad Pro Split View | iPhone 16 Pro Frame |
| :---: | :---: | :---: |
| Full-featured sidebar, multi-column dashboard & camera grid | Floating glass navigation & responsive grid | Dynamic Island, home swipe bar & mobile bottom tabs |

### Key Aesthetic Highlights:
- **Liquid Ambient Wallpapers**: Dynamic blurred gradient backdrops including *Warm Amber Sunset*, *macOS Sonoma Aurora Green*, and *Midnight OLED Dark*.
- **Frosted Glassmorphism**: Tailored CSS tokens (`backdrop-filter: blur(32px)`, specular highlights, inset borders, and ambient light refraction).
- **Apple Intelligence Iridescent Glowing Orb**: Multilayer rotating gradient halo reflecting Siri and Apple Intelligence aesthetics.
- **Micro-Animations & Visual Delight**: Spinning ceiling fan blades, glowing color-coordinated accessory states, and scene trigger confetti celebrations.

---

## 🚀 Key Features

### 1. 🎛️ Apple Home Tile Controls & Status Hierarchy
- **Header Status Pills**: Real-time counts for `Climate 68° - 72°`, `Lights X On`, `Security Armed/Unlocked`, `Speakers 1 Playing`, `Water All Off`, and `Local AI 100% Private`.
- **One-Tap Scenes**: Quick scene buttons (*Arrive Home*, *Wake Up*, *Leave Home*, *Movie Night*, *Goodnight*, *Focus Work*) that instantly synchronize multiple accessories.
- **Interactive Accessory Tiles**: One-tap toggles with stateful glows (Amber for warm lights, Cyan for fans, Emerald for security locks, Purple for media).
- **Fine-Grained Detail Sheets**:
  - Vertical Apple sliders for granular brightness (0–100%) and fan speeds.
  - Atmosphere color spectrum swatches (from 2200K warm candlelight to 5000K daylight and vibrant neon hues).
  - Circular thermostat dials with Cool, Heat, Auto, and Eco modes.
  - Interactive deadbolt locks with secure lock/unlock confirmations.

### 2. 📹 Multi-Camera Live Grid & Local Vision AI
- **High-Resolution Realistic Feeds**:
  - **Front Porch Doorbell**: Fisheye lens with AI package detection bounding box (`Package Delivered 99%`).
  - **Garage & Driveway**: Wide-angle overview with vehicle security monitoring (`SUV Secured 98%`).
  - **Pool & Deck**: Outdoor water clarity and temperature monitoring (`82°F`).
  - **Interior Lounge**: Living room motion and ambient lighting analysis.
- **Camera Inspector Modal**: Equipped with **Two-Way Intercom (Push to Talk)**, **Emergency Siren**, **Instant Snapshot Capture**, and **Local AI Event Timeline**.

### 3. 🧠 Privacy-First Local AI Model Engine ("Voxelle Neural")
- **3 Execution Providers**:
  1. **Built-in Local Neural Engine**: Instant sub-5ms semantic parsing with intent extraction and device action execution that runs completely offline with zero setup.
  2. **Ollama Local Bridge**: Real-time ping and model switcher for `http://localhost:11434` (supporting `llama3.2`, `mistral`, `phi3`, `gemma2`, `qwen2.5`).
  3. **LM Studio / LocalAI Connector**: Compatible with local OpenAI-compatible endpoints at `http://localhost:1234/v1`.
- **Voice Dictation & Speech Synthesis**: Integrated with Web Speech API for hands-free voice commands and voice feedback.
- **Direct Tool Calling**: Translates natural language into smart home state mutations with visual execution chips (e.g. *"Dim the living room lights to 25% and turn on fan"*).

### 4. ⚡ Natural Language Automations Synthesizer
- **Smart Event Triggers**: Schedule or geo-fence rules (Sunset ambiance, geofence arrivals, night-time security sentry).
- **AI Automation Generator**: Describe an automation in plain English (e.g., *"Turn on backyard lights and notify me if the pool gate opens after 9 PM"*), and the local engine synthesizes the rule automatically.

### 5. 📱 Multi-Device Chassis Switcher
- Test and experience the app across three Apple hardware form factors via the top window toolbar:
  - **Mac Studio**: Full macOS window with traffic light controls, persistent translucent sidebar, and expanded grid.
  - **iPad Pro**: Rounded tablet chassis with split-view layout.
  - **iPhone 16 Pro**: Smartphone chassis with working Dynamic Island, bottom navigation tabs, and home indicator swipe bar.

---

## 🛠️ Architecture & Tech Stack

```
voxelle-home/
├── public/
│   └── assets/                     # High-res camera feeds & dynamic wallpapers
│       ├── camera_pool.jpg
│       ├── camera_driveway.jpg
│       ├── camera_livingroom.jpg
│       ├── camera_porch.jpg
│       ├── wallpaper_amber.jpg
│       └── wallpaper_aurora.jpg
├── src/
│   ├── components/
│   │   ├── AccessoryTile.jsx       # Apple-style interactive accessory tile
│   │   ├── AutomationsView.jsx     # Automation rules & AI synthesizer
│   │   ├── CameraDetailModal.jsx   # 4K live feed inspector with intercom & AI vision
│   │   ├── CameraGrid.jsx          # Live camera carousel/grid
│   │   ├── DeviceDetailModal.jsx   # Dimmer sliders, dials, and color swatches
│   │   ├── DiscoverView.jsx        # Matter & Thread ecosystem overview
│   │   ├── HomeDashboard.jsx       # Main dashboard layout
│   │   ├── LocalAiModal.jsx        # Apple Intelligence Siri-style assistant HUD
│   │   ├── ScenesBar.jsx           # Glowing scene trigger pills
│   │   ├── Sidebar.jsx             # Translucent frosted glass sidebar
│   │   ├── StatusPills.jsx         # Category status chips
│   │   └── TopHeader.jsx           # macOS title bar, viewport & theme switchers
│   ├── context/
│   │   └── HomeContext.jsx         # Central reactive state management
│   ├── services/
│   │   └── localAiEngine.js        # Offline neural intent executor & Ollama bridge
│   ├── App.jsx                     # Top-level viewport chassis coordinator
│   ├── index.css                   # Vanilla CSS glassmorphic design system
│   └── main.jsx                    # Application entry point
├── index.html                      # PWA meta tags & Apple typography fonts
└── package.json                    # Project dependencies
```

- **Frontend**: React 19 + Vite 8
- **Styling**: Vanilla CSS with customized glassmorphic tokens (Zero Tailwind, maximum CSS control)
- **Icons**: Lucide Icons (SF Symbols-inspired configuration)
- **Delight**: Canvas Confetti
- **Local AI**: Browser Speech APIs, Local Fetch bridges for Ollama & LM Studio, In-Memory Semantic Parser

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)
- *(Optional)* [Ollama](https://ollama.com/) or [LM Studio](https://lmstudio.ai/) for running external local LLMs.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sujaya-Nimneth/voxelle---Home.git
cd "voxelle - Home"
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### 3. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🤖 Connecting Local AI Models (Ollama / LM Studio)

Voxelle Home includes a **built-in zero-configuration local engine** that works immediately without installing external software. If you would like to connect larger local LLMs:

### Using Ollama:
1. Install Ollama from [ollama.com](https://ollama.com/).
2. Pull your preferred model:
   ```bash
   ollama run llama3.2
   ```
3. Ensure Ollama allows web origin requests (if needed):
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
4. In Voxelle Home, click the **Voxelle AI** glowing orb in the top bar, switch the provider tab to **Ollama Bridge (localhost:11434)**, and click **Check localhost:11434**.

### Using LM Studio:
1. Open LM Studio and start the **Local Inference Server** on port `1234`.
2. In Voxelle Home, select the **LM Studio Bridge** tab in the AI Assistant modal.

---

## 🔒 Privacy & Security

- **Zero Cloud Outbound**: Smart home states, accessory commands, camera snapshots, and voice recognition are kept entirely on your local machine.
- **Local Vision Analysis**: AI detection tags (*Package Delivered*, *Vehicle Secured*) simulate edge AI running on local smart cameras.
- **No Tracking or Analytics**: No external telemetry scripts or third-party ad pixels.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Crafted with ❤️ for modern, private, and beautiful smart home experiences.</sub>
</div>
