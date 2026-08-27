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

    // المفتاح كما أرسلته تماماً بدون أي تعديل
    const GROQ_API_KEY = "Gsk_yfhVmJBpGchRXUJQLM50WGdyb3FYjcndkZ1mEDUwZy6sD4DccD2L";

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته بأسلوب مشجع وذكاء اصطناعي كامل باللغة العربية.`
          },
          {
            role: 'user',
            content: message || 'مرحبا'
          }
        ]
      })
    });

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content;

    if (!replyText && data.error) {
      replyText = `خطأ: ${data.error.message}`;
    }

    return res.status(200).json({ reply: replyText || "حدث خطأ بسيط، جرب تاني!" });

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ في الاتصال بالذكاء الاصطناعي." });
  }
};
