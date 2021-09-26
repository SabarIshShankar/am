const Meet = require('../models/meet')

exports.addMessage = async({meetId, sender, message}) => {
	try{
		await Meet.findByIdAndUpdate(meetId, {
			$push: {
				messages: {
					message, sender
				}
			}
		})
	}catch(err){
		console.log(err)
	}
}