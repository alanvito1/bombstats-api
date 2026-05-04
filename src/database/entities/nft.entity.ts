import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('nfts')
@Index(['network', 'token_id'], { unique: true })
@Index(['owner_address'])
export class NFT {
  // We use a composite primary key or a single UUID.
  // For partitioned tables in Postgres, the partition key must be part of the primary key.
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @PrimaryColumn({ type: 'varchar', length: 10 })
  network: string; // 'bsc' or 'polygon'

  @Column({ type: 'bigint' })
  token_id: string;

  @Column({ type: 'char', length: 42 })
  owner_address: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: any;

  @Column({ type: 'bigint' })
  last_update_block: string;
}
