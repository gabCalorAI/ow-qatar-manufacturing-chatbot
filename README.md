# Qatar Manufacturing Advisor

A modern React application for the Qatar Manufacturing Sector Advisor demo.

## Project Structure

- **`src/`**: React application source code.
- **`docs/`**: Project documentation, including PRD, setup guides, and mock data.
- **`legacy/`**: Original single-file implementation and standalone components.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Configuration

Edit `src/App.jsx` to configure:
- `WEBHOOK_URL`: Your n8n production webhook URL.
- `DEMO_MODE`: Toggle between mock data and real backend.

See `docs/README.md` for the original documentation and demo script.
