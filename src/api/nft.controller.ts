import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get()
  async getLatestNfts(
    @Query('network') network: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    if (!network || (network !== 'bsc' && network !== 'polygon')) {
      throw new BadRequestException('Query param "network" must be "bsc" or "polygon".');
    }

    const parsedLimit = limit ? Math.min(parseInt(limit.toString(), 10), 100) : 20;

    return this.nftService.getLatestNfts(network, cursor, parsedLimit);
  }
}
