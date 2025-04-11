const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;  // Node.js 서버 포트

// 미들웨어 설정
app.use(cors());
app.use(express.json());  // JSON 바디 파싱

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "빈 메시지는 허용되지 않습니다." });
  }
  try {
    const response = await axios.post('http://127.0.0.1:8000/chat', { message });
    const replyText = response.data.reply;

    // 정규표현식을 사용해 노트 정보 추출 (각 노트별로 " - " 앞에 재료 이름과 괄호 안의 비율 추출)
    // 예시: "- 탑 노트: 블랙 장미 블라스트 (30%) - ..."
    const extractNote = (label) => {
      const regex = new RegExp(`-\\s*${label}\\s*:\\s*([^\\(]+)\\((\\d+)%\\)`, 'i');
      const match = replyText.match(regex);
      if (match) {
        return {
          name: match[1].trim(),
          ratio: parseInt(match[2], 10)
        };
      }
      return null;
    };

    const topNote = extractNote('탑 노트');
    const middleNote = extractNote('미들 노트');
    const baseNote = extractNote('베이스 노트');

    // 최종 결과 구조 구성
    const result = {
      full_reply: replyText,
      recipe: {
        top_note: topNote,
        middle_note: middleNote,
        base_note: baseNote
      }
    };

    res.json(result);
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
