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

    // استخدام سيرفر ذكاء اصطناعي مفتوح ومجاني بدون أي API Key
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `أنت مساعد ذكي تشجييعي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". دورك أن تفهم كل كلامه وتجيب عليه بذكاء اصطناعي حقيقي وواقعي ومحفز باللغة العربية.`
          },
          {
            role: 'user',
            content: message || 'مرحبا'
          }
        ],
        model: 'openai'
      })
    });

    const replyText = await response.text();

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(500).json({ reply: "عذراً يا بطل، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." });
  }
};
