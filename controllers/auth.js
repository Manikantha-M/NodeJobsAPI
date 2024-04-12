const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req, res) => {
    const user = await UserModel.create(req.body);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({token, user:user.getName()});
    
}
const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide valid credentials');
    }
    const user = await UserModel.findOne({email});

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials');
    }

    // compare password
    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect, 'ispasswordcorrect');
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({token, user:user.getName()})

}

module.exports = {register, login}