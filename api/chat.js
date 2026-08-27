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

    const API_KEY = "AQ.Ab8RN6KrGk9Mo7Uc0lbceyWrL8JlIOWlPHtdTbtjgdz3ItCMPQ";

    const promptText = `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}".
المستخدم قال لك: "${message}".
قم بالرد عليه بأسلوب مشجع، ذكي، وملهم باللغة العربية.`;

    // تجربة الاتصال عبر الهيدر المباشر والـ URL لتجاوز حماية GCP
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();
    let replyText = "";

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      replyText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      replyText = `خطأ في الاتصال: ${data.error.message || 'يرجى التحقق من صلاحيات المفتاح'}`;
    } else {
      replyText = `عاش يا ${name}! أنا معاك وجاهز نكسر الدنيا سوا 💪🚀`;
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ في الاتصال بالذكاء الاصطناعي، جرب تاني!" });
  }
};
