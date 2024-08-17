import { isValidObjectId } from "mongoose";

function checkId(req,res,next){
    if(!isValidObjectId(req.params.id)){
        req.status(404)
        console.error(`Invalid Object of :${req.params.id}`)
      
    }
    next()
}

export default checkId;