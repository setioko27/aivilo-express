import { Request, Response, NextFunction } from 'express';
import { success } from '../response';

interface TransformerOptions {
    list?: (data: any[]) => any[];
    detail?: (data: any) => any;
}

export const CRUDController = (service: any, transformer?: TransformerOptions) => {
    return {
        getAll: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { page, limit, search, sortBy, sortOrder } = req.query;
                const result = await service.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    search: search as string,
                    sortBy: sortBy as string,
                    sortOrder: sortOrder as 'asc' | 'desc'
                });

                const transformedData = transformer?.list 
                    ? transformer.list(result.data)
                    : result.data;

                success(res, "Data fetched successfully", {
                    data: transformedData,
                    meta: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit
                    }
                });
            } catch (error) {
                next(error);
            }
        },

        getById: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await service.findById(Number(req.params.id));
                const transformedData = transformer?.detail 
                    ? transformer.detail(result)
                    : result;
                    
                success(res, "Data fetched successfully", transformedData);
            } catch (error) {
                next(error);
            }
        },

        create: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await service.create(req.body);
                success(res, "Data created successfully", result);
            } catch (error) {
                next(error);
            }
        },

        update: async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await service.update(Number(req.params.id), req.body);
                success(res, "Data updated successfully", result);
            } catch (error) {
                next(error);
            }
        },

        remove: async (req: Request, res: Response, next: NextFunction) => {
            try {
                await service.delete(Number(req.params.id));
                success(res, "Data deleted successfully", null);
            } catch (error) {
                next(error);
            }
        }
    };
}; 