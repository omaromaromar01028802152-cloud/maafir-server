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

    // 1. طلب التوكن التلقائي بدون مفتاح
    const initRes = await fetch('https://duckduckgo.com/duckchat/v1/status', {
      headers: { 'x-vqd-accept': '1' }
    });
    const vqd = initRes.headers.get('x-vqd-4');

    // 2. إرسال الرسالة مباشرة
    const response = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vqd-4': vqd
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته التالية بأسلوب مشجع باللغة العربية:\n\n${message || 'مرحبا'}`
          }
        ]
      })
    });

    const dataText = await response.text();
    
    // استخراج النص من الـ Stream
    const lines = dataText.split('\n');
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

    return res.status(200).json({ 
      reply: fullReply || `أهلاً يا ${name}! معافر معاك، جاهز ننطلق؟` 
    });

  } catch (error) {
    return res.status(200).json({ reply: "معافر معاك! خطأ بسيط في الشبكة، جرب ابعت رسالتك تاني." });
  }
};
    
