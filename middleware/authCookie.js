import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../Errors/customError.js';

export const checkCookie = async (req, res, next) => {
  try {
    const token = req.signedCookies?.login;

    if (!token) {
      throw new UnauthenticatedError("No login cookie exists");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // You now have access to payload.id and payload.name
    req.user = {
      id: payload.userId,
      name: payload.name,
    };

    next();
  } catch (err) {
    next(new UnauthenticatedError("Invalid or expired login session"));
  }
};
// export const check = async(req,res,next) =>{
//   try {
//     const token = req.signedCookies?.sessionId;
//     console.log("Signed Cookies:", req.signedCookies);
//     if (!token) {
//       throw new UnauthenticatedError("No login cookie exists");
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
    
//     // You now have access to payload.id and payload.name
//     req.user1 = payload

//     next();
//   } catch (err) {
//     next(new UnauthenticatedError("Invalid session"));
//   }
// }

