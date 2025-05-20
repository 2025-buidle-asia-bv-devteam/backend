import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly fastApiUrl = 'http://127.0.0.1:8000';

  async chat(message: string) {
    if (!message || message.trim() === "") {
      throw new BadRequestException("빈 메시지는 허용되지 않습니다.");
    }

    try {
      const response = await axios.post(`${this.fastApiUrl}/chat`, { message });
      const data = response.data;

      return {
        full_reply: data.raw_reply,
        recipe: {
          top_note: data.top_note,
          middle_note: data.middle_note,
          base_note: data.base_note,
        },
        structured_data: data.structured_data
      };
    } catch (error) {
      console.error("Error:", error.message);
      throw new InternalServerErrorException("서버 내부 오류 발생");
    }
  }

  async generate(inputText: string) {
    if (!inputText || inputText.trim() === "") {
      throw new BadRequestException("Input text cannot be empty");
    }

    try {
      const response = await axios.post(`${this.fastApiUrl}/generate`, { input_text: inputText });
      return response.data;
    } catch (error) {
      console.error("Generate endpoint 에러:", error.message);
      throw new InternalServerErrorException("이미지 생성 요청 처리 중 오류 발생");
    }
  }

  async download(url: string) {
    if (!url) {
      throw new BadRequestException('Missing url query parameter');
    }
    return { url };
  }
} 