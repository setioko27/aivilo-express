import { parseJSON } from "@/utils/transformer";
import roleService from "./role.service";
import { CRUDController } from "@/utils/crud/controller";


const roleController = CRUDController(roleService,{
  list: (data) => data.map(({_count,permissions,...item}) => ({
    ...item,
    used_by: _count.users
  })),
  detail : (data) => ({
    ...data,
    permissions: parseJSON(data.permissions)
  })
});

export default {...roleController}