import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ADMIN = 'requireAdmin';
export const RequireAdmin = () => SetMetadata(REQUIRE_ADMIN, true);
