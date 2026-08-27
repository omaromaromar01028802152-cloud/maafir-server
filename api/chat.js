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

    const prompt = `أنت مساعد ذكي ومحفز اسمه "معافر". تتحدث مع مستخدم اسمه "${name}". أجب على رسالته التالية بأسلوب ذكي، محفز، ومفيد جداً باللغة العربية:
المستخدم: ${message}
معافر:`;

    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    let replyText = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      replyText = data[0].generated_text.replace(prompt, '').trim();
    }

    if (!replyText) {
      replyText = `أهلاً يا ${name}! أنا معاك وجاهز نذاكر ونحل أي مشكلة سوا، كلمني في أي موضوع محتاجه! 🚀`;
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(500).json({ reply: "عذراً يا بطل، حصل خطأ بسيط في سيرفر الذكاء الاصطناعي، جرب تاني!" });
  }
};
