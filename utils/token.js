import jwt from 'jsonwebtoken'

export function createToken(payload){
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : '7d'})
    return token
}