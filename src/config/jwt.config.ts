export const jwtConstants = {
  secret:
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10),
};
