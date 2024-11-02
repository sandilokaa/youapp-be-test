import { HttpStatus } from '@nestjs/common';
import ApiError from './ApiError';

/**
 * Admin-Related Errors
 */
export const NoUserFoundError = () => {
  throw new ApiError(
    HttpStatus.NOT_FOUND,
    'User not found',
    'User with the specified ID is not found',
  );
};

export const UserAlreadyExistsError = () => {
  throw new ApiError(
    HttpStatus.CONFLICT,
    'User already exists',
    'There already exists an user with this email',
  );
};

/**
 * Auth-Related Errors
 */

export const WrongPasswordError = () => {
  throw new ApiError(
    HttpStatus.UNAUTHORIZED,
    'Wrong password',
    'The password you provided is incorrect',
  );
};
