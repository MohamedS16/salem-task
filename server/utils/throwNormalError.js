const throwNormalError = (er)=>{
    return { status: 400, message: 'fail', errors: er };
}

module.exports = throwNormalError