import { Injectable } from '@nestjs/common';
import { compile } from "handlebars";

@Injectable()
export class HandlebarsService {
    constructor() { }

    renderText(template: string, args: any): string {
        return compile(template)(args);
    }
}