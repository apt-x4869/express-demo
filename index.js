const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');

const app = express();

console.log(`NODE_ENV : ${ process.env.NODE_ENV }`);//undefined
console.log(`NODE_ENV : ${ app.get('env') }`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//Configuration
console.log('Application Name : ' + config.get('name'));
console.log('Mail Info : ' + config.get('mail.host'));
console.log('Mail Password : ' + config.get('mail.password'));

if( app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.use(logger);

const courses = [
    { id:1, name: "course1"},
    { id:2, name: "course2"},
    { id:3, name: "course3"}
]

app.get('/',(req,res)=>{
    res.send('Hellow Worlds!!!!');
});

app.get('/api/courses',(req,res)=>{
    res.send(courses);
});


app.post('/api/courses',(req,res)=>{

    const result = validateCourse(req.body);
    
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }

    const course = {
        id: courses.length +1,
        name: req.body.name //needs app.use(express.json());
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id',(req,res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Given ID not found');
    return res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`);
});

app.put('/api/courses/:id',(req,res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Given ID not found');

    const result =validateCourse(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }

    course.name = req.body.name;

    return res.send(course);

});

app.delete('/api/courses/:id',(req,res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Given ID not found');

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(courses);
})


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}