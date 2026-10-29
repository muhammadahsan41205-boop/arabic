class AudioService {
  private isSpeaking = false;

  public playArabic(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve(false);
        return;
      }

      window.speechSynthesis.cancel();

      // Clean text to keep Arabic characters and Harakat intact
      const cleaned = text.trim();
      if (!cleaned) {
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Slightly slower for clear learning pronunciation
      utterance.pitch = 1.0;

      // Find Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.lang.includes('SA') || v.name.toLowerCase().includes('arabic')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve(true);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.isSpeaking = false;
        resolve(false);
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}

export const audioService = new AudioService();
