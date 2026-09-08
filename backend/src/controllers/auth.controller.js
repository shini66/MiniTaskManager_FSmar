import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const publicUser = user => ({ id: user.id, name: user.name, email: user.email });
const signToken = user => jwt.sign({sub: user.id}, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '1h'
});

export async function register(req, res){
    const {name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
        return res.status(422).json({ message: 'Nombre, email y contraseña de 8+ caracteres son obligatorios' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
        return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    return res.status(201).json({ user: publicUser(user), token: signToken(user) });
}

export async function login(req, res){
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) return res.status(422).json({ message: 'Faltan credenciales' });

    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user && await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
    return res.json({ user: publicUser(user), token: signToken(user) }); 
}

export async function listUses(req, res){
    res.json(await User.find().select('name email createdAt').sort({createdAt: -1}));
}
