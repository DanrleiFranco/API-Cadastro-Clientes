import prismaClient from "../prisma";

interface DeleteCurtomerProps{
    id: string;
}


class DeleteCurtomerService{
    async execute({id}: DeleteCurtomerProps){

      if(!id){
        throw new Error("Solicitação inválida.")
      }

      const findCustomer = await prismaClient.customer.findFirst({
        where:{
            id:id
        }
      })

      if(!findCustomer){
        throw new Error("Usuário inexistente")
      }

      await prismaClient.customer.delete({
        where:{
            id:findCustomer.id
        }
      })

      return {message: "Deletado com sucesso"}

    }        
}

export { DeleteCurtomerService}