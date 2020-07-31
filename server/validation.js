//VALIDATION

const Joi = require("@hapi/joi");

// Register Validation
const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(255).required(),
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
// Register Validation
const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
// Card Validation
const cardValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(6).max(50).required(),
		card_network: Joi.string().min(3).max(15).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
// Card Validation
const cardUpdateValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(6).max(50),
		card_network: Joi.string().min(3).max(15),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};

module.exports = {
	registerValidation,
	loginValidation,
	cardValidation,
	cardUpdateValidation
};