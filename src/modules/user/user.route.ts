import { Router } from "express";
import userController from "./user.controller";
import { checkPermission } from "@/middleware/permission";
import { validate } from "@/middleware/validate";
import { createUserSchema, updateUserSchema } from "./user.schema";

const router = Router();
const {
    getAll,
    getById,
    createUser,
    update,
    remove,
    getFormData,
    getEditData,
} = userController;

router.get("/", checkPermission("read user"), getAll);
router.get("/:id", checkPermission("read user"), getById);
router.post(
    "/",
    checkPermission("write user"),
    validate(createUserSchema),
    createUser
);
router.put(
    "/:id",

    checkPermission("write user"),
    validate(updateUserSchema),
    update
);
router.delete("/:id", checkPermission("write user"), remove);
router.get("/form-data", checkPermission("read user"), getFormData);
router.get("/:id/edit", checkPermission("read user"), getEditData);

export default router;
