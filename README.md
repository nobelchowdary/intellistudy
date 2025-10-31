# IntelliStudy – Chrome Side Panel Research Copilot

IntelliStudy is a Chrome extension that turns the side panel into a study companion. It can summarize pages, answer questions about the current site, and chat about uploaded documents – fully on-device with Gemini Nano, or optionally through Gemini 2.5 Flash Lite in the cloud.

---

## Features

- **One-click page summarizes** focused on key takeaways, terminology, and action items.
- **Interactive Q&A** in English or Spanish about the active page or any uploaded document (TXT, JSON, CSV, HTML, Markdown, PDF, DOCX).
- **Document uploads** for offline analysis, including PDF text extraction via the background service worker.
- **Voice input** with speech-to-text and spoken responses.
- **Gemini mode switcher** to move between on-device Gemini Nano and cloud-based Gemini 2.5 Flash Lite.
- **Persistent language selector** to keep the UI and answers English-only or Spanish-only.

---

## Prerequisites

- Chrome 128 or later (side panel + on-device LanguageModel API preview).
- macOS/Linux/Windows capable of running Chrome with the “Built-in AI” preview.
- (Optional) A Gemini API key with access to `generativelanguage.googleapis.com` (for cloud mode).

---

## Project Structure

```
IntelliStudy/
├── manifest.json           # Chrome extension manifest (MV3)
├── sidepanel.html          # Side panel UI markup
├── sidepanel.js            # Front-end logic, toggles, language handling
├── style.css               # Styling for the UI
├── content.js              # Content script to fetch page text
├── service-worker.js       # Background worker (PDF parsing, messaging)
├── pdfjs/                  # Bundled pdf.js modules
│   ├── pdf.min.mjs
│   └── pdf.worker.min.mjs
└── README.md               # (This document)
```

---

## Installation & Setup

1. **Clone or copy** the repository onto your machine.

   ```bash
   git clone https://github.com/<your-account>/IntelliStudy.git
   cd IntelliStudy
   ```

2. **Open Chrome** and navigate to `chrome://extensions`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **“Load unpacked”** and select the `IntelliStudy` directory.

5. The extension will appear in the toolbar. Pin it if you’d like quick access.

6. (Optional for local PDFs) Visit the extension’s **Details** page and enable **“Allow access to file URLs”**.

---

## Usage

1. **Open the side panel:** Click the IntelliStudy icon or use the Chrome side panel menu.

2. **Summarize a page:** Press the “Summarize” button. Ensure the page isn’t a restricted URL (e.g., `chrome://` or Chrome Web Store).

3. **Ask questions:** Type into the prompt input. Responses respect the currently selected language.

4. **Upload a document:** Click the + menu > “Upload document” to analyze local files (TXT, Markdown, JSON, CSV, HTML, XML, YAML, logs, PDF, DOCX).

5. **Use voice:** Choose “Ask with voice” from the + menu. Grant microphone access when prompted.

6. **Switch languages:** Use the language dropdown (English ↔ Español). UI labels, hints, and answers switch accordingly.

7. **Toggle Gemini mode:** Use the slider at the top to switch between on-device Gemini Nano and Gemini 2.5 Flash Lite in the cloud.

   - **On-device (default):** Runs entirely locally via Chrome’s LanguageModel API.
   - **Cloud (optional):** Calls the Gemini REST endpoint. Requires an active API key.

---

## Configuring Cloud Mode (Gemini 2.5)

1. **Enable the Gemini API** in your Google Cloud console or Firebase project.
2. **Generate an API key** for `generativelanguage.googleapis.com` and replace the placeholder in `sidepanel.js`:

   ```js
   const CLOUD_MODEL_CONFIG = {
     model: 'gemini-2.5-flash-lite',
     endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
     apiKey: 'YOUR_API_KEY_HERE'
   };
   ```

3. Reload the extension. When you enable the cloud toggle: 
   - IntelliStudy tests the endpoint.
   - If it succeeds, subsequent Q&A and summaries are routed through Gemini 2.5.
   - If it fails (quota/billing/permission), the toggle resets to on-device mode and reports the error in the output panel.

> ⚠️ **Security note:** API keys distributed with the extension are visible to users. Only use keys meant for client-side applications with appropriate quotas and monitoring.

---

## Development Tips

- The project uses vanilla JS/CSS with `apply_patch` for edits; no build step is required.
- Chrome’s Developer Tools (side panel context) let you inspect UI state and console logs.
- The background service worker logs to `chrome://extensions` → IntelliStudy → “Service Worker” console.
- For PDF issues, ensure the service worker can fetch (`Allow access to file URLs`) and the PDF isn’t DRM-protected.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| “This Chrome build does not expose the LanguageModel API.” | Built-in AI preview disabled | Update Chrome and enable “Built-in AI” flags. |
| Cannot read local PDFs | Chrome blocks file URLs by default | Enable “Allow access to file URLs” in extension details. |
| Cloud mode error mentioning blocked endpoint | API key missing permissions | Verify Gemini API key is active and has sufficient quota. |
| Spanish answers returning in English | Language toggle set to English | Select “Español” from the dropdown before asking. |

---

## License & Credits

- Gemini Nano and Gemini 2.5 are trademarks of Google.
- pdf.js © Mozilla Foundation, distributed under the Apache 2.0 license.
- IntelliStudy is provided for hackathon/demo purposes; integrate responsibly when using cloud APIs or handling user data.

Happy studying! 🎓