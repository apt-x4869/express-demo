const express = require('express');

const router = express.Router();

const courses = [
    { id:1, name: "course1"},
    { id:2, name: "course2"},
    { id:3, name: "course3"}
];

router.get('/',(req,res)=>{
    res.send(courses);
});


router.post('/',(req,res)=>{

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

router.get('/:id',(req,res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Given ID not found');
    return res.send(course);
});

router.put('/:id',(req,res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Given ID not found');

    const result =validateCourse(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }

    course.name = req.body.name;

    return res.send(course);

});

router.delete('/:id',(req,res)=>{

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



module.exports = router;