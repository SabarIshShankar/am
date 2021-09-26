const Meet = require('../models/meet');

exports.getTranscript = async(req, res) => {
	try{
		const {id} = req.userData
		const meet = Meet.findById(req.body.meetID)
		if(!meet.members.inclued(id)){
			return res.status(401).json({
				UNAUTHORIZED: "not part of the meeting";
			})
		}
		return res.status(200).json({
			transcript: meet.messages
		})
	}
	catch(err){
		console.log(err)
	}
}