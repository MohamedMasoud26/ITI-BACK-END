import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'



export const createPartner =  joi.object({
    file:generalFields.file,
}).required()

export const updatePartner=  joi.object({
        partnerId :generalFields.id,
        file:generalFields.file,
}).required()

export const deletePartner =  joi.object({
        partnerId :generalFields.id
}).required()