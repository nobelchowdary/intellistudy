// Listens for a message from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    // TODO: Add PDF.js logic here for PDF files
    const pageText = document.body.innerText;
    sendResponse({ content: pageText });
  }
  return true; // Keep the message channel open for async response
});

// // In content.js (Simplified logic)
// if (document.contentType === 'application/pdf') {
//   // You'll need to inject and use PDF.js to extract text
//   // This is complex, but a well-known problem
//   // See PDF.js examples
//   // For the hackathon, you could start by focusing on non-PDF articles
// } else {
//   const pageText = document.body.innerText;
//   sendResponse({ content: pageText });
// }