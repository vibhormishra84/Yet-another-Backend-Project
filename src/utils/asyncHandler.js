//wrapper function to handle async functions in express routes and contollers
const asyncHandler=(fn)=>async(req,res,next)=>{
    try{
        await fn(req,res,next)
    }
    catch(error){
        res.status(error.code||500).json({
            success:false,
            message:error.message
        })
    }
}

export {asyncHandler};