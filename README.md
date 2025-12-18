# Clipboard Syncing

A real-time clipboard synchronization tool that allows you to share text instantly across devices. It features a web interface for any device and a native Windows desktop application with background syncing capabilities.

## Features

-   **Real-time Sync**: Text copied on one device appears instantly on others in the same room.
-   **Web Client**: Accessible from any browser (Mobile, Tablet, Mac, PC).
-   **Windows Desktop App**:
    -   **Background Syncing**: Runs in the system tray, syncing even when minimized.
    -   **System Tray Integration**: Quick access to Open/Quit via tray icon.
    -   **One-Click Copy**: History items can be copied with a single click.

## 📖 Usage Guide & Connection Steps

### Scenario 1: Using the Live Website (Production)
The easiest way to use the app without any setup.
1.  **Open the Web App**: Go to [https://clipboard-sync.ambaycapital.com](https://clipboard-sync.ambaycapital.com) on your **PC** and **Phone**.
2.  **Create Room**: On one device, click "Create New Room".
3.  **Join Room**: Enter the Room Code on the other device.
4.  **Sync**: Copy text, and it's shared!

### Scenario 2: Connecting Phone to Local PC (Development)
If you are running the app locally on your PC (via `start_all.bat` or `npm start`) and want to connect your phone:
1.  **Ensure Same WiFi**: Connect your PC and Phone to the **same WiFi network**.
2.  **Find PC IP Address**:
    -   Open Command Prompt (`cmd`) on Windows.
    -   Type `ipconfig` and press Enter.
    -   Look for **IPv4 Address** (e.g., `192.168.1.5`).
3.  **Connect on Phone**:
    -   Open your phone's browser (Chrome/Safari).
    -   Type: `http://<YOUR_IPV4>:8081` (e.g., `http://192.168.1.5:8081`).
    -   You will see the green "Connected" dot.
4.  **Join Room**: Enter the room code from your PC app.

### Scenario 3: Using the Windows Desktop App
For permanent background syncing on your computer.
1.  **Download**: Get the latest `.exe` from [Releases](https://github.com/shhiivvaam/Clipboard-Syncing/releases).
2.  **Install & Run**: Run the installer. The app will launch.
3.  **Create/Join Room**: Create a room in the desktop app.
4.  **Connect Other Devices**:
    -   Open [https://clipboard-sync.ambaycapital.com](https://clipboard-sync.ambaycapital.com) on your **Phone** or **Laptop**.
    -   Enter the **Room Code** shown in your Desktop App.
    -   Now your PC and Phone are synced!
5.  **Minimize to Tray**: Click the "X" button. The app will **not quit**; it minimizes to the System Tray (bottom right icons) to keep syncing in the background.
    -   **Right-Click Tray Icon** to "Open" or "Quit".

## Development

### Prerequisites
-   Node.js installed.

### Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/shhiivvaam/Clipboard-Syncing.git
    cd Clipboard-Syncing
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```

### Running Locally
1.  **Quick Start (Recommended)**:
    Double-click `start_all.bat` in the project folder. This will automatically launch:
    -   The Sync Server (Port 8080)
    -   The Web Client (http://localhost:8081)
    -   The Electron Desktop App

2.  **Manual Start**:
    If you prefer to run components individually:
    -   **Server**: `node server/index.js`
    -   **Electron App**: `npm start`
    -   **Web Client**: Open `client/index.html` in your browser.

### Building the Desktop App
To create the `.exe` installer:
1.  **Update Version**: Change the `version` in `package.json` (e.g., "1.0.1"). `electron-builder` uses this version number for the filename (e.g., `Clipboard Sync Setup 1.0.1.exe`).
2.  **Build**:
    ```bash
    npm run build
    ```
3.  Find the installer in the `dist` folder.
