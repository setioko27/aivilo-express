import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import { apiLimiter } from './rateLimiter';

export const securityMiddleware = [
    helmet(),
    apiLimiter,
    xss(),
    hpp()
];