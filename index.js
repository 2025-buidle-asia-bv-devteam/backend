const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;  // Node.js 서버 포트

// 미들웨어 설정
app.use(cors());
app.use(express.json());  // JSON 바디 파싱

// 프록시 엔드포인트: 클라이언트 요청을 FastAPI 서비스로 전달
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "빈 메시지는 허용되지 않습니다." });
  }
  
  try {
    // FastAPI 서버가 localhost:8000에서 동작한다고 가정
    const response = await axios.post('http://127.0.0.1:8000/chat', { message });
    // FastAPI의 응답을 그대로 클라이언트에게 전달
    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "서버 내부 오류 발생" });
  }
});

// 상태 확인용 엔드포인트 (선택사항)
app.get('/', (req, res) => {
  res.json({ message: "Node.js 서버가 정상 작동중입니다." });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Node.js 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
