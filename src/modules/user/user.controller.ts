import { Request, Response, NextFunction } from 'express';
import userService from './user.service';
import { success } from '@/utils/response';
import { CRUDController } from '@/utils/crud/controller';

// Base CRUD operations
const userController = CRUDController(userService);

// Custom operations
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.createUser(req.body);
        success(res, "User created successfully", result);
    } catch (error) {
        next(error);
    }
};

const getFormData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getFormData();
        success(res, "Form data fetched successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getEditData = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const [user, formData] = await Promise.all([
            userService.findById(Number(req.params.id)),
            userService.getFormData()
        ]);
        
        success(res, "Edit data fetched successfully", {
            user,
            formData
        });
    } catch (error) {
        next(error)
    }
};

export default {
    ...userController,
    createUser,
    getFormData,
    getEditData
};