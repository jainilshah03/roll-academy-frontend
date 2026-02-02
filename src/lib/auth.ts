import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-secret";

export function getUserFromCookie(cookieStore: any) {
  try {
    const token = cookieStore.get("auth_token")?.value; // unified name
    if (!token) return null;

    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch {
    return null;
  }
}
