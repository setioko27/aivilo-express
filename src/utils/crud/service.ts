//import { PrismaClient } from '@prisma/client';
import { getPagination, PaginationParams } from '../pagination';
import { NotFoundError } from '../error';
import { z } from 'zod';

interface ServiceOptions<CreateDTO, UpdateDTO> {
    selectFields?: Record<string, boolean | object>;
    searchFields?: string[];
    relations?: Record<string, object>;
    createSchema?: z.ZodType<{ body: CreateDTO }>;
    updateSchema?: z.ZodType<{ body: UpdateDTO }>;
}

export const CRUDService = <CreateDTO, UpdateDTO>(
    moduleName: string,
    model: any,
    options: ServiceOptions<CreateDTO, UpdateDTO>
) => {
    const {
        selectFields = {},
        searchFields = [],
        relations = {},
        createSchema,
        updateSchema
    } = options;

    return {
        findAll: async (params: PaginationParams) => {
            const { skip, take, page, search, sortBy, sortOrder } = getPagination(params);

            const where = search ? {
                OR: searchFields.map(field => ({
                    [field]: { contains: search }
                }))
            } : {};

            const [data, total] = await Promise.all([
                model.findMany({
                    skip,
                    take,
                    where,
                    orderBy: { [sortBy]: sortOrder },
                    select: selectFields
                }),
                model.count({ where })
            ]);

            return { data, total, page, limit: take };
        },

        findById: async (id: number) => {
            const item = await model.findUnique({
                where: { id },
                select: selectFields
            });

            if (!item) {
                throw new NotFoundError(`${moduleName} not found`);
            }

            return item;
        },

        create: async (data: CreateDTO) => {
            if (createSchema) {
                await createSchema.parseAsync({ body: { ...data } });
            }

            return model.create({
                data: {
                    ...data,
                    ...relations
                },
                select: selectFields
            });
        },

        update: async (id: number, data: UpdateDTO) => {
            if (updateSchema) {
                await updateSchema.parseAsync({ body: { ...data } });
            }

            const exists = await model.findUnique({ where: { id } });
            if (!exists) {
                throw new NotFoundError(`${moduleName} not found`);
            }

            return model.update({
                where: { id },
                data,
                select: selectFields
            });
        },

        delete: async (id: number) => {
            const exists = await model.findUnique({ where: { id } });
            if (!exists) {
                throw new NotFoundError(`${moduleName} not found`);
            }

            return model.delete({ where: { id } });
        }
    };
}; 