import { Router } from "express";
import roleController from "./role.controller";
import { checkPermission } from "@/middleware/permission";
import { validate } from "@/middleware/validate";
import { roleSchema } from "./role.schema";

const router = Router();
const {getAll,getById,update,create,remove} = roleController;

router.get("/", checkPermission('read role'),getAll);
router.get("/:id", checkPermission('read role'),getById);
router.post("/", checkPermission('write role'),validate(roleSchema.create),create );
router.put("/:id", checkPermission('write role'),validate(roleSchema.update),update );
router.delete("/:id", checkPermission('write role'),remove );


export default router;
