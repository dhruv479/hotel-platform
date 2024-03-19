export class ErrorResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
  message?: any;
  name?: string;
}

export class SuccessResponse {
  success = true;
  data: any;
  constructor(data) {
    this.data = data;
  }
}

export interface SuccessDto<T> {
  success: boolean;
  data: T;
}

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}

export const UserTypes = {
  ADMIN: 'ADMIN',
  DEFAULT: 'DEFAULT',
};
