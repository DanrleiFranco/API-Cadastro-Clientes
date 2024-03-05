import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash, FiEdit } from 'react-icons/fi'
import { api } from './services/api'

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {
  const [cadastrar, setCadastrar] = useState(true); // Alterado para controlar o estado de cadastro ou edição
  const [clientesVisible, setClientesVisible] = useState(false); // Estado para controlar a visibilidade dos clientes
  const [editandoId, setEditandoId] = useState<string | null>(null); // Adicionando estado para armazenar o ID do cliente que está sendo editado
  const [buttonText, setButtonText] = useState("Usuários Cadastrados"); // Estado para controlar o texto do botão

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const [customers, setCustomers] = useState<CustomerProps[]>([])

  useEffect(() => {
    loadCustomers();
  }, [])

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomers(response.data);
    //console.log(customers)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) {
      alert("Por favor, preencha todos os campos.");
      return;
    };

    if (cadastrar) {
      // Se estiver cadastrando, cadastre um novo cliente
      const response = await api.post("/customer", {
        name: nameRef.current?.value,
        email: emailRef.current?.value
      })

      setCustomers(allCustomers => [...allCustomers, response.data])
    } else {
      // Se estiver editando, atualize os dados do cliente
      if (editandoId) {
        await api.put(`/customer/${editandoId}`, {
          name: nameRef.current?.value,
          email: emailRef.current?.value
        });

        // Atualize os dados localmente
        const updatedCustomers = customers.map(customer => {
          if (customer.id === editandoId) {
            return {
              ...customer,
              name: nameRef.current?.value || customer.name,
              email: emailRef.current?.value || customer.email
            };
          }
          return customer;
        });

        setCustomers(updatedCustomers);
        setCadastrar(true);
        setEditandoId(null);
        clearFields(); // Limpa os campos após a atualização
      }
    }

    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: { id: id }
      })

      const allCustomers = customers.filter((customer) => customer.id !== id)
      setCustomers(allCustomers)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEdit(id: string) {
    // Ao clicar no botão de editar, preencha os campos com os dados do cliente selecionado
    const customerToEdit = customers.find(customer => customer.id === id);
    if (customerToEdit) {
      setCadastrar(false); // Alterando para modo de edição
      setEditandoId(id);
  
      // Verifica se as referências estão definidas antes de atribuir valores a elas
      if (nameRef.current && emailRef.current) {
        nameRef.current.value = customerToEdit.name;
        emailRef.current.value = customerToEdit.email;
      } else {
        console.error("nameRef ou emailRef não está definido.");
      }
    }
  }

  // Função para limpar os campos do formulário
  function clearFields() {
    if (nameRef.current && emailRef.current) {
      nameRef.current.value = "";
      emailRef.current.value = "";
    }
  }

  // Função para mostrar e ocultar clientes
  function handleShowCustomers() {
    setClientesVisible(!clientesVisible); // Alternar entre mostrar e ocultar os clientes
    
    // Alterar o texto do botão com base na visibilidade dos clientes
    if (clientesVisible) {
      setButtonText("Usuários Cadastrados");
    } else {
      setButtonText("Ocultar Usuários");
    }
  }

  return (
    <div className="w-full min-h-screen bg-white flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-black">{ cadastrar ? "Cadastrar Usuários" : "Atualizar dados"}</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-black">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            className="w-full mb-5 border border-black rounded p-2"
            ref={nameRef}
          />

          <label className="font-medium text-black">Email:</label>
          <input
            type="email"
            placeholder="Digite seu Email"
            className="w-full mb-5 border border-black rounded p-2"
            ref={emailRef}
          />

          <input 
            type="submit" 
            value={cadastrar ? "Cadastrar" : "Atualizar"} 
            className="cursor-pointer w-full p-2 bg-blue-300 rounded font-medium hover:bg-blue-400 active:bg-blue-700 focus:outline-none focus:ring" 
          />

          {!cadastrar && (
            <button
              type="button"
              onClick={() => {
                setCadastrar(true); // Voltar para o modo de cadastro
                clearFields(); // Limpar os campos
              }}
              className="cursor-pointer w-full mt-6 p-2 bg-red-300 rounded font-medium hover:bg-red-400 focus:outline-none focus:ring"
            >
              Cancelar Edição
            </button>
          )}
        </form>

        <button
          onClick={handleShowCustomers}
          className="cursor-pointer w-full p-2 bg-blue-300 rounded font-medium hover:bg-blue-400 active:bg-blue-700 focus:outline-none focus:ring"
        >
          {buttonText}
        </button>

        {clientesVisible && (
          <section className="flex flex-col gap-4 mt-4">
            {customers.map((customer) => (
              <article
                key={customer.id}
                className="w-full bg-gray-200 rounded p-2 relative hover:scale-105 duration-200"
              >
                <p><span className="font-medium">Nome:</span>{customer.name}</p>
                <p><span className="font-medium">Email:</span>{customer.email}</p>
                <p><span className="font-medium">Status:</span>{customer.status ? "Ativo" : "Inativo"}</p>

                <button
                  className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'
                  onClick={() => handleDelete(customer.id)}
                >
                  <FiTrash size={18} color="#FFF" />
                </button>

                <button
                  className='bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-10 -top-2'
                  onClick={() => handleEdit(customer.id)}
                >
                  <FiEdit size={18} color="#FFF" />
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
