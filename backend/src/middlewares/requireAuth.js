import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function requiredAuth(req, res, next){

    const [scheme, token] = (req.get('authorization') || '').split(' ');

    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido o vencido' });
    }
}