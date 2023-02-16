import { Raw } from "typeorm";

export function SqlDate(value: string) {
    return Raw((alias) => `DATE(${alias}) = :value`, {
        value,
    });
}
