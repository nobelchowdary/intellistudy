import { getDocument, GlobalWorkerOptions } from './pdfjs/pdf.min.mjs';

try {
  const workerUrl = chrome.runtime.getURL('pdfjs/pdf.worker.min.mjs');
  GlobalWorkerOptions.workerSrc = workerUrl;
} catch (error) {
  console.error('Failed to configure pdf.js worker source:', error);
}

async function extractTextFromPdf(url) {
  const isLocalFile = url.startsWith('file://');
  const response = await fetch(url, {
    credentials: 'include',
    mode: isLocalFile ? 'same-origin' : 'cors',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch PDF (status ${response.status}).`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const loadingTask = getDocument({
    data: arrayBuffer,
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
    enableXfa: false
  });

  try {
    const pdfDocument = await loadingTask.promise;
    const parts = [];

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (typeof item.str === 'string' ? item.str.trim() : ''))
        .filter((str) => str.length > 0)
        .join(' ');

      if (pageText.length > 0) {
        parts.push(pageText);
      }
    }

    await pdfDocument.destroy();
    return parts.join('\n\n');
  } catch (error) {
    await loadingTask.destroy();
    throw error;
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === 'fetchPdfContent') {
    const url = message.url;

    if (!url) {
      sendResponse({ error: 'No PDF URL provided.' });
      return false;
    }

    (async () => {
      try {
        const content = await extractTextFromPdf(url);

        if (!content || content.trim().length === 0) {
          sendResponse({ error: 'This PDF does not contain any extractable text.' });
          return;
        }

        sendResponse({ content: content.trim() });
      } catch (error) {
        console.error('Error extracting PDF text:', error);
        const baseMessage = error instanceof Error ? error.message : 'Unknown error';
        const finalMessage = url.startsWith('file://')
          ? `Could not read the local PDF: ${baseMessage}`
          : `Could not read the PDF: ${baseMessage}`;
        sendResponse({ error: finalMessage });
      }
    })();

    return true;
  }

  return false;
});