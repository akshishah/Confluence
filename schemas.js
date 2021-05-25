const Joi = require('joi')

module.exports.postSchema = Joi.object({
    
        author: Joi.string().required(),
        description: Joi.string().required(),
        state: Joi.string().required()   
});


module.exports.commentSchema = Joi.object({
    
        comment: Joi.string().required()
})

