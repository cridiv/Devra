import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { VerifyResultDto } from '../encryption/dto/verified-file.dto';

interface VerificationResponse {
  scores: Record<string, number>;
  issues: Array<{ type: string; message: string }>;
  status: string;
}

@Injectable()
export class VerificationService {
  private readonly aiVerificationUrl = 'http://localhost:8000/verify'; // FastAPI endpoint

  async verifyDataset(
    file: Express.Multer.File,
    description?: string,
  ): Promise<VerifyResultDto> {
    try {
      const formData = new FormData();

      // 🧠 Attach the file as a stream so FastAPI can read it properly
      if (file.path) {
        formData.append('file', fs.createReadStream(file.path), {
          filename: file.originalname,
        });
      } else if (file.buffer) {
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      } else {
        throw new HttpException('Uploaded file missing path and buffer', 400);
      }
      formData.append('name', file.originalname);
      formData.append('description', description || '');

      const response = await axios.post(this.aiVerificationUrl, formData, {
        headers: formData.getHeaders(),
      });

      const { scores, issues, status } = response.data as VerificationResponse;

      const result = new VerifyResultDto();
      result.scores = scores;
      result.issues = issues;
      result.status = status;
      result.isValid = 
        status.toLowerCase() === 'valid' || status === 'VERIFIED';

      return result;
    } catch (error) {
      console.error('❌ AI verification failed:', error);
      const status = 
        axios.isAxiosError(error) && error.response?.status
          ? error.response.status
          : 500;
      throw new HttpException(
        'AI verification service unavailable or failed',
        status,
      );
    }
  }
}
