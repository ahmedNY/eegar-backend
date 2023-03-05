import { Asset } from "../entities/asset.entity";
import { Rent } from "../entities/rent.entity";

export class HomeAssetDto extends Asset {
    lastRent?: Rent;
  }
  