const responseHandler = (res, { success = true, status = 200, message = '', data = null, errors = null }) => {
    res.status(status).json({
      success,
      message,
      data,
      errors
    });
  };
  
  module.exports = responseHandler;