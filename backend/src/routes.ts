import {FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply} from "fastify"
import { CreatedCustomerControler } from './controllers/CreatedCustomerControler'
import { ListCustomersController } from './controllers/ListCustomersController'
import { DeleteCurtomerController } from './controllers/DeleteCurtomerController'
import { UpdateCustomerController } from "./controllers/UpdateCustomerController"

export async function routes(fastify:FastifyInstance, options: FastifyPluginOptions){

    fastify.get("/teste", async(request: FastifyRequest, Reply: FastifyReply)=>{
        return {ok: true}
    })

    fastify.post("/customer", async(request: FastifyRequest, reply: FastifyReply)=>{
      return new CreatedCustomerControler().handle(request, reply)
    })
    
    fastify.get("/customers", async(request: FastifyRequest, reply: FastifyReply)=>{
        return new ListCustomersController().handle(request, reply)
      })

    fastify.delete("/customer", async(request: FastifyRequest, reply: FastifyReply)=>{
        return new DeleteCurtomerController().handle(request, reply)
    })

    fastify.put("/customer/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      return new UpdateCustomerController().handle(request, reply)
  })
  
}