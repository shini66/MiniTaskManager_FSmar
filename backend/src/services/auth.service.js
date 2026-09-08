import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

async function registerUser(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingEmail = await User.findOne({ $or: [{ user: userData.user }, { email: userData.email }] });
            if (existingEmail) {
                return reject(new Error('User or email already exists'));
            }
            const user = new User(userData);
            await user.save();
            const token = generateToken(user);
            resolve({ user: { id: user._id, user: user.user, email: user.email }, token });
        } catch (error) {
            reject(error);
        }
    });
}

async function loginUser({ email, password }) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingEmail = await User.findOne({ email });
            if (!existingEmail) {
                return reject(new Error('Invalid credentials'));
            }

            const isMatch = await existingEmail.comparePassword(password);
            if (!isMatch) {
                return reject(new Error('Invalid credentials'));
            }

            resolve({ user: { id: existingEmail._id, name: existingEmail.name, email: existingEmail.email }, token: generateToken(existingEmail) });
        } catch (error) {
            reject(error);
        }
    }); 
}


export { registerUser, loginUser }