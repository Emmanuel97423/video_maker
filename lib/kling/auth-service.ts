import jwt from 'jsonwebtoken';

const ACCESS_KEY = process.env.NEXT_PUBLIC_KLING_ACCESS_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_KLING_SECRET_KEY;

export class KlingAuthService {
    static generateToken(): string {
        const headers = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const payload = {
            iss: ACCESS_KEY,
            exp: Math.floor(Date.now() / 1000) + 1800, // Current time + 30 minutes
            nbf: Math.floor(Date.now() / 1000) - 5 // Current time - 5 seconds
        };

        return jwt.sign(payload, SECRET_KEY!, { 
            algorithm: 'HS256',
            header: headers 
        });
    }
} 