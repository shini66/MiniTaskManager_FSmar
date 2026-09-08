import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requiredAuth(req, res, next){

    const [scheme, token] = (req.get('authorization') || '').split(' ');

    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Token requerido' });

    try {
        req.auth = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido o vencido' });
    }
}