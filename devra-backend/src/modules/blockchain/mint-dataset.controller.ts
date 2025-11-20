import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  HttpException, 
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DatasetRecordService } from '../encryption/dataset-record.service';

@ApiTags('Blockchain')
@Controller('blockchain')
export class MintDatasetController {
  private readonly logger = new Logger(MintDatasetController.name);

  constructor(private readonly datasetRecordService: DatasetRecordService) {}

  @Post('dataset/:datasetId/token/:tokenId')
  @ApiOperation({
    summary:
      'Update dataset with minted token ID (called by frontend after minting)',
  })
  @ApiParam({ name: 'datasetId', description: 'Dataset ID' })
  @ApiParam({ name: 'tokenId', description: 'NFT Token ID from blockchain' })
  @ApiResponse({ status: 200, description: 'Token ID linked successfully' })
  async updateTokenId(
    @Param('datasetId') datasetId: string,
    @Param('tokenId') tokenId: string,
  ) {
    try {
      const dataset = await this.datasetRecordService.findById(datasetId);

      if (!dataset) {
        throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
      }

      const updated = await this.datasetRecordService.updateTokenId(
        datasetId,
        parseInt(tokenId),
      );

      this.logger.log(`✅ Token ID ${tokenId} linked to dataset ${datasetId}`);

      return {
        success: true,
        message: 'Token ID updated successfully',
        data: updated,
      };
    } catch (error) {
      this.logger.error(`Update token ID error: ${(error as Error).message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        (error as Error).message || 'Failed to update token ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('dataset/:datasetId')
  @ApiOperation({ summary: 'Get dataset details including CID' })
  @ApiParam({ name: 'datasetId', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'Dataset retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dataset not found' })
  async getDataset(@Param('datasetId') datasetId: string) {
    try {
      this.logger.log(`Getting dataset details: ${datasetId}`);

      const dataset = await this.datasetRecordService.findById(datasetId);

      if (!dataset) {
        this.logger.error(`Dataset not found: ${datasetId}`);
        throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          id: dataset.id,
          name: dataset.name,
          owner: dataset.owner,
          status: dataset.status,
          hash: dataset.hash,
          cid: dataset.cid, // ✅ Frontend needs this for minting
          ipfsUrl: dataset.ipfsUrl,
          tokenId: dataset.tokenId,
          createdAt: dataset.createdAt,
        },
      };
    } catch (error) {
      this.logger.error(
        `Get dataset error: ${(error as Error).message}`, 
        error,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        (error as Error).message || 'Failed to retrieve dataset',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('datasets')
  @ApiOperation({ summary: 'Get all datasets' })
  @ApiResponse({ status: 200, description: 'Datasets retrieved successfully' })
  async getAllDatasets() {
    try {
      this.logger.log('Getting all datasets');

      const datasets = await this.datasetRecordService.findAll();

      return {
        success: true,
        count: datasets.length,
        data: datasets.map((dataset) => ({
          id: dataset.id,
          name: dataset.name,
          owner: dataset.owner,
          status: dataset.status,
          hash: dataset.hash,
          cid: dataset.cid,
          ipfsUrl: dataset.ipfsUrl,
          tokenId: dataset.tokenId,
          createdAt: dataset.createdAt,
        })),
      };
    } catch (error) {
      this.logger.error(`Get all datasets error: ${(error as Error).message}`);
      throw new HttpException(
        (error as Error).message || 'Failed to retrieve datasets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('dataset/token/:tokenId')
  @ApiOperation({ summary: 'Get dataset by token ID' })
  @ApiParam({ name: 'tokenId', description: 'NFT Token ID' })
  @ApiResponse({ status: 200, description: 'Dataset retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Dataset not found' })
  async getDatasetByTokenId(@Param('tokenId') tokenId: string) {
    try {
      const dataset = await this.datasetRecordService.findByTokenId(
        parseInt(tokenId),
      );

      if (!dataset) {
        throw new HttpException('Dataset not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          id: dataset.id,
          name: dataset.name,
          owner: dataset.owner,
          tokenId: dataset.tokenId,
          status: dataset.status,
          hash: dataset.hash,
          cid: dataset.cid,
          ipfsUrl: dataset.ipfsUrl,
          createdAt: dataset.createdAt,
        },
      };
    } catch (error) {
      this.logger.error(
        `Get dataset by token ID error: ${(error as Error).message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        (error as Error).message || 'Failed to retrieve dataset',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}