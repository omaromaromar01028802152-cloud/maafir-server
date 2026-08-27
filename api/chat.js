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

    // 1. جلب التوكن المجاني للاتصال
    const tokenRes = await fetch('https://duckduckgo.com/duckchat/v1/status', {
      headers: { 'x-vsh-token': '1' }
    });
    const vshToken = tokenRes.headers.get('x-vsh-token');

    // 2. إرسال السؤال للذكاء الاصطناعي (Model: Llama 3)
    const aiRes = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vsh-token': vshToken || ''
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-instruct',
        messages: [
          {
            role: 'user',
            content: `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته التالية بأسلوب مشجع وذكاء اصطناعي كامل باللغة العربية: ${message}`
          }
        ]
      })
    });

    const textData = await aiRes.text();
    
    // استخراج النص الصافي من استجابة Stream
    const lines = textData.split('\n');
    let fullReply = '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace('data: ', '').trim();
        if (jsonStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.message) fullReply += parsed.message;
          } catch (e) {}
        }
      }
    }

    const finalReply = fullReply.trim() || `عاش يا ${name}! كمل معافرة وأنا في ظهرك دايماً 💪🎯`;

    return res.status(200).json({ reply: finalReply });

  } catch (error) {
    return res.status(500).json({ reply: "حدث خطأ بسيط في سيرفر الذكاء الاصطناعي، جرب تاني!" });
  }
};
