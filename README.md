# Clipboard Syncing

A real-time clipboard synchronization tool that allows you to share text instantly across devices. It features a web interface for any device and a native Windows desktop application with background syncing capabilities.

## Features

-   **Real-time Sync**: Text copied on one device appears instantly on others in the same room.
-   **Web Client**: Accessible from any browser (Mobile, Tablet, Mac, PC).
-   **Windows Desktop App**:
    -   **Background Syncing**: Runs in the system tray, syncing even when minimized.
    -   **System Tray Integration**: Quick access to Open/Quit via tray icon.
    -   **One-Click Copy**: History items can be copied with a single click.

## Getting Started

### 1. Using the Web Client
Simply visit our [Web Interface](https://clipboard-sync.ambaycapital.com/)
1.  **Create a Room**: Click "Create New Room" to generate a unique code.
2.  **Join a Room**: Enter the code on another device to join.
3.  **Sync**: Copy text on one device, and it will appear on the other!

### 2. Installing the Windows App
For the best experience on Windows:
1.  Download the latest installer from [Releases](https://github.com/shhiivvaam/Clipboard-Syncing/releases).
2.  Run the `.exe` file to install.
3.  Launch the app and join your room.
4.  **Minimize to Tray**: You can close the window, and the app will keep running in the background.

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
