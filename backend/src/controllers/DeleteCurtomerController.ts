import { FastifyRequest, FastifyReply } from 'fastify'
import { DeleteCurtomerService } from '../services/DeleteCurtomerService'

class DeleteCurtomerController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const {id} = request.query as {id: string}

        const customerService = new DeleteCurtomerService();

        const customer = await customerService.execute({id})

        reply.send(customer);

    }
}

export {DeleteCurtomerController}