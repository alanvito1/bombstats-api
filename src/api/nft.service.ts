import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NFT } from '../database/entities/nft.entity';
import Redis from 'ioredis';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);
  private redis: Redis;

  constructor(
    @InjectRepository(NFT)
    private readonly nftRepo: Repository<NFT>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async getLatestNfts(network: string, cursorTokenId?: string, limit: number = 20) {
    const cacheKey = `nfts:${network}:${cursorTokenId || 'latest'}:${limit}`;
    
    // 1. Check Cache
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    this.logger.debug(`Cache miss for key: ${cacheKey}. Fetching from DB...`);

    // 2. Query Builder with Cursor Pagination
    const query = this.nftRepo.createQueryBuilder('nft')
      .where('nft.network = :network', { network })
      .orderBy('nft.token_id', 'DESC')
      .limit(limit);

    if (cursorTokenId) {
      query.andWhere('nft.token_id < :cursor', { cursor: cursorTokenId });
    }

    const nfts = await query.getMany();

    // Determine the next cursor
    let nextCursor = null;
    if (nfts.length > 0) {
      nextCursor = nfts[nfts.length - 1].token_id;
    }

    const result = {
      data: nfts,
      nextCursor,
    };

    // 3. Set Cache (e.g., 5 seconds TTL for fast-moving data)
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 5);

    return result;
  }
}
