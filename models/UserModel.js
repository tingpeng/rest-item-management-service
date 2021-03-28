var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	id: {type: String, required: true},
	username: {type: String, required: false},
	password: {type: String, required: false},
	name: {type: String, required: false},
	birthdate: {type: Date, required: false},
	gender: {type: Boolean, required: false, default: 0},
	contactno: {type: String, required:false},
	email: {type: String, required: false},
	otpTries: {type: Number, required:false, default: 0},
	status: {type: Boolean, required: false, default: 1}
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);
