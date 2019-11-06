const Joi = require('joi');
const logger = require('./middleware/logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');
const courses =require('./routes/courses')
const home =require('./routes/home')
const app = express();

app.set('view engine','pug');
app.set('views','./views')
console.log(`NODE_ENV : ${ process.env.NODE_ENV }`);//undefined
console.log(`NODE_ENV : ${ app.get('env') }`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses',courses);
app.use('/',home);

//Configuration
console.log('Application Name : ' + config.get('name'));
console.log('Mail Info : ' + config.get('mail.host'));
console.log('Mail Password : ' + config.get('mail.password'));

if( app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.use(logger);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`);
});
