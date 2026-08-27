module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, userName } = req.body || {};
    const name = userName || 'بطل';

    // مفتاح Gemini API الخاص بك
    const GEMINI_API_KEY = "AQ.Ab8RN6J_rkpNRgeObz5xd9k5ojDRsdDu62Cg1BatrPLfqBGFmQ";

    const promptText = `أنت مساعد ذكي، ودود ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}".
المستخدم قال لك: "${message}".
قم بالرد عليه بأسلوب مشجع، ذكي، وملهم باللغة العربية.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();
    
    let replyText = "عذراً يا بطل، حدث خطأ أثناء التفكير في الرد.";
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      replyText = data.candidates[0].content.parts[0].text;
    } else if (data.error && data.error.message) {
      replyText = `عذراً، حدث خطأ في الـ API: ${data.error.message}`;
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ في الاتصال بالذكاء الاصطناعي." });
  }
};
