module.exports = (req, res) => {
  // السماح بالاتصال من أي مكان
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message, userName } = req.body || {};
  
  const responseText = `يا أهلاً يا ${userName || 'بطل'}! قرأت رسالتك: "${message || 'مرحباً'}". أنا معافر وموجود دايماً عشان أشجعك! 💪🎯`;

  return res.status(200).json({ reply: responseText });
};
