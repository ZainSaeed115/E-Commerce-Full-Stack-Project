import jwt from "jsonwebtoken"

const generateTokens=(res,userId)=>{

    const token=jwt.sign(
        {userId},
        process.env.JWT_SECRET_KEY,
        {expiresIn:process.env.JWT_EXPIRY}
    )

    // set jwt as an http-only cookie 
    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV!=='development',
        sameSite:'Strict',
        maxAge:30 * 24 * 60 * 1000
      }

      res.cookie('jwt',token,options)
      return token;

}
export default generateTokens