import { FastifyRequest, FastifyReply } from 'fastify'
import { UpdateCustomerService } from '../services/UpdateCustomerService'

class UpdateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string } // Acessar o ID da URL
        const { name, email } = request.body as { name: string, email: string } // Acessar os dados do corpo da solicitação

        const customerService = new UpdateCustomerService()

        const updatedCustomer = await customerService.execute({ id, name, email })

        reply.send(updatedCustomer)
    }
}

export { UpdateCustomerController }
