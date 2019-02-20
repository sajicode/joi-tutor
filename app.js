const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// TODO: import routes
const Routes = require('./routes');

const app = express();

const port = process.env.NODE_ENV || 3000;

app.set('port', port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use('/', Routes);

app.post('/test', (req, res, next) => {
	const Joi = require('joi');

	const data = req.body;

	// define validation schema
	const schema = Joi.object().keys({
		// email is required
		// email must be a valid email string
		email: Joi.string().email().required(),

		// phone is required
		// must be a string in the format xxx-xxx-xxxx
		// where x is digit 0 - 9
		phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),

		// birthday is not required
		// birthday must be a valid ISO-8601 date
		// dates before Jan 1, 2014 are not allowed
		birthday: Joi.date().max('1-1-2004').iso()
	});

	// validate the request data against the schema
	Joi.validate(data, schema, (err, value) => {
		// create a random number as id
		const id = Math.ceil(Math.random() * 9999999);

		if (err) {
			// send a 422 error response if validation fails
			res.status(422).json({
				status: 'error',
				message: 'Invalid request data',
				data: data
			});
		} else {
			// send a success response if validation passes
			// attach the random ID to the data response
			res.json({
				status: 'success',
				message: 'User created successfully',
				data: Object.assign({ id }, value)
			});
		}
	});
});

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
