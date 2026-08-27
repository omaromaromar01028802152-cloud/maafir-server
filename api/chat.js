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

    // استخدام سيرفر مجاني تماماً ومفتوح بدون قيود للموديلات
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-or-v1-free'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته بأسلوب مشجع وذكاء اصطناعي باللغة العربية.`
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

    return res.status(200).json({ reply: replyText || "يا هلا بيك! معافر معاك وجاهز لأي سؤال." });

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ في الاتصال بالذكاء الاصطناعي." });
  }
};
