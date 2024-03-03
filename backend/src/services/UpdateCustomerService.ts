import prismaClient from "../prisma";

interface UpdateCustomerProps {
    id: string;
    name: string;
    email: string;
}

class UpdateCustomerService {
    async execute({ id, name, email }: UpdateCustomerProps) {
        if (!id || !name || !email) {
            throw new Error("Solicitação inválida.")
        }

        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id: id
            }
        })

        if (!findCustomer) {
            throw new Error("Cliente não existe")
        }

        const updatedCustomer = await prismaClient.customer.update({
            where: {
                id: findCustomer.id
            },
            data: {
                name: name,
                email: email
            }
        })

        return updatedCustomer

    }
}

export { UpdateCustomerService }
