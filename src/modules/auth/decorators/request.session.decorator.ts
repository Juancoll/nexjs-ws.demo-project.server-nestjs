import { createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const RequestSession = createParamDecorator( ( data, req: Request ) => {
    return req.session
} )