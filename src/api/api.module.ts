import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFT } from '../database/entities/nft.entity';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  controllers: [NftController],
  providers: [NftService],
})
export class ApiModule {}
