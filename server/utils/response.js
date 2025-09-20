const response = (res,status,msg,data,cookies=null)=>{
    if(cookies){
    return res.status(status).json({
        status: 'success',
        msg,
        data
    }).cookie(cookies);
    }
    return res.status(status).json({
        status: 'success',
        msg,
        data
    });
}   

module.exports = response