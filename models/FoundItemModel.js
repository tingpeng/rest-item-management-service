var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var location = new Schema({
	gps: String,
	keyword: [String]
});

var comment = new Schema({
	
	timestamp: Date,
	text: String
});

var vote = new Schema({
	// user: User,
	timestamp: Date,
	score: Number
});

var FoundItemSchema = new Schema({
	id: {type: String, required: true},
	title: {type: String, required: false},
	description: {type: String, required: false},
	category: {type: String, required: false},
	status: {type: String, required: false},
	timestamp: {type: Date, required: false},
	dropofflocation: location,
	image: {type: [String], required: false},
	keyword: {type: [String], required: false},
	comment: comment,
	vote: vote,
}, {timestamps: true});

module.exports = mongoose.model("FoundItem", FoundItemSchema);