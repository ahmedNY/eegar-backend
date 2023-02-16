import {JwtPayload} from 'jsonwebtoken';

export class JwtPayloadDto implements JwtPayload {
    id: number
}