class ApiError extends Error{
    constructor(
        statusCode,
        meassage="Something went wrong",
        errors=[],
        stack=""
    ){
        super();
        this.statusCode=statusCode;
        this.data=null;
        this.meassage=meassage;
        this.success=false;
        this.errors=errors;

        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export {ApiError};