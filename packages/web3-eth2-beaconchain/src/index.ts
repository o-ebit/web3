import { ETH2Core, BaseAPISchema, ETH2BaseOpts } from 'https://raw.githubusercontent.com/o-ebit/web3/v1.0.0-myfork//packages/web3-eth2-core/src/index.js';
import { DefaultSchema } from './schema.ts';

import { ETH2BeaconChain as IETH2BeaconChain } from '../types.ts';

// @ts-ignore - ETH2BeaconChain incorrectly implements interface IETH2BeaconChain
// because methods are added during runtime
export class ETH2BeaconChain extends ETH2Core implements IETH2BeaconChain {
  constructor(
    provider: string,
    schema: BaseAPISchema = DefaultSchema,
    opts: ETH2BaseOpts = { protectProvider: true },
  ) {
    super(provider, schema, opts);
  }
}
