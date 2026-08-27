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

    const systemPrompt = `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته بأسلوب مشجع وذكاء اصطناعي باللغة العربية.`;
    const userMessage = message || 'مرحبا';

    // استخدام محرك مجاني 100% بدون أي مفاتيح API
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        model: 'openai'
      })
    });

    const replyText = await response.text();

    if (replyText && replyText.trim().length > 0) {
      return res.status(200).json({ reply: replyText });
    } else {
      return res.status(200).json({ reply: `يا هلا يا ${name}! معافر معاك وجاهز، اسألني في أي وقت!` });
    }

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ بسيط في السيرفر، جرب ابعت تاني!" });
  }
};
