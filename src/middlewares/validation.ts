import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateSchema(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }
    next();
  };
}
