import * as userService from "../services/user.service.js";

export function requireRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await userService.getCurrentUser(req.user.uid);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }

      // Добавляем информацию о пользователе в запрос для дальнейшего использования
      req.userData = user;
      next();
    } catch (err) {
      console.error("Role check error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
