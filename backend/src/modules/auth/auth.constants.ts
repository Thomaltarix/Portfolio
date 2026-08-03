// Shared between AuthController (sets/clears the cookie) and JwtStrategy
// (reads it back out of the request) — kept in one place so the two never drift.
export const ADMIN_TOKEN_COOKIE = 'admin_token';
