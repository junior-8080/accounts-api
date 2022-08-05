const Joi = require("joi");

const schema = Joi.object({
    firstname:Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().regex(/'^[a-zA-Z0-9]{3,30}$'/),
    confirmPassword: Joi.ref('password'),
    access_token : [Joi.string(),Joi.number()]
})

const data = {
    firstname:"junior",
    lastname:"Van",
    password:"899009099",
    confirmPassword:"99696969696",
    access_token:['hshdhhshdhhs',23],

}

const valid = schema.validate(data,{abortEarly:false})

if(valid.error){
    const err = valid.error.details.map((detail) => {
        return {field:detail.context.label,message:detail.message,value:detail.context.value}
    })

    console.log({
        statusCode:401,
        message:"Invalid Parameters",
        data : err
    })
}
