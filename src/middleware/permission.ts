import { Request, Response, NextFunction } from "express";
import prisma from "@/config/db";

export const checkPermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { role: true },
        });

        if (!user) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return;
        }

        
        if(user.role.name === "Super Admin"){
          next();
          return
        }

        const userPermissions: string[] = JSON.parse(
            user.role.permissions || "[]"
        );
        if (!userPermissions.includes(permission)) {
            res
                .status(403)
                .json({ success: false, message: "Forbidden" });
                return 
        }

        next();
    };
};
