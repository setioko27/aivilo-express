import 'module-alias/register';
import app from "./src/app";
import { env } from '@/const/env';
import { disconectDB } from '@/config/db';

const PORT = env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



