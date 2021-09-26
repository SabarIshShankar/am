const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateTokens} = require('../config/jwt');
const User = require('../models/user');

exports.login = async(req, res) => {
	try{
		const user = await User.find({email: req.body.email}).select("+password").limit(1);
		if(user.length === 0){
			return res.status(404).json({
				NOT_FOUND = 'doesnt exist'
			})
		}
		const invalid = await bcrypt.compare(req.body.password, user[0].password)
		if(!isValid){
			return res.status(401).json({
				UNAUTHORIZED: 'Invalid creds'
			})
		}
		user[0].password = undefined
		const tokenpair = await generateTokens(user[0]._id, user[0].name)
		const dt = new Date()
		res.cookie('refresh_token_video_conf', tokenpair[1], {
			httpOnly: true,
			sameSite: true,
			expiers: new Date(dt.setMonth(dt.getMonth()+6)),
			secure: false
		})
		return res.status(200).json({
			message: 'Auth successful',
			profile: user,
			access_token: tokenpair[0]
		})
	}
	catch(err){
		console.log(err)
		res.status(500).json({
			SOMETHING_WENT_WRONG:  'try again'
		})
	}
}