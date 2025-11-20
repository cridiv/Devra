import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MintDatasetController } from './mint-dataset.controller';
import { DatasetRecordService } from '../encryption/dataset-record.service';
import { EncryptService } from '../encryption/encrypt.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MintDatasetController],
  providers: [DatasetRecordService, EncryptService],
})
export class MintModule {}
