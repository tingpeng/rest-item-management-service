const LostItem = require("../models/LostItemModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Lost item Schema
function LostItemData(data) {
	this.id = data._id;
	this.title= data.title;
	this.description = data.description;
}

/**
 * Item List.
 * 
 * @returns {Object}
 */
// exports.lostItemList = [
// 	auth,
// 	function (req, res) {
// 		try {
// 			LostItem.find({user: req.user._id},"_id title description isbn createdAt").then((lostItems)=>{
// 				if(lostItems.length > 0){
// 					return apiResponse.successResponseWithData(res, "Operation success", lostItems);
// 				}else{
// 					return apiResponse.successResponseWithData(res, "Operation success", []);
// 				}
// 			});
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

// Handle index actions
exports.lostItemList = function (req, res) {
    LostItem.findById(req.params.lostItem_id, function (err, lostitem) {
        if (err)
            res.send(err);
        res.json({
            message: 'Lost item details loading..',
            data: lostitem
        });
    });
};

/**
 * Lostitem Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.lostItemDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			LostItem.findOne({_id: req.params.id,user: req.user._id},"_id title description isbn createdAt").then((book)=>{                
				if(book !== null){
					let bookData = new LostItemData(book);
					return apiResponse.successResponseWithData(res, "Operation success", bookData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Lostitem store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * 
 * @returns {Object}
 */

// exports.lostItemStore = [
// 	auth,
// 	body("id", "Title must not be empty.").isLength({ min: 1 }).trim(),
// 	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
// 	body("description", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
// 		return LostItem.findOne({isbn : value,user: req.user._id}).then(Item => {
// 			if (Item) {
// 				return Promise.reject("Item already exist.");
// 			}
// 		});
// 	}),
// 	sanitizeBody("*").escape(),
// 	(req, res) => {
// 		try {
// 			const errors = validationResult(req);
// 			var lostItem = new LostItem(
// 				{ 
// 					id: req.body.title,
// 					title: req.body.title,
// 					description: req.body.description,
// 					// category: req.body.category,
// 					// status: req.body.status,
// 					// timestamp: req.body.timestamp,
// 					// location: location,
// 					// image: req.body.image,
// 					// keyword: req.body.keyword,
// 					// comment: req.body.comment,
// 					// vote: req.body.vote
// 				});

// 			if (!errors.isEmpty()) {
// 				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
// 			}
// 			else {
// 				//Save book.
// 				lostItem.save(function (err) {
// 					if (err) { return apiResponse.ErrorResponse(res, err); }
// 					let lostItemData = new LostItemData(lostItem);
// 					return apiResponse.successResponseWithData(res,"LostItem registered add success.", lostItemData);
// 				});
// 			}
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

exports.lostItemStore = (req, res) => {
			try {
				const errors = validationResult(req);
				var lostItem = new LostItem(
					{ 
						id: req.body.title,
						title: req.body.title,
						description: req.body.description,
						// category: req.body.category,
						// status: req.body.status,
						// timestamp: req.body.timestamp,
						// location: location,
						// image: req.body.image,
						// keyword: req.body.keyword,
						// comment: req.body.comment,
						// vote: req.body.vote
					});
	
				if (!errors.isEmpty()) {
					return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
				}
				else {
					//Save book.
					lostItem.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let lostItemData = new LostItemData(lostItem);
						return apiResponse.successResponseWithData(res,"LostItem registered add success.", lostItemData);
					});
				}
			} catch (err) {
				//throw error in json response with status 500. 
				return apiResponse.ErrorResponse(res, err);
			}
		}

/**
 * Lostitem update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * 
 * @returns {Object}
 */
exports.lostItemUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return LostItem.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
			if (book) {
				return Promise.reject("Book already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new LostItem(
				{ title: req.body.title,
					description: req.body.description,
					isbn: req.body.isbn,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					LostItem.findById(req.params.id, function (err, foundBook) {
						if(foundBook === null){
							return apiResponse.notFoundResponse(res,"Book not exists with this id");
						}else{
							//Check authorized user
							if(foundBook.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update book.
								LostItem.findByIdAndUpdate(req.params.id, book, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let bookData = new LostItemData(book);
										return apiResponse.successResponseWithData(res,"Book update Success.", bookData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Lostitem Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.lostItemDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			LostItem.findById(req.params.id, function (err, foundBook) {
				if(foundBook === null){
					return apiResponse.notFoundResponse(res,"Book not exists with this id");
				}else{
					//Check authorized user
					if(foundBook.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete book.
						LostItem.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Book delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];