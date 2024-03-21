import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createRecent =  joi.object({
    file:generalFields.file,
}).required()

export const updateRecent=  joi.object({
        recentId :generalFields.id,
        file:generalFields.file,
}).required()

export const deleteRecent =  joi.object({
        recentId :generalFields.id
}).required()