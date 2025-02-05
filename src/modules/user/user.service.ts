import { CRUDService } from "@/utils/crud/service";
import prisma from "@/config/db";
import { NotFoundError, ValidationError, ValidationErrorItem } from "@/utils/error";
import bcrypt from "bcrypt";
import { CreateUserDTO, UpdateUserDTO } from './user.schema';

const userServices = CRUDService('User',prisma.user, {
    selectFields: {
        id: true,
        email: true,
        name: true,
        role: {
            select: {
                name: true
            }
        }
    },
    searchFields: ['name', 'email']
});

const createUser = async (data: CreateUserDTO) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        throw new ValidationError('Email already exists');
    }

    // Multiple errors example
    const errors: ValidationErrorItem[] = [];
    if (data.name.includes('admin')) {
        errors.push({ field: 'name', message: 'Name cannot contain "admin"' });
    }
    if (data.password.toLowerCase() === data.password) {
        errors.push({ field: 'password', message: 'Password must contain uppercase' });
    }
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userServices.create({
        ...data,
        password: hashedPassword,
        role: { connect: { id: data.roleId } }
    });
};


const getFormData = async () => {
    const roles = await prisma.role.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: 'asc'
        }
    });

    return {
        roles
    };
};

const updatePassword = async (id: number, oldPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
        throw new ValidationError('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
    });
};

export default {
    ...userServices,
    createUser,
    updatePassword,
    getFormData
};
