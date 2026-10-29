import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Google Gen AI client with server-side API Key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System Prompt for Grade X MA Darul Faqih Arabic Teacher
const USTADZ_SYSTEM_PROMPT = `Anda adalah "Ustadz Asisten Bahasa Arab" untuk siswa Kelas X (Sepuluh) MA Darul Faqih Indonesia.
Karakteristik Anda:
1. Ramah, mendidik, santun, bernuansa pesantren modern khas MA Darul Faqih Indonesia.
2. Menguasai kurikulum Bahasa Arab Kemenag Kelas X MA (Materi: At-Ta'aruf, Al-Usrah wal-Bait, Al-Madrasah, As-Sakan, Al-Hiwayah, Al-Hayah Al-Yaumiyyah).
3. Menguasai kaidah Nahwu & Shorof dasar (Pembagian Kalam: Isim, Fi'il, Huruf; Dhomir Munfashil & Muttashil; Isim Isyarah; Fi'il Madhi, Mudhari', Amar; Tarkib Na'ti / Man'ut, Tarkib Idhofi, Mubtada'-Khobar).
4. Berikan harakat lengkap pada setiap teks Arab agar mudah dibaca oleh siswa pemula/menengah.
5. Berikan terjemahan bahasa Indonesia, cara baca transliterasi latin bila perlu, dan penjelasan i'rab/kaidah yang ringkas dan mudah dipahami.
6. Hindari istilah yang terlalu rumit tanpa penjelasan dasar.`;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    school: 'MA Darul Faqih Indonesia',
    grade: 'Kelas X',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// AI Q&A Endpoint: Tanya Ustadz / Pembimbing Kaidah
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Layanan AI belum siap. Pastikan GEMINI_API_KEY telah dikonfigurasi di server.',
      });
      return;
    }

    const prompt = `Pertanyaan Siswa: "${question}"
${context ? `Konteks Pembelajaran/Bab: ${context}` : ''}

Tolong jawab dengan format yang terstruktur:
1. Jawaban Langsung / Penjelasan (disertai teks Arab berharakat jika ada kosakata/kalimat).
2. Makna / Terjemahan Bahasa Indonesia.
3. Penjelasan Kaidah Nahwu/Shorof terkait (singkat & aplikatif untuk kelas X MA).
4. Contoh Kalimat Tambahan yang relevan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: USTADZ_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, Ustadz belum dapat merumuskan jawaban saat ini.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error (/api/ai/ask):', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses jawaban AI.',
      details: error.message || String(error),
    });
  }
});

// AI Quiz Generator Endpoint: Membuat kuis interaktif adaptif
app.post('/api/ai/quiz-generator', async (req: Request, res: Response) => {
  try {
    const { topic, count = 3 } = req.body;
    if (!ai) {
      res.status(503).json({ error: 'Layanan AI belum siap.' });
      return;
    }

    const prompt = `Buatkan ${Math.min(count, 5)} soal latihan pilihan ganda Bahasa Arab untuk siswa Kelas X MA Darul Faqih Indonesia tentang topik: "${topic || 'Kaidah Nahwu Dasar / At-Taaruf'}".
Output WAJIB berupa JSON murni dengan format array of objects:
[
  {
    "question": "Teks pertanyaan dalam bahasa Indonesia dengan kutipan kalimat Arab berharakat",
    "options": ["Pilihan A (berharakat)", "Pilihan B (berharakat)", "Pilihan C (berharakat)", "Pilihan D (berharakat)"],
    "correctIndex": 0,
    "explanation": "Penjelasan mengapa jawaban tersebut benar sesuai kaidah Nahwu/Shorof/Mufradat Kelas X MA"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: USTADZ_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '[]';
    let questions = [];
    try {
      questions = JSON.parse(rawText);
    } catch {
      questions = [];
    }

    res.json({ questions });
  } catch (error: any) {
    console.error('Quiz Generator Error:', error);
    res.status(500).json({ error: 'Gagal membuat soal latihan otomatis.' });
  }
});

// AI Conversation Partner: Muhadatsah Interaktif
app.post('/api/ai/dialog-coach', async (req: Request, res: Response) => {
  try {
    const { message, chatHistory = [], scenario = 'perkenalan_santri' } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Layanan AI belum siap.' });
      return;
    }

    const scenarioDescriptions: Record<string, string> = {
      perkenalan_santri: 'Percakapan At-Ta\'aruf antar santri baru di asrama MA Darul Faqih.',
      di_perpustakaan: 'Percakapan meminjam kitab/buku di Maktabah (perpustakaan) madrasah.',
      di_kantin: 'Percakapan memesan makanan dan minuman halal di maqshaf (kantin) madrasah.',
      hobi_dan_cita: 'Percakapan tentang hobi (hiwayah) dan cita-cita (amal).',
    };

    const scenarioText = scenarioDescriptions[scenario] || scenarioDescriptions.perkenalan_santri;

    const formattedHistory = chatHistory
      .slice(-6)
      .map((item: { sender: string; text: string }) => `${item.sender === 'user' ? 'Siswa' : 'Lawan Bicara (Arab)'}: ${item.text}`)
      .join('\n');

    const prompt = `Skenario: ${scenarioText}
Riwayat Percakapan:
${formattedHistory}

Pesan Siswa saat ini: "${message}"

Berikan balasan percakapan dalam Bahasa Arab berharakat lengkap (1-2 kalimat alami), lalu sertakan:
1. arabic: Kalimat balasan Arab berharakat.
2. transliteration: Transliterasi latin cara bacanya.
3. translation: Terjemahan bahasa Indonesia.
4. feedback: Saran perbaikan singkat jika ada kekeliruan tata bahasa dari siswa, atau apresiasi jika kalimatnya tepat.
5. suggestedNextOptions: Array berisi 2 alternatif jawaban singkat yang bisa dipilih siswa untuk melanjutkan dialog.

Output WAJIB berupa JSON murni dengan format object:
{
  "arabic": "...",
  "transliteration": "...",
  "translation": "...",
  "feedback": "...",
  "suggestedNextOptions": ["...", "..."]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: USTADZ_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Dialog Coach Error:', error);
    res.status(500).json({ error: 'Gagal memproses percakapan interaktif.' });
  }
});

// Tashkil & I'rab Checker
app.post('/api/ai/check-grammar', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Teks tidak boleh kosong.' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Layanan AI belum siap.' });
      return;
    }

    const prompt = `Analisis kalimat Bahasa Arab berikut untuk siswa Kelas X MA:
"${text}"

Tolong berikan koreksi dan analisis terstruktur dalam format JSON:
{
  "original": "${text}",
  "correctedArabic": "Kalimat yang telah dibenarkan dan diberi harakat lengkap",
  "transliteration": "Cara baca latin",
  "translation": "Arti dalam bahasa Indonesia",
  "irabHighlights": [
    { "word": "Kata", "role": "Mubtada / Khobar / Fail / Maf'ul / dll", "harakat": "Marfu' bil-dhammah / Manshub / dll", "explanation": "Penjelasan singkat" }
  ],
  "teacherNotes": "Catatan nasihat dan motivasi dari Ustadz"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: USTADZ_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error('Grammar check error:', error);
    res.status(500).json({ error: 'Gagal menganalisis kalimat Arab.' });
  }
});

// IMPORTANT: export default app without app.listen as per user requirement and Vercel serverless specifications
export default app;
