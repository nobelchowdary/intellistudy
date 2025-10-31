document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarize-btn');
  const outputDiv = document.getElementById('output');
  const promptForm = document.getElementById('prompt-form');
  const promptInput = document.getElementById('prompt-input');
  const languageSelect = document.getElementById('language-select');
  const summarizeBtnLabel = document.querySelector('#summarize-btn .button__label');
  const promptSubmitButton = document.querySelector('.prompt-submit');
  const promptMenuButton = document.getElementById('prompt-menu-button');
  const promptMenu = document.getElementById('prompt-menu');
  const promptMenuVoice = document.getElementById('prompt-menu-voice');
  const promptMenuUpload = document.getElementById('prompt-menu-upload');
  const promptMenuClearUpload = document.getElementById('prompt-menu-clear-upload');
  const promptFileInput = document.getElementById('prompt-file-input');
  const panelHint = document.querySelector('.panel__hint');
  const promptMenuUploadLabel = document.querySelector('#prompt-menu-upload .prompt-menu__label');
  const promptMenuVoiceLabel = document.querySelector('#prompt-menu-voice .prompt-menu__label');
  const promptMenuClearUploadLabel = document.querySelector('#prompt-menu-clear-upload .prompt-menu__label');
  const cloudToggle = document.getElementById('cloud-toggle');
  const cloudStatus = document.getElementById('cloud-toggle-description');
  const cloudToggleLabel = document.querySelector('.mode-toggle__label');
  let placeholderEl = outputDiv.querySelector('.panel__placeholder');
  let promptMenuOpen = false;
  let defaultPromptPlaceholder = '';
  let resultsPlaceholderText = '';
  const MAX_DOCUMENT_CHARS = 120000;
  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
  const LANGUAGE_CONFIG = {
    en: {
      code: 'en',
      speechRecognition: 'en-US',
      speechSynthesis: 'en-US',
      promptPlaceholder: 'Ask a question about this page',
      promptPlaceholderWithLabel: (label) => `Ask about ${label}`,
      panelHint: 'Tip: Try asking "What are the key takeaways?" after summarizing.',
      summarizeButton: 'Summarize',
      askButton: 'Ask',
      menuUpload: 'Upload document',
      menuVoice: 'Ask with voice',
      menuClearUpload: 'Clear uploaded file',
      languageSelectorLabel: 'Select response language',
      modeToggleLabel: 'Use Gemini 2.5 (cloud)',
      modeToggleActiveLabel: 'Turn off Gemini 2.5 (cloud)',
      modeToggleInactiveLabel: 'Turn on Gemini 2.5 (cloud)',
      modeStatusLocal: 'Using on-device Gemini Nano',
      modeStatusCloud: 'Using Gemini 2.5 in the cloud',
      resultsPlaceholder: 'Results will appear here once IntelliStudy gets to work.',
      thinkingLabel: 'Thinking...',
      summarizingLabel: 'Summarizing...',
      processingFile: (name) => `Processing "${name}"...`,
      readyMessage: (label) => `Ready to answer questions about ${label}.`,
      genericUploadedLabel: 'the uploaded file',
      questionLabel: 'Question',
      answerLabel: 'Answer:',
      summaryPromptIntro: 'Create a focused summary of the following document. Include the three most important takeaways and any critical terms:',
      responseReminder: 'Respond only in English.',
      typeLabels: {
        pdf: 'PDF',
        docx: 'DOCX',
        text: 'Text document',
        default: 'Document'
      },
      truncatedUpload: 'Only the first portion of the file was loaded to stay within the limit.',
      truncatedPdf: 'Loaded the first portion of the PDF to stay within the size limit.',
      clearedUpload: 'Cleared the uploaded file. Questions will use the current page again.',
      voicePreparing: 'Preparing voice input...',
      voiceListening: 'Listening... ask your question now.',
      voiceNoTranscript: 'Sorry, I could not understand the audio. Please try again.',
      voiceUnsupported: 'Speech recognition is not supported in this browser. Please type your question instead.',
      voicePermissionDenied: 'Microphone permission was denied. To turn voice input back on:\n\n1. Open `chrome://settings/content/microphone`.\n2. Under "Not allowed to use your microphone", remove IntelliStudy or set it to **Allow**.\n3. Return to the page, refresh if needed, and try Ask with voice again.',
      voiceError: 'There was an error capturing audio. Please try again.',
      qaError: 'An error occurred while answering your question.',
      summarizerError: 'An error occurred while summarizing the document.',
      fileReadError: 'There was an error reading that file. Please try again with a different file.',
      fileTooLarge: (size) => `Files must be ${size} or smaller.`,
      textFileEmpty: 'The selected file does not contain any readable text.',
      pdfEmpty: 'The selected PDF does not contain extractable text.',
      pdfExtractError: 'Unable to extract text from this PDF. Try another file.',
      docxEmpty: 'The selected DOCX file does not contain readable text.',
      docxExtractError: 'Unable to extract text from this DOCX file. Try another document.',
      unsupportedFile: 'This file type is not supported yet. Try uploading a text document, a PDF, or a DOCX file.',
      pdfNoText: 'This PDF does not expose selectable text.',
      pdfLoadError: 'There was a problem reading the PDF. Try refreshing the page and make sure the file is accessible.',
      pdfBlocked: 'Chrome blocked access to this local PDF. Open the IntelliStudy extension details and enable “Allow access to file URLs”, then reload the file and try again.',
      qaSystemPrompt: 'You are IntelliStudy, a research assistant. Answer questions using only the information inside the provided document. If the answer is not present, say that it is not available in the document. Respond only in English.',
      summarizerSystemPrompt: 'You are IntelliStudy, an expert study assistant. Produce concise study notes that highlight key points, terminology, and action items. Use bullet points when possible. Respond only in English.'
    },
    es: {
      code: 'es',
      speechRecognition: 'es-ES',
      speechSynthesis: 'es-ES',
      promptPlaceholder: 'Haz una pregunta sobre esta página',
      promptPlaceholderWithLabel: (label) => `Pregunta sobre ${label}`,
      panelHint: 'Consejo: Intenta preguntar "¿Cuáles son los puntos clave?" después de resumir.',
      summarizeButton: 'Resumir',
      askButton: 'Preguntar',
      menuUpload: 'Cargar documento',
      menuVoice: 'Preguntar con voz',
      menuClearUpload: 'Quitar archivo cargado',
      languageSelectorLabel: 'Selecciona el idioma de respuesta',
      modeToggleLabel: 'Usar Gemini 2.5 (nube)',
      modeToggleActiveLabel: 'Desactivar Gemini 2.5 (nube)',
      modeToggleInactiveLabel: 'Activar Gemini 2.5 (nube)',
      modeStatusLocal: 'Usando Gemini Nano en el dispositivo',
      modeStatusCloud: 'Usando Gemini 2.5 en la nube',
      resultsPlaceholder: 'Los resultados aparecerán aquí cuando IntelliStudy termine.',
      thinkingLabel: 'Pensando...',
      summarizingLabel: 'Resumiendo...',
      processingFile: (name) => `Procesando "${name}"...`,
      readyMessage: (label) => `Listo para responder preguntas sobre ${label}.`,
      genericUploadedLabel: 'el archivo cargado',
      questionLabel: 'Pregunta',
      answerLabel: 'Respuesta:',
      summaryPromptIntro: 'Crea un resumen enfocado del siguiente documento. Incluye los tres puntos más importantes y cualquier término clave:',
      responseReminder: 'Responde únicamente en español.',
      typeLabels: {
        pdf: 'PDF',
        docx: 'DOCX',
        text: 'Documento de texto',
        default: 'Documento'
      },
      truncatedUpload: 'Solo se cargó la primera parte del archivo para mantenernos dentro del límite.',
      truncatedPdf: 'Se cargó la primera parte del PDF para permanecer dentro del límite de tamaño.',
      clearedUpload: 'Se eliminó el archivo cargado. Las preguntas usarán la página actual nuevamente.',
      voicePreparing: 'Preparando la entrada de voz...',
      voiceListening: 'Escuchando... haz tu pregunta ahora.',
      voiceNoTranscript: 'Lo siento, no pude entender el audio. Inténtalo de nuevo.',
      voiceUnsupported: 'El reconocimiento de voz no es compatible con este navegador. Por favor escribe tu pregunta.',
      voicePermissionDenied: 'Se denegó el permiso del micrófono. Para volver a activar la entrada de voz:\n\n1. Abre `chrome://settings/content/microphone`.\n2. En "No se permite usar tu micrófono", elimina IntelliStudy o configúralo en **Permitir**.\n3. Regresa a la página, actualiza si es necesario e intenta nuevamente con Preguntar con voz.',
      voiceError: 'Ocurrió un error al capturar el audio. Inténtalo de nuevo.',
      qaError: 'Ocurrió un error al responder tu pregunta.',
      summarizerError: 'Ocurrió un error al resumir el documento.',
      fileReadError: 'Hubo un error al leer ese archivo. Intenta con un archivo diferente.',
      fileTooLarge: (size) => `Los archivos deben ser de ${size} o menos.`,
      textFileEmpty: 'El archivo seleccionado no contiene texto legible.',
      pdfEmpty: 'El PDF seleccionado no contiene texto extraíble.',
      pdfExtractError: 'No se pudo extraer texto de este PDF. Intenta con otro archivo.',
      docxEmpty: 'El archivo DOCX seleccionado no contiene texto legible.',
      docxExtractError: 'No se pudo extraer texto de este archivo DOCX. Intenta con otro documento.',
      unsupportedFile: 'Este tipo de archivo aún no es compatible. Intenta cargar un documento de texto, un PDF o un DOCX.',
      pdfNoText: 'Este PDF no expone texto seleccionable.',
      pdfLoadError: 'Hubo un problema al leer el PDF. Actualiza la página y asegúrate de que el archivo sea accesible.',
      pdfBlocked: 'Chrome bloqueó el acceso a este PDF local. Abre los detalles de la extensión IntelliStudy y habilita “Permitir acceso a URLs de archivos”, luego recarga el archivo e inténtalo de nuevo.',
      qaSystemPrompt: 'Eres IntelliStudy, un asistente de investigación. Responde las preguntas usando solo la información del documento proporcionado. Si la respuesta no está presente, indica que no está disponible en el documento. Responde únicamente en español.',
      summarizerSystemPrompt: 'Eres IntelliStudy, un asistente de estudio experto. Produce notas de estudio concisas que destaquen puntos clave, terminología y acciones. Usa viñetas cuando sea posible. Responde únicamente en español.'
    }
  };

  const SUPPORTED_TEXT_EXTENSIONS = new Set([
    'txt',
    'md',
    'markdown',
    'mdown',
    'json',
    'csv',
    'tsv',
    'html',
    'htm',
    'xml',
    'yaml',
    'yml',
    'log'
  ]);
  const SUPPORTED_TEXT_MIME_PREFIXES = ['text/'];
  const SUPPORTED_TEXT_MIME_TYPES = new Set([
    'application/json',
    'application/xml',
    'application/javascript',
    'application/sql',
    'application/yaml',
    'application/xhtml+xml'
  ]);
  const PDF_MIME_TYPES = new Set(['application/pdf']);
  const DOCX_MIME_TYPES = new Set([
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]);
  let activeLanguage = languageSelect?.value ?? 'en';
  let uploadedDocument = null;
  let pdfModulePromise = null;
  const UTF8_DECODER = new TextDecoder('utf-8');
  let useCloudModel = false;
  const CLOUD_MODEL_CONFIG = {
    model: 'gemini-2.5-flash-lite',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    apiKey: 'AIzaSyDqr6YWuN-neygN1JkD-CRcAzJiQiDHEOE'
  };

  function getLanguageSettings(lang = activeLanguage) {
    return LANGUAGE_CONFIG[lang] ?? LANGUAGE_CONFIG.en;
  }

  function updateModeStatusText() {
    const settings = getLanguageSettings();

    if (cloudToggleLabel) {
      cloudToggleLabel.textContent = settings.modeToggleLabel;
    }

    if (cloudToggle) {
      cloudToggle.checked = useCloudModel;
      cloudToggle.setAttribute(
        'aria-label',
        useCloudModel ? settings.modeToggleActiveLabel : settings.modeToggleInactiveLabel
      );
      cloudToggle.setAttribute(
        'title',
        useCloudModel ? settings.modeToggleActiveLabel : settings.modeToggleInactiveLabel
      );
    }

    if (cloudStatus) {
      cloudStatus.textContent = useCloudModel ? settings.modeStatusCloud : settings.modeStatusLocal;
    }
  }

  function updateLanguageUi() {
    const settings = getLanguageSettings();
    defaultPromptPlaceholder = settings.promptPlaceholder;
    resultsPlaceholderText = settings.resultsPlaceholder;

    if (summarizeBtn) {
      summarizeBtn.setAttribute('aria-label', settings.summarizeButton);

      if (summarizeBtnLabel) {
        summarizeBtnLabel.textContent = settings.summarizeButton;
      }
    }

    if (panelHint) {
      panelHint.textContent = settings.panelHint;
    }

    if (promptSubmitButton) {
      promptSubmitButton.textContent = settings.askButton;
      promptSubmitButton.setAttribute('aria-label', settings.askButton);
    }

    if (promptMenuUploadLabel) {
      promptMenuUploadLabel.textContent = settings.menuUpload;
    }

    if (promptMenuVoiceLabel) {
      promptMenuVoiceLabel.textContent = settings.menuVoice;
    }

    if (promptMenuClearUploadLabel) {
      promptMenuClearUploadLabel.textContent = settings.menuClearUpload;
    }

    if (placeholderEl) {
      placeholderEl.textContent = resultsPlaceholderText;
    }

    if (promptInput) {
      promptInput.setAttribute('aria-label', settings.promptPlaceholder);
    }

    updatePromptPlaceholder();

    if (languageSelect && languageSelect.value !== activeLanguage) {
      languageSelect.value = activeLanguage;
    }

    if (languageSelect) {
      languageSelect.setAttribute('aria-label', settings.languageSelectorLabel);
      languageSelect.setAttribute('title', settings.languageSelectorLabel);
    }

    updateModeStatusText();
  }

  function setUseCloudModel(value, { announce = false } = {}) {
    useCloudModel = Boolean(value);
    updateModeStatusText();

    if (chrome?.storage?.local?.set) {
      chrome.storage.local.set({ useCloudModel });
    }

    if (announce) {
      const settings = getLanguageSettings();
      setOutput(useCloudModel ? settings.modeStatusCloud : settings.modeStatusLocal, {
        variant: 'status',
        transient: true
      });
    }
  }

  async function ensureCloudInitialized() {
    return true;
  }

  async function callCloudGenerativeModel(prompt, { modelId } = {}) {
    const targetModelId = modelId ?? CLOUD_MODEL_CONFIG.model;
    const url = `${CLOUD_MODEL_CONFIG.endpoint}/${encodeURIComponent(targetModelId)}:generateContent?key=${encodeURIComponent(CLOUD_MODEL_CONFIG.apiKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': CLOUD_MODEL_CONFIG.apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      let message = response.statusText || 'Unknown error';

      try {
        const errorData = await response.json();
        message = errorData?.error?.message ?? message;
      } catch (error) {
        // Ignore JSON parse failures.
      }

      throw new Error(message);
    }

    const data = await response.json();
    const candidates = data?.candidates ?? [];

    for (const candidate of candidates) {
      const parts = candidate?.content?.parts ?? [];
      const text = parts
        .map((part) => (typeof part?.text === 'string' ? part.text : ''))
        .filter((value) => value.length > 0)
        .join('\n')
        .trim();

      if (text) {
        return text;
      }
    }

    throw new Error('Gemini returned an empty response.');
  }

  function initializeModePreference() {
    return new Promise((resolve) => {
      if (!chrome?.storage?.local?.get) {
        updateModeStatusText();
        resolve();
        return;
      }

      chrome.storage.local.get({ useCloudModel: false }, (data) => {
        useCloudModel = Boolean(data?.useCloudModel);
        updateModeStatusText();
        if (useCloudModel) {
          ensureCloudInitialized().catch((error) => {
            console.error('Failed to initialize cloud mode:', error);
            setUseCloudModel(false, { announce: false });
            const settings = getLanguageSettings();
            const message = error instanceof Error && error.message
              ? `Could not enable Gemini 2.5 in the cloud: ${error.message}`
              : 'Could not enable Gemini 2.5 in the cloud. Please try again later.';
            setOutput(message, {
              variant: 'error',
              transient: true,
              transientDelay: 4500
            });
          });
        }
        resolve();
      });
    });
  }

  function formatFileSize(bytes) {
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }

    return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[index]}`;
  }

  function truncateLabel(value, maxLength = 48) {
    if (!value || value.length <= maxLength) {
      return value;
    }

    const segment = Math.floor((maxLength - 3) / 2);
    return `${value.slice(0, segment)}...${value.slice(-segment)}`;
  }

  function updateUploadMenuState() {
    if (!promptMenuClearUpload) {
      return;
    }

    promptMenuClearUpload.hidden = !uploadedDocument;
  }

  function isPdfUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    if (url.startsWith('chrome-extension://')) {
      return false;
    }

    const normalized = url.split('#')[0]?.split('?')[0] ?? url;
    return normalized.toLowerCase().endsWith('.pdf');
  }

  function getPdfViewerSource(url) {
    if (!url || !url.startsWith('chrome-extension://')) {
      return null;
    }

    try {
      const parsed = new URL(url);

      let sourceParam = null;

      if (parsed.searchParams.has('src')) {
        sourceParam = parsed.searchParams.get('src');
      } else if (parsed.searchParams.has('file')) {
        sourceParam = parsed.searchParams.get('file');
      }

      if (!sourceParam) {
        return null;
      }

      const decoded = decodeURIComponent(sourceParam);

      if (isPdfUrl(decoded) || decoded.startsWith('http://') || decoded.startsWith('https://') || decoded.startsWith('file://')) {
        return decoded;
      }

      return null;
    } catch (error) {
      console.error('Error parsing PDF viewer URL:', error);
      return null;
    }
  }

  async function fetchPdfContent(url, entry) {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'fetchPdfContent', url });

      if (response?.error) {
        setOutput(response.error, { entry, variant: 'error', transient: true, transientDelay: 4500 });
        return null;
      }

      const pdfText = response?.content?.trim?.() ?? '';

      if (!pdfText) {
        setOutput(getLanguageSettings().pdfNoText, { entry, variant: 'error', transient: true });
        return null;
      }

      const truncated = pdfText.length > MAX_DOCUMENT_CHARS;
      const content = truncated ? pdfText.slice(0, MAX_DOCUMENT_CHARS) : pdfText;

      if (truncated) {
        setOutput(getLanguageSettings().truncatedPdf, {
          variant: 'status',
          transient: true
        });
      }

      return content;
    } catch (error) {
      console.error('Error fetching PDF content:', error);
      const message = url.startsWith('file://')
        ? getLanguageSettings().pdfBlocked
        : getLanguageSettings().pdfLoadError;

      setOutput(message, {
        entry,
        variant: 'error',
        transient: true,
        transientDelay: 5500
      });
      return null;
    }
  }

  function getUploadedLabel() {
    if (!uploadedDocument) {
      return null;
    }

    const rawLabel = uploadedDocument.shortName ?? uploadedDocument.name;

    if (rawLabel && rawLabel.trim().length > 0) {
      return rawLabel.trim();
    }

    return getLanguageSettings().genericUploadedLabel;
  }

  function getUploadedTypeLabel() {
    if (!uploadedDocument) {
      return null;
    }

    const typeLabels = getLanguageSettings().typeLabels;

    switch (uploadedDocument.category) {
      case 'pdf':
        return typeLabels.pdf;
      case 'docx':
        return typeLabels.docx;
      case 'text':
        return typeLabels.text;
      default:
        return uploadedDocument.type || typeLabels.default;
    }
  }

  function updatePromptPlaceholder() {
    if (!promptInput) {
      return;
    }

    if (uploadedDocument) {
      const label = getUploadedLabel();
      const settings = getLanguageSettings();
      const localized = settings.promptPlaceholderWithLabel(label);
      promptInput.placeholder = localized;
      return;
    }

    const settings = getLanguageSettings();
    promptInput.placeholder = settings.promptPlaceholder;
  }

  function clearUploadedDocument({ announce = true } = {}) {
    if (!uploadedDocument) {
      return;
    }

    uploadedDocument = null;
    updatePromptPlaceholder();
    updateUploadMenuState();
    promptInput?.focus();

    if (announce) {
      setOutput(getLanguageSettings().clearedUpload, {
        variant: 'status',
        transient: true
      });
    }
  }

  function getFileExtension(file) {
    return file?.name?.split('.').pop()?.toLowerCase() ?? '';
  }

  function isSupportedTextFile(file) {
    if (!file) {
      return false;
    }

    if (file.type && SUPPORTED_TEXT_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      return true;
    }

    if (file.type && SUPPORTED_TEXT_MIME_TYPES.has(file.type)) {
      return true;
    }

    const extension = getFileExtension(file);

    if (extension && SUPPORTED_TEXT_EXTENSIONS.has(extension)) {
      return true;
    }

    return false;
  }

  function isPdfFile(file) {
    if (!file) {
      return false;
    }

    if (file.type && PDF_MIME_TYPES.has(file.type)) {
      return true;
    }

    return getFileExtension(file) === 'pdf';
  }

  function isDocxFile(file) {
    if (!file) {
      return false;
    }

    if (file.type && DOCX_MIME_TYPES.has(file.type)) {
      return true;
    }

    return getFileExtension(file) === 'docx';
  }

  async function loadPdfModule() {
    if (!pdfModulePromise) {
      pdfModulePromise = import(chrome.runtime.getURL('pdfjs/pdf.min.mjs'))
        .then((module) => {
          if (module?.GlobalWorkerOptions) {
            module.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs/pdf.worker.min.mjs');
          }

          return module;
        })
        .catch((error) => {
          console.error('Failed to load pdf.js module:', error);
          throw new Error('Unable to load the PDF parser.');
        });
    }

    return pdfModulePromise;
  }

  async function extractPdfTextFromArrayBuffer(buffer) {
    const module = await loadPdfModule();
    const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const loadingTask = module.getDocument({
      data: uint8,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,
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
      await loadingTask.destroy();
      return parts.join('\n\n');
    } catch (error) {
      await loadingTask.destroy();
      throw error;
    }
  }

  function concatUint8Arrays(chunks, totalLength) {
    const result = new Uint8Array(totalLength);
    let offset = 0;

    chunks.forEach((chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });

    return result;
  }

  async function inflateDeflateRaw(data) {
    if (typeof DecompressionStream !== 'function') {
      throw new Error('DOCX extraction is not supported in this browser.');
    }

    const stream = new DecompressionStream('deflate');
    const writer = stream.writable.getWriter();
    await writer.write(data);
    await writer.close();

    const reader = stream.readable.getReader();
    const chunks = [];
    let totalLength = 0;

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      if (value) {
        const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
        chunks.push(chunk);
        totalLength += chunk.length;
      }
    }

    return concatUint8Arrays(chunks, totalLength);
  }

  function findEndOfCentralDirectory(dataView) {
    for (let offset = dataView.byteLength - 22; offset >= 0; offset -= 1) {
      if (dataView.getUint32(offset, true) === 0x06054b50) {
        return offset;
      }
    }

    return -1;
  }

  async function extractDocxDocumentXml(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = UTF8_DECODER;
    const eocdOffset = findEndOfCentralDirectory(dataView);

    if (eocdOffset < 0) {
      throw new Error('Invalid DOCX file structure.');
    }

    const centralDirectoryOffset = dataView.getUint32(eocdOffset + 16, true);
    let offset = centralDirectoryOffset;
    let entry = null;

    while (offset >= 0 && offset + 46 <= bytes.length) {
      const signature = dataView.getUint32(offset, true);

      if (signature !== 0x02014b50) {
        break;
      }

      const compression = dataView.getUint16(offset + 10, true);
      const compressedSize = dataView.getUint32(offset + 20, true);
      const fileNameLength = dataView.getUint16(offset + 28, true);
      const extraLength = dataView.getUint16(offset + 30, true);
      const commentLength = dataView.getUint16(offset + 32, true);
      const localHeaderOffset = dataView.getUint32(offset + 42, true);
      const fileNameBytes = bytes.subarray(offset + 46, offset + 46 + fileNameLength);
      const fileName = decoder.decode(fileNameBytes);

      if (fileName === 'word/document.xml') {
        entry = {
          compression,
          compressedSize,
          localHeaderOffset
        };
        break;
      }

      offset += 46 + fileNameLength + extraLength + commentLength;
    }

    if (!entry) {
      throw new Error('The DOCX file does not contain readable document content.');
    }

    const localHeaderOffset = entry.localHeaderOffset;

    if (localHeaderOffset < 0 || localHeaderOffset + 30 > bytes.length) {
      throw new Error('The DOCX file is corrupted.');
    }

    if (dataView.getUint32(localHeaderOffset, true) !== 0x04034b50) {
      throw new Error('Invalid DOCX local file header.');
    }

    const nameLength = dataView.getUint16(localHeaderOffset + 26, true);
    const extraFieldLength = dataView.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + nameLength + extraFieldLength;
    const compressedSize = entry.compressedSize;

    if (compressedSize <= 0 || dataStart + compressedSize > bytes.length) {
      throw new Error('Invalid DOCX data segment.');
    }

    const compressedData = bytes.subarray(dataStart, dataStart + compressedSize);

    if (entry.compression === 0) {
      return decoder.decode(compressedData);
    }

    if (entry.compression !== 8) {
      throw new Error('Unsupported DOCX compression method.');
    }

    const inflated = await inflateDeflateRaw(compressedData);
    return decoder.decode(inflated);
  }

  function collectDocxParagraphText(node, parts) {
    if (!node) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue) {
        parts.push(node.nodeValue);
      }
      return;
    }

    const localName = node.localName || '';

    if (localName === 't') {
      if (node.textContent) {
        parts.push(node.textContent);
      }
      return;
    }

    if (localName === 'tab') {
      parts.push('\t');
      return;
    }

    if (localName === 'br' || localName === 'cr') {
      parts.push('\n');
      return;
    }

    Array.from(node.childNodes ?? []).forEach((child) => collectDocxParagraphText(child, parts));
  }

  function parseDocxXmlToPlainText(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Unable to parse the DOCX contents.');
    }

    const paragraphs = Array.from(xmlDoc.getElementsByTagName('w:p'));

    if (paragraphs.length === 0) {
      return (xmlDoc.textContent ?? '').trim();
    }

    const lines = paragraphs
      .map((paragraph) => {
        const parts = [];
        collectDocxParagraphText(paragraph, parts);
        const rawText = parts.join('');
        const normalized = rawText
          .replace(/\r/g, '')
          .split('\n')
          .map((segment) => segment.replace(/\s+/g, ' ').trim())
          .filter((segment) => segment.length > 0)
          .join('\n');

        return normalized.length > 0 ? normalized : null;
      })
      .filter(Boolean);

    if (lines.length === 0) {
      return (xmlDoc.textContent ?? '').trim();
    }

    return lines.join('\n\n');
  }

  async function extractDocxText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const xmlString = await extractDocxDocumentXml(arrayBuffer);
    const text = parseDocxXmlToPlainText(xmlString);

    if (!text || text.trim().length === 0) {
      throw new Error('The DOCX file does not contain readable text.');
    }

    return text;
  }

  async function buildDocumentContextFromFile(file) {
    if (!file) {
      return null;
    }

    const settings = getLanguageSettings();

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { error: settings.fileTooLarge(formatFileSize(MAX_FILE_SIZE_BYTES)) };
    }

    if (isPdfFile(file)) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const rawText = await extractPdfTextFromArrayBuffer(arrayBuffer);
        const trimmed = rawText.trim();

        if (trimmed.length === 0) {
          return { error: settings.pdfEmpty };
        }

        const truncated = trimmed.length > MAX_DOCUMENT_CHARS;
        const content = truncated ? trimmed.slice(0, MAX_DOCUMENT_CHARS) : trimmed;

        return {
          content,
          displayName: file.name,
          type: file.type || 'application/pdf',
          size: file.size,
          contextLabel: 'Uploaded PDF',
          truncated,
          category: 'pdf'
        };
      } catch (error) {
        console.error('Error extracting PDF text:', error);
        return { error: settings.pdfExtractError };
      }
    }

    if (isDocxFile(file)) {
      try {
        const rawText = await extractDocxText(file);
        const trimmed = rawText.trim();

        if (trimmed.length === 0) {
          return { error: settings.docxEmpty };
        }

        const truncated = trimmed.length > MAX_DOCUMENT_CHARS;
        const content = truncated ? trimmed.slice(0, MAX_DOCUMENT_CHARS) : trimmed;

        return {
          content,
          displayName: file.name,
          type: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: file.size,
          contextLabel: 'Uploaded DOCX',
          truncated,
          category: 'docx'
        };
      } catch (error) {
        console.error('Error extracting DOCX text:', error);
        return { error: settings.docxExtractError };
      }
    }

    if (isSupportedTextFile(file)) {
      const text = await file.text();
      const trimmed = text.trim();

      if (trimmed.length === 0) {
        return { error: settings.textFileEmpty };
      }

      const truncated = trimmed.length > MAX_DOCUMENT_CHARS;
      const content = truncated ? trimmed.slice(0, MAX_DOCUMENT_CHARS) : trimmed;

      return {
        content,
        displayName: file.name,
        type: file.type || 'text/plain',
        size: file.size,
        contextLabel: 'Uploaded document',
        truncated,
        category: 'text'
      };
    }

    return {
      error: settings.unsupportedFile
    };
  }

  async function handleFileSelection(file) {
    if (!file) {
      return;
    }

    const settings = getLanguageSettings();
    const entry = setOutput(settings.processingFile(file.name), { variant: 'status' });

    try {
      const result = await buildDocumentContextFromFile(file);

      if (!result) {
        if (entry?.isConnected) {
          entry.remove();
        }
        createPlaceholder();
        return;
      }

      if (result.error) {
        setOutput(result.error, { entry, variant: 'error', transient: true });
        return;
      }

      uploadedDocument = {
        name: result.displayName,
        shortName: truncateLabel(result.displayName, 42),
        type: result.type,
        size: result.size,
        content: result.content,
        contextLabel: result.contextLabel,
        truncated: result.truncated ?? false,
        category: result.category ?? 'text'
      };

      updatePromptPlaceholder();
      updateUploadMenuState();

      const label = getUploadedLabel();
      const readyMessage = settings.readyMessage(label);
      const messages = [readyMessage];

      if (uploadedDocument.truncated) {
        messages.push(settings.truncatedUpload);
      }

      setOutput(messages.join(' '), { entry, variant: 'status' });
      promptInput?.focus();
    } catch (error) {
      console.error('Error reading uploaded file:', error);
      const message = error instanceof Error && error.message
        ? error.message
        : settings.fileReadError;
      setOutput(message, {
        entry,
        variant: 'error',
        transient: true
      });
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderInlineMarkdown(text) {
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function markdownToHtml(markdown) {
    const lines = markdown.split(/\r?\n/);
    const parts = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length === 0) {
        return;
      }

      parts.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join('')}</ul>`);
      listItems = [];
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.length === 0) {
        flushList();
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        parts.push(`<h3>${renderInlineMarkdown(trimmed.slice(4))}</h3>`);
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        parts.push(`<h2>${renderInlineMarkdown(trimmed.slice(3))}</h2>`);
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushList();
        parts.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`);
        return;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        listItems.push(renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, '')));
        return;
      }

      flushList();
      parts.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
    });

    flushList();

    return parts.join('\n');
  }

  function applyVariant(entry, variant) {
    if (!variant) {
      return;
    }

    entry.classList.remove(
      'output-entry--response',
      'output-entry--prompt',
      'output-entry--status',
      'output-entry--error'
    );
    entry.classList.add(`output-entry--${variant}`);
  }

  function createPlaceholder() {
    if (placeholderEl || outputDiv.querySelector('.output-entry')) {
      return;
    }

    placeholderEl = document.createElement('div');
    placeholderEl.className = 'panel__placeholder';
    placeholderEl.textContent = resultsPlaceholderText;
    outputDiv.appendChild(placeholderEl);
  }

  function createOutputEntry(variant = 'response') {
    const entry = document.createElement('article');
    entry.className = 'output-entry';
    applyVariant(entry, variant);
    outputDiv.appendChild(entry);

    if (placeholderEl) {
      placeholderEl.remove();
      placeholderEl = null;
    }

    return entry;
  }

  function openPromptMenu() {
    if (!promptMenu || !promptMenuButton) {
      return;
    }

    promptMenu.classList.add('prompt-menu--open');
    promptMenuButton.setAttribute('aria-expanded', 'true');
    promptMenuOpen = true;
  }

  function closePromptMenu() {
    if (!promptMenu || !promptMenuButton) {
      return;
    }

    promptMenu.classList.remove('prompt-menu--open');
    promptMenuButton.setAttribute('aria-expanded', 'false');
    promptMenuOpen = false;
  }

  function togglePromptMenu() {
    if (promptMenuOpen) {
      closePromptMenu();
    } else {
      openPromptMenu();
    }
  }

  function setOutput(content, options = {}) {
    const {
      markdown = false,
      entry = null,
      variant = null,
      transient = false,
      transientDelay
    } = options;
    const target = entry ?? createOutputEntry(variant ?? 'response');

    if (variant && entry) {
      applyVariant(target, variant);
    }

    if (target._transientTimer) {
      clearTimeout(target._transientTimer);
      target._transientTimer = null;
    }

    if (target._transientCleanup) {
      clearTimeout(target._transientCleanup);
      target._transientCleanup = null;
    }

    if (target._transientCleanupHandler) {
      target.removeEventListener('transitionend', target._transientCleanupHandler);
      target.removeEventListener('animationend', target._transientCleanupHandler);
      target._transientCleanupHandler = null;
    }

    target.classList.remove('output-entry--fade-out');

    if (markdown) {
      target.innerHTML = markdownToHtml(content);
    } else {
      target.textContent = content;
    }

    outputDiv.scrollTop = outputDiv.scrollHeight;

    if (transient) {
      const delay = typeof transient === 'number' ? transient : (transientDelay ?? 3200);

      target._transientTimer = setTimeout(() => {
        target._transientTimer = null;

        if (!target.isConnected) {
          return;
        }

        target.classList.add('output-entry--fade-out');

        const removeEntry = () => {
          if (target._transientCleanup) {
            clearTimeout(target._transientCleanup);
            target._transientCleanup = null;
          }

          target.removeEventListener('transitionend', cleanup);
          target.removeEventListener('animationend', cleanup);
          target._transientCleanupHandler = null;

          if (target.isConnected) {
            target.remove();
          }

          if (!outputDiv.querySelector('.output-entry')) {
            createPlaceholder();
          }
        };

        const cleanup = () => {
          target.removeEventListener('transitionend', cleanup);
          target.removeEventListener('animationend', cleanup);
          removeEntry();
        };

        target.addEventListener('transitionend', cleanup);
        target.addEventListener('animationend', cleanup);
        target._transientCleanupHandler = cleanup;

        target._transientCleanup = setTimeout(() => {
          target._transientCleanup = null;
          removeEntry();
        }, 400);
      }, delay);
    }

    return target;
  }

  async function processQuestion(question, options = {}) {
    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length === 0) {
      return null;
    }

    const entry = options.entry ?? null;
    const language = options.language ?? activeLanguage;
    const languageSettings = getLanguageSettings(language);
    const hasDocumentContext = typeof options.documentText === 'string' && options.documentText.length > 0;
    const documentType = options.documentType ?? null;

    if (!useCloudModel && !options.skipEnsure) {
      if (!await ensureLanguageModel(entry)) {
        return null;
      }
    }

    let sourceText;

    if (hasDocumentContext) {
      sourceText = options.documentText;
    } else {
      sourceText = options.pageText ?? await getPageContent(entry);
    }

    if (!sourceText) {
      return null;
    }

    const contextLabel = options.contextLabel ?? (hasDocumentContext ? 'Uploaded document' : 'Document');
    const headerName = options.documentName && options.documentName.trim().length > 0
      ? options.documentName.trim()
      : null;
    const header = headerName ? `${contextLabel} (${headerName})` : contextLabel;
    const docTypeLabel = documentType ? `Document type: ${documentType}` : null;
    const promptSections = [header];

    if (docTypeLabel) {
      promptSections.push(docTypeLabel);
    }

    promptSections.push('', sourceText, '', `${languageSettings.questionLabel}: ${trimmedQuestion}`);

    if (languageSettings.responseReminder) {
      promptSections.push('', languageSettings.responseReminder);
    }

    promptSections.push('', languageSettings.answerLabel);

    if (useCloudModel) {
      const cloudPrompt = [languageSettings.qaSystemPrompt, '', ...promptSections].join('\n');
      const cloudResponse = await callCloudGenerativeModel(cloudPrompt);
      return cloudResponse.trim();
    }

    let qaSession;

    try {
      qaSession = await LanguageModel.create({
        systemPrompt: languageSettings.qaSystemPrompt
      });

      const response = await qaSession.prompt(promptSections.join('\n'));

      return response.trim();
    } finally {
      if (qaSession && typeof qaSession.destroy === 'function') {
        await qaSession.destroy();
      }
    }
  }

  async function ensureLanguageModel(entry) {
    if (typeof window.LanguageModel?.create !== 'function') {
      setOutput(
        'This Chrome build does not expose the LanguageModel API. Make sure you are using the Early Preview build with the required flags enabled.',
        { entry, variant: 'error', transient: true }
      );
      return false;
    }

    if (typeof LanguageModel.available === 'function') {
      try {
        const status = await LanguageModel.available();

        if (status !== 'available') {
          setOutput(
            'The on-device model is not ready yet. Keep Chrome open while it finishes downloading and try again.',
            { entry, variant: 'error', transient: true }
          );
          return false;
        }
      } catch (error) {
        console.error('Error checking LanguageModel availability:', error);
        setOutput(
          'Error checking LanguageModel availability. Verify that the Built-in AI preview is enabled for this profile.',
          { entry, variant: 'error', transient: true }
        );
        return false;
      }
    }

    return true;
  }

  async function getPageContent(entry) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab) {
        setOutput('Error: Could not find the active tab.', { entry, variant: 'error', transient: true });
        return null;
      }

      const viewerPdfUrl = getPdfViewerSource(tab.url);

      if (viewerPdfUrl) {
        return await fetchPdfContent(viewerPdfUrl, entry);
      }

      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        setOutput(
          'Chrome restricts extensions from reading this type of page. Try IntelliStudy on a regular web page or a PDF opened in the system viewer.',
          { entry, variant: 'error', transient: true }
        );
        return null;
      }

      if (tab.url.startsWith('https://chrome.google.com/webstore')) {
        setOutput(
          'Chrome does not allow extensions to access the Chrome Web Store content.',
          { entry, variant: 'error', transient: true }
        );
        return null;
      }

      if (isPdfUrl(tab.url)) {
        return await fetchPdfContent(tab.url, entry);
      }

      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });

      if (response?.content) {
        const trimmed = response.content.trim();

        if (trimmed.length === 0) {
          setOutput(
            'This page does not expose readable text. Try selecting the text first or open the article in reader view.',
            { entry, variant: 'error', transient: true }
          );
          return null;
        }

        return trimmed;
      }

      setOutput(
        'Error: Could not read the page content. Click the puzzle icon in Chrome and allow IntelliStudy to read this site, then try again.',
        { entry, variant: 'error', transient: true }
      );
      return null;
    } catch (error) {
      console.error('Error getting page content:', error);

      const lastError = chrome.runtime.lastError?.message || '';

      if (lastError.includes('Could not establish connection')) {
        setOutput(
          'IntelliStudy does not have permission to run on this site yet. Click the puzzle icon → IntelliStudy → Allow access on this site, then retry.',
          { entry, variant: 'error', transient: true }
        );
      } else if (lastError.includes('Receiving end does not exist')) {
        setOutput('The content script is not injected into this page. Refresh the tab and try again.', { entry, variant: 'error', transient: true });
      } else {
        setOutput('Error getting page content. Reload the extension and try again.', { entry, variant: 'error', transient: true });
      }

      return null;
    }
  }

  async function startVoiceCapture() {
    const languageForRequest = activeLanguage;
    const languageSettings = getLanguageSettings(languageForRequest);
    const entry = setOutput(languageSettings.voicePreparing, { variant: 'status' });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOutput(languageSettings.voiceUnsupported, {
        entry,
        variant: 'error',
        transient: true
      });
      return;
    }

    if (!useCloudModel) {
      if (!await ensureLanguageModel(entry)) {
        if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
          entry.remove();
          createPlaceholder();
        }
        return;
      }
    }

    const documentText = uploadedDocument?.content ?? null;
    const documentName = uploadedDocument?.name ?? null;
    const documentContextLabel = uploadedDocument?.contextLabel ?? null;
    let pageText = null;

    if (!documentText) {
      pageText = await getPageContent(entry);

      if (!pageText) {
        if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
          entry.remove();
          createPlaceholder();
        }
        return;
      }
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = languageSettings.speechRecognition;

    setOutput(languageSettings.voiceListening, { entry, variant: 'status' });

    recognizer.start();

    recognizer.onresult = async (event) => {
      recognizer.stop();

      const transcript = event.results?.[0]?.[0]?.transcript?.trim();

      if (!transcript) {
        setOutput(languageSettings.voiceNoTranscript, {
          entry,
          variant: 'error',
          transient: true
        });
        return;
      }

      setOutput(transcript, { variant: 'prompt' });
      outputDiv.appendChild(entry);
      setOutput(languageSettings.thinkingLabel, { entry, variant: 'status' });

      try {
        const answer = await processQuestion(transcript, {
          skipEnsure: true,
          pageText,
          entry,
          documentText,
          documentName,
          contextLabel: documentContextLabel,
          documentType: getUploadedTypeLabel(),
          language: languageForRequest
        });

        if (answer == null) {
          if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
            entry.remove();
            createPlaceholder();
          }
          return;
        }

        setOutput(answer, { markdown: true, entry, variant: 'response' });
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.lang = languageSettings.speechSynthesis;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error during Q&A:', error);
        const errorMessage = error instanceof Error && error.message
          ? `${languageSettings.qaError} (${error.message})`
          : languageSettings.qaError;
        setOutput(errorMessage, {
          entry,
          variant: 'error',
          transient: true
        });
      }
    };

    recognizer.onerror = (event) => {
      recognizer.stop();

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setOutput(languageSettings.voicePermissionDenied, {
          markdown: true,
          entry,
          variant: 'error',
          transient: true,
          transientDelay: 4500
        });
        return;
      }

      setOutput(languageSettings.voiceError, {
        entry,
        variant: 'error',
        transient: true
      });
    };
  }

  updateModeStatusText();

  initializeModePreference().then(() => {
    updateLanguageUi();
    updatePromptPlaceholder();
    updateUploadMenuState();
  });

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      const value = event.target.value || 'en';
      activeLanguage = value;
      updateLanguageUi();
      updateUploadMenuState();
    });
  }

  if (cloudToggle) {
    cloudToggle.addEventListener('change', async (event) => {
      const checked = Boolean(event.target.checked);
      const settings = getLanguageSettings();

      if (checked) {
        try {
          await ensureCloudInitialized();
          setUseCloudModel(true, { announce: true });
        } catch (error) {
          console.error('Failed to enable cloud mode:', error);
          setUseCloudModel(false, { announce: false });
          cloudToggle.checked = false;
          const message = error instanceof Error && error.message
            ? `Could not enable Gemini 2.5 in the cloud: ${error.message}`
            : 'Could not enable Gemini 2.5 in the cloud. Please try again later.';
          setOutput(message, {
            variant: 'error',
            transient: true,
            transientDelay: 4500
          });
        }
      } else {
        setUseCloudModel(false, { announce: true });
      }
    });
  }

  summarizeBtn.addEventListener('click', async () => {
    const languageSettings = getLanguageSettings();
    const entry = setOutput(languageSettings.summarizingLabel, { variant: 'status' });

    if (!useCloudModel) {
      if (!await ensureLanguageModel(entry)) {
        if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
          entry.remove();
          createPlaceholder();
        }
        return;
      }
    }

    const pageText = await getPageContent(entry);

    if (!pageText) {
      if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
        entry.remove();
        createPlaceholder();
      }
      return;
    }

    if (useCloudModel) {
      try {
        const promptText = `${languageSettings.summarizerSystemPrompt}\n\n${languageSettings.summaryPromptIntro}\n\n${pageText}`;
        const summary = await callCloudGenerativeModel(promptText);
        setOutput(summary.trim(), { markdown: true, entry, variant: 'response' });
      } catch (error) {
        console.error('Error during summarization:', error);
        const errorMessage = error instanceof Error && error.message
          ? `${languageSettings.summarizerError} (${error.message})`
          : languageSettings.summarizerError;
        setOutput(errorMessage, {
          entry,
          variant: 'error',
          transient: true
        });
      }
      return;
    }

    try {
      const summarizerSession = await LanguageModel.create({
        systemPrompt: languageSettings.summarizerSystemPrompt
      });

      const response = await summarizerSession.prompt(`${languageSettings.summaryPromptIntro}

${pageText}`);

      setOutput(response.trim(), { markdown: true, entry, variant: 'response' });

      if (typeof summarizerSession.destroy === 'function') {
        await summarizerSession.destroy();
      }
    } catch (error) {
      console.error('Error during summarization:', error);
      const errorMessage = error instanceof Error && error.message
        ? `${languageSettings.summarizerError} (${error.message})`
        : languageSettings.summarizerError;
      setOutput(errorMessage, {
        entry,
        variant: 'error',
        transient: true
      });
    }
  });

  if (promptForm && promptInput) {
    promptForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (promptMenuOpen) {
        closePromptMenu();
      }

      const question = promptInput.value.trim();

      if (!question) {
        promptInput.focus();
        return;
      }

      setOutput(question, { variant: 'prompt' });

      const languageForRequest = activeLanguage;
      const languageSettings = getLanguageSettings(languageForRequest);
      const entry = setOutput(languageSettings.thinkingLabel, { variant: 'status' });

      try {
        const answer = await processQuestion(question, {
          entry,
          documentText: uploadedDocument?.content,
          documentName: uploadedDocument?.name,
          contextLabel: uploadedDocument?.contextLabel,
          documentType: getUploadedTypeLabel(),
          language: languageForRequest
        });

        if (answer == null) {
          if (entry?.isConnected && entry.classList.contains('output-entry--status')) {
            entry.remove();
            createPlaceholder();
          }
          return;
        }

        setOutput(answer, { markdown: true, entry, variant: 'response' });
        promptInput.value = '';
        promptInput.focus();
      } catch (error) {
        console.error('Error during Q&A:', error);
        const errorMessage = error instanceof Error && error.message
          ? `${languageSettings.qaError} (${error.message})`
          : languageSettings.qaError;
        setOutput(errorMessage, {
          entry,
          variant: 'error',
          transient: true
        });
      }
    });
  }

  if (promptMenuButton && promptMenu) {
    promptMenuButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePromptMenu();
    });
  }

  if (promptMenuVoice) {
    promptMenuVoice.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closePromptMenu();
      startVoiceCapture();
    });
  }

  if (promptMenuUpload && promptFileInput) {
    promptMenuUpload.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closePromptMenu();
      promptFileInput.click();
    });

    promptFileInput.addEventListener('change', async (event) => {
      const fileList = event.target.files;
      const file = fileList && fileList.length > 0 ? fileList[0] : null;

      if (file) {
        await handleFileSelection(file);
      }

      event.target.value = '';
    });
  }

  if (promptMenuClearUpload) {
    promptMenuClearUpload.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closePromptMenu();

      if (!uploadedDocument) {
        return;
      }

      clearUploadedDocument();
    });
  }

  document.addEventListener('click', (event) => {
    if (!promptMenuOpen) {
      return;
    }

    if (promptMenu?.contains(event.target) || promptMenuButton?.contains(event.target)) {
      return;
    }

    closePromptMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && promptMenuOpen) {
      closePromptMenu();
      promptMenuButton?.focus();
    }
  });
});