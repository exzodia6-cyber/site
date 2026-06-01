import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET ?? 'dev-secret';
export function signToken(user: { id: string; email: string; role: string }) { return jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' }); }
export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Нужна авторизация' });
  try { (req as any).user = jwt.verify(header.slice(7), secret); next(); } catch { res.status(401).json({ message: 'Недействительный токен' }); }
}
export function admin(req: Request, res: Response, next: NextFunction) { if ((req as any).user?.role !== 'admin') return res.status(403).json({ message: 'Только администратор' }); next(); }
