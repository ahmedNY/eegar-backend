import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const mysql = require('mysql2');
import { adapters, loadQueries, PuresqlAdapter, PuresqlQuery, PuresqlQueryParameters } from 'puresql';

@Injectable()
export class PureSqlService {
    constructor(
        configService: ConfigService
    ) {
        // Create a connection the adapter will use
        const pureConnection = mysql.createConnection({
            host: configService.get('MYSQL_HOST'),
            port: configService.get('MYSQL_PORT'),
            user: configService.get('MYSQL_USER'),
            password: configService.get('MYSQL_PASSWORD'),
            database: configService.get('MYSQL_DB'),
        });
        this._adapter = adapters.mysql(pureConnection, (msg) => { });
        this._quries = loadQueries(configService.get('PURE_SQL_QURIES'))
    }

    private _quries: Record<string, PuresqlQuery>;
    private _adapter: PuresqlAdapter;

    async exec(queryName: string, params: PuresqlQueryParameters): Promise<any> {
        const query = this._quries[queryName];
        if (!query) {
            throw new HttpException(`Query [${queryName}] not found`, HttpStatus.NOT_FOUND);
        }
        const result = await query(params, this._adapter);
        return result;
    }
}