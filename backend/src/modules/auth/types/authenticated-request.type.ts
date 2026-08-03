import { Request } from 'express';
import { AdminProfile } from './admin-profile.type';

// Passport attaches the strategy's validate() return value as `request.user`
// — this just gives that field a concrete type instead of `any`.
export interface AuthenticatedRequest extends Request {
  user: AdminProfile;
}
