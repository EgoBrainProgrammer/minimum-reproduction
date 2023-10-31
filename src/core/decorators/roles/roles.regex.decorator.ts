import { SetMetadata } from '@nestjs/common';

export const ROLES_REGEX_KEY = 'rolesregex';
export const RolesRegex = (...roles: RegExp[]) => SetMetadata(ROLES_REGEX_KEY, roles);