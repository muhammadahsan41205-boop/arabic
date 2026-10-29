export interface UstadzAnswerResponse {
  reply: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DialogResponse {
  arabic: string;
  transliteration: string;
  translation: string;
  feedback: string;
  suggestedNextOptions: string[];
}

export interface GrammarAnalysis {
  original: string;
  correctedArabic: string;
  transliteration: string;
  translation: string;
  irabHighlights: {
    word: string;
    role: string;
    harakat: string;
    explanation: string;
  }[];
  teacherNotes: string;
}

export async function askUstadzAI(question: string, context?: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    const data: UstadzAnswerResponse = await res.json();
    return data.reply;
  } catch (error: any) {
    console.error('askUstadzAI Error:', error);
    throw error;
  }
}

export async function generateAdaptiveQuiz(topic: string, count: number = 3): Promise<GeneratedQuestion[]> {
  try {
    const res = await fetch('/api/ai/quiz-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, count }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.questions || [];
  } catch (error: any) {
    console.error('generateAdaptiveQuiz Error:', error);
    throw error;
  }
}

export async function chatWithDialogCoach(
  message: string,
  chatHistory: { sender: string; text: string }[],
  scenario: string
): Promise<DialogResponse> {
  try {
    const res = await fetch('/api/ai/dialog-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatHistory, scenario }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('chatWithDialogCoach Error:', error);
    throw error;
  }
}

export async function checkGrammar(text: string): Promise<GrammarAnalysis> {
  try {
    const res = await fetch('/api/ai/check-grammar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('checkGrammar Error:', error);
    throw error;
  }
}
