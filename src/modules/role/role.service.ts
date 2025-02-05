import prisma from "@/config/db";
import { CRUDService } from "@/utils/crud/service";
import { roleSchema, RoleDTO } from './role.schema';

const roleService = CRUDService<RoleDTO.Create, RoleDTO.Update>(
    'Role',
    prisma.role,
    {
        selectFields: {
            id: true,
            name: true,
            permissions: true,
            _count: {
                select: {
                    users: true
                }
            }
        },
        searchFields: ['name'],
        createSchema: roleSchema.create,
        updateSchema: roleSchema.update
    }
);

export default { ...roleService };
