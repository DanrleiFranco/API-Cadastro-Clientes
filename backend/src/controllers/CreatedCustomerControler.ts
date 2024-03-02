import { FastifyRequest, FastifyReply } from 'fastify'

import {CreatedCustomerService} from '../services/CreatedCustomerService'

class CreatedCustomerControler{
    async handle(request: FastifyRequest, reply: FastifyReply){
     const {name, email} = request.body as {name: string, email: string};
    

     const customerService = new CreatedCustomerService()
     const customer = await customerService.execute({name, email});

     reply.send(customer)
    }
}

export{CreatedCustomerControler}