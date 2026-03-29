// Firebase auth is handled client-side, no middleware needed
// Protected routes are handled by the AuthContext in components
export default function middleware() {}
export const config = { matcher: [] }
