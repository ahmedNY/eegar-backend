import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { skip } from 'rxjs';
import { Between, EntityManager, EntityTarget, FindManyOptions, FindOptionsWhere, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { PaginatedDataQueryDto, SortingDirection } from '../dto/paginated-data.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';


const operatorsAliases = {
    // $eq: Op.eq,
    // $ne: Op.ne,
    $gte: MoreThanOrEqual,
    $gt: MoreThan,
    $lte: LessThanOrEqual,
    $lt: LessThan,
    // $not: Op.not,
    $in: In,
    // $notIn: Op.notIn,
    $isNull: IsNull(),
    $isNotNull: Not(IsNull()),
    // $isNull: IsNot,
    // $like: Op.like,
    // $notLike: Op.notLike,
    // $iLike: Op.iLike,
    // $notILike: Op.notILike,
    // $regexp: Op.regexp,
    // $notRegexp: Op.notRegexp,
    // $iRegexp: Op.iRegexp,
    // $notIRegexp: Op.notIRegexp,
    $between: Between,
    // $notBetween: Op.notBetween,
    // $overlap: Op.overlap,
    // $contains: Op.contains,
    // $contained: Op.contained,
    // $adjacent: Op.adjacent,
    // $strictLeft: Op.strictLeft,
    // $strictRight: Op.strictRight,
    // $noExtendRight: Op.noExtendRight,
    // $noExtendLeft: Op.noExtendLeft,
    // $and: Op.and,
    // $or: Op.or,
    // $any: Op.any,
    // $all: Op.all,
    // $values: Op.values,
    // $col: Op.col
};


@Injectable()
export class PaginatedDataService {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) { }


    async findAll<T>(
        entityClass: EntityTarget<T>,
        dto: PaginatedDataQueryDto,
        findManyOptions?: FindManyOptions<T>,
    ): Promise<PaginatedResultDto<T>> {
        const options = this._prepare(entityClass, dto, findManyOptions);
        const result = await this.manager.findAndCount<T>(entityClass, options);
        const rowsCount = result[1];
        return {
            docs: result[0],
            pages: Math.floor((rowsCount / dto.limit)),
            total: rowsCount,
        };
    }

    queryBuilder<T>(
        entityClass: EntityTarget<T>,
        alias: string,
        dto: PaginatedDataQueryDto,
    ): SelectQueryBuilder<T> {
        const options = this._prepare(entityClass, dto);
        return this.manager.createQueryBuilder(entityClass, alias)
            .where(options.where)
            .take(options.take)
            .skip(options.skip)
            .orderBy(`${alias}.${dto.sort}`, dto.sortingDirection);
    }

    _prepare<T>(
        entityClass: EntityTarget<T>,
        dto: PaginatedDataQueryDto,
        findManyOptions?: FindManyOptions<T>,
    ): FindManyOptions<T> {
        const whereCond: FindOptionsWhere<T> = {};
        let columns = {};
        if (typeof dto.columns == 'string') {
            columns = JSON.parse(dto.columns);
        }
        for (const key in columns) {
            const fieldName = key.split('_')[0];
            const fieldValue = columns[key];
            try {
                if (typeof fieldValue == 'string' && fieldValue.startsWith('$')) {
                    whereCond[fieldName] = operatorsAliases[fieldValue];
                    continue;
                }
                if (typeof (fieldValue) == 'object') {
                    const opName = Object.keys(fieldValue)[0];
                    if (opName.startsWith('$') == false) {
                        // normal json contains some data
                        whereCond[fieldName] = fieldValue;
                        continue;
                    }
                    // json contains an special operation
                    const opArgs = fieldValue[opName];
                    const operator = operatorsAliases[opName];
                    if (typeof (operator) == 'function') {
                        if (Array.isArray(opArgs) && opName != '$in') {
                            whereCond[fieldName] = operator(...opArgs);
                        } else {
                            whereCond[fieldName] = operator(opArgs);
                        }
                    } else {
                        whereCond[fieldName] = fieldValue;
                    }
                } else {
                    whereCond[fieldName] = Like(`%${fieldValue}%`);
                }
            } catch (error) {
                whereCond[fieldName] = Like(`%${fieldValue}%`);
            }
        }
        const skip = (dto.page - 1) * dto.limit;
        const order = {};
        const sortField = dto.sort || 'id';
        order[sortField] = dto.sortingDirection || SortingDirection.ASC;

        return {
            where: whereCond,
            take: dto.limit,
            skip: skip,
            order: order,
            ...findManyOptions || {},
        };
    }
}
