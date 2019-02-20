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

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
