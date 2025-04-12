require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;  // Node.js 서버 포트

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 1) 챗봇용 aiagent 호출
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "빈 메시지는 허용되지 않습니다." });
  }

  try {
    // FastAPI 서버에 메시지를 보냄
    const response = await axios.post('http://127.0.0.1:8000/chat', { message });
    // FastAPI에서 주는 응답 전체
    const data = response.data;

    // 1) raw_reply 그대로 
    const fullReply = data.raw_reply;

    // 2) 구조화된 노트 정보는 이미 파싱된 상태
    const topNote = data.top_note;         
    const middleNote = data.middle_note;   
    const baseNote = data.base_note;       
    
    const structuredData = data.structured_data;

    // 최종결과
    const result = {
      full_reply: fullReply,
      recipe: {
        top_note: topNote,
        middle_note: middleNote,
        base_note: baseNote,
      },
      structured_data: structuredData
    };

    // 결과를 그대로 반환
    res.json(result);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "서버 내부 오류 발생" });
  }
});

// 2) 이미지 생성 agent 호출
app.post('/generate', async (req, res) => {
  const { input_text } = req.body;
  if (!input_text || input_text.trim() === "") {
    return res.status(400).json({ error: "Input text cannot be empty" });
  }

  try {
    // FastAPI의 /generate 엔드포인트 호출
    const response = await axios.post('http://127.0.0.1:8000/generate', { input_text });
    // FastAPI에서 생성한 프롬프트와 이미지 URL을 그대로 반환.
    res.json(response.data);
  } catch (error) {
    console.error("Generate endpoint 에러:", error.message);
    res.status(500).json({ error: "이미지 생성 요청 처리 중 오류 발생" });
  }
});

app.get('/download', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Missing url query parameter');
  }
  res.redirect(imageUrl);
});

//상태
app.get('/', (req, res) => {
  res.json({ message: "Node.js 서버가 정상 작동중입니다." });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Node.js 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
