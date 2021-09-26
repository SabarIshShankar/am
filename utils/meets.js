const Meet = require('../models/meet');
const User = require('../models.user');

exports.createMeet = async({roomId, hostID}) => {
	try{
		const meet = await new Meet({
			_id: roomId,
			members: [hostId]
		}).save();
		await User.findByAndUpdate(hostId, {
			$push: {
				'meets': meet._id
			}
		})
	}
	catch(err){
		console.log(err)
	}
}

exports.addMember = async({roomId, userId}) => {
	try{
		await Promise.all([
			User.findByIdAndUpdate(userId, {
				$addToSet: {
					'meets': roomId
				}
			}),
			Meet.findByIdAndUpdate(roomId, {
				$addToSet: {
					'members': userId
				}
			})
		])
	}
	catch(err{
		console.log(err)
	})
}