import { z } from 'zod';

// Custom error map
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === 'invalid_type' && issue.received === 'undefined') {
    // Get the last part of the path as field name
    const fieldName = issue.path[issue.path.length - 1];
    return { message: `${fieldName} is required` };
  }
  
  // Default error messages
  return { message: ctx.defaultError };
};

// Set the custom error map
z.setErrorMap(customErrorMap);