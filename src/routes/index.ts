import { Router } from "express";
import authRoutes from "@/modules/auth/auth.route"
import userRoutes from "@/modules/user/user.route"
import roleRoutes from "@/modules/role/role.route"
import { authenticate } from "@/middleware/auth";

const router = Router();
router.use("/api/auth", authRoutes);
router.use("/api/users",authenticate, userRoutes);
router.use("/api/roles",authenticate, roleRoutes);

export default router