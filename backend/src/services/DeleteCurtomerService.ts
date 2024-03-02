import prismaClient from "../prisma";

interface DeleteCurtomerProps{
    id: string;
}


class DeleteCurtomerService{
    async execute({id}: DeleteCurtomerProps){

      if(!id){
        throw new Error("Solocitação inválida.")
      }

      const findCustomer = await prismaClient.customer.findFirst({
        where:{
            id:id
        }
      })

      if(!findCustomer){
        throw new Error("Cliente não existe")
      }

      await prismaClient.customer.delete({
        where:{
            id:findCustomer.id
        }
      })

      return {message: "deletado com sucesso"}

    }        
}

export { DeleteCurtomerService}