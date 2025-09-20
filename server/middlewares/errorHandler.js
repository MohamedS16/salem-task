const responseHandler = require('./../middlewares/responseHandler');

const errorHandler = (err, req, res, next) => {
    console.error(err); 
  
    let errors = []; 
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

  
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      errors.push(`${field} is already in use. Please use another ${field}.`);
      status = 400;
      message = 'Duplicate Entries';
    }
  
    else if (err.name === 'ValidationError') {
      errors = Object.values(err.errors).map(error => error.message);
      status = 400;
      message = 'Validation Error';
    }
  
    else if (err.name === 'CastError') {
      errors.push(`Invalid ${err.path}: ${err.value}`);
      status = 400;
      message = 'Invalid Value';
    }
  
    else if (err.errors){
        err?.errors?.map((e)=>errors.push(e.msg || e))
        status = 400;
        message = err.message || 'fail';
    }
    else {
      errors.push(err.message || 'Something went wrong. Please try again later.');
    }
  
    responseHandler(res, {success : false, status, message, errors})
  };
  
  module.exports = errorHandler;
  