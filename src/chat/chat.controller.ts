import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    return this.chatService.chat(body.message);
  }

  @Post('generate')
  async generate(@Body() body: { input_text: string }) {
    return this.chatService.generate(body.input_text);
  }

  @Get('download')
  async download(@Query('url') url: string) {
    return this.chatService.download(url);
  }
} 