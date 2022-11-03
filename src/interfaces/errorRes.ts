import { ValidationError } from 'express-validator';

interface ErrorRes {
  errors?: ValidationError[];
  error?: string;
}

export default ErrorRes;
