import { AppError } from "../utils/AppError.js";

export const validate =
(schema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new AppError(`Data Parsing failed: ${result.error}`, 500);
      };

    req.validatedBody = result.data;
    next();
};

export const validateQuery = (schema) => (req,res,next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    throw new AppError(`Data Parsing failed: ${result.error}`, 500);
  };

  req.validatedQuery = result.data;
  next();
};