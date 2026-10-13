let globalAudioRef: HTMLAudioElement | null = null;

export const stopAllAudio = () => {
  if (globalAudioRef) {
    try {
      globalAudioRef.pause();
      globalAudioRef.currentTime = 0;
    } catch {
      // Ignore audio stop errors
    }
    globalAudioRef = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      if ('resume' in window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
    } catch {
      // Ignore speech synthesis stop errors
    }
  }
};

export const playAudioText = (
  text: string,
  langCode: string,
  options?: {
    directUrl?: string;
    onEnd?: () => void;
    onError?: () => void;
  }
) => {
  stopAllAudio();

  const handleEnd = () => {
    globalAudioRef = null;
    options?.onEnd?.();
  };

  const handleError = () => {
    globalAudioRef = null;
    options?.onError?.();
  };

  // 1. Direct high-quality MP3 URL if provided
  if (options?.directUrl) {
    try {
      const audio = new Audio(options.directUrl);
      globalAudioRef = audio;
      audio.onended = handleEnd;
      audio.onerror = () => tryWebSpeech();
      audio.play().catch(() => tryWebSpeech());
      return;
    } catch {
      tryWebSpeech();
      return;
    }
  }

  // 2. Primary Online High-Quality TTS MP3 Stream (Google TTS client=gtx endpoint)
  // Executed synchronously inside user click gesture stack
  try {
    const cleanText = text.replace(/[\n\r\t]/g, ' ').trim().slice(0, 250);
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(cleanText)}&tl=${langCode}`;

    const audio = new Audio(googleTtsUrl);
    globalAudioRef = audio;
    audio.onended = handleEnd;

    let fallbackAttempted = false;
    const triggerFallback = () => {
      if (!fallbackAttempted) {
        fallbackAttempted = true;
        tryWebSpeech();
      }
    };

    audio.onerror = triggerFallback;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('TTS stream play rejected, using fallback:', err);
        triggerFallback();
      });
    }
  } catch {
    tryWebSpeech();
  }

  // 3. WebSpeech API Fallback
  function tryWebSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if ('resume' in window.speechSynthesis) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (langCode === 'ar') {
          utterance.lang = 'ar-SA';
          utterance.rate = 0.85;
        } else if (langCode === 'bn') {
          utterance.lang = 'bn-BD';
          utterance.rate = 0.88;
        } else if (langCode === 'hi') {
          utterance.lang = 'hi-IN';
          utterance.rate = 0.9;
        } else {
          utterance.lang = 'en-US';
          utterance.rate = 0.9;
        }

        utterance.onend = handleEnd;
        utterance.onerror = handleError;

        window.speechSynthesis.speak(utterance);
      } catch {
        handleError();
      }
    } else {
      handleError();
    }
  }
};
