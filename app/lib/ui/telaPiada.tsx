'use client';

import { useEffect, useState } from 'react';
import { Piada } from '../domain/piadas';

export default function TelaPiada() {

    const [piadas, setPiadas] = useState<Piada[]>([]);
    const [piada, setPiada] = useState<Piada>({ id: "", titulo: "", descricao: "" });
    const [mensagem, setMensagem] = useState("");

    const handleSelect = async () => {
        const response = await fetch('/api/piadas');
        const data = await response.json();
        setPiadas(data.piadas);
    }

    useEffect(() => {
        handleSelect();
    }, []);

    const handleChange = (event: React.FormEvent<EventTarget>) => {
        let target = event.target as HTMLInputElement;
        const fieldName = target.name;
        const fieldValue = target.value;
        setPiada((objetoAtual) => {
            return { ...objetoAtual, [fieldName]: fieldValue }
        });
        setMensagem("");
    };

    const handleSave = async (event: React.FormEvent<EventTarget>) => {
        if (piada.id.length > 0) {
            await fetch(`/api/piadas/${piada.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(piada),
            })
                .then((response) => response.json())
                .then((data) => setMensagem(data.mensagem));
        } else {
            await fetch('/api/piadas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(piada),
            })
                .then((response) => response.json())
                .then((data) => setMensagem(data.mensagem));
        }
        setPiada({ id: "", titulo: "", descricao: "" });
        handleSelect();
    }

    const handleEdit = async (event: React.FormEvent<EventTarget>) => {
        let target = event.target as HTMLButtonElement;
        let id = target.value;
        await fetch(`/api/piadas/${id}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => setPiada(data.piada));
    }

    const handleDelete = async (event: React.FormEvent<EventTarget>) => {
        let target = event.target as HTMLButtonElement;
        let id = target.value;
        await fetch(`/api/piadas/${id}`, {
            method: 'DELETE',
        }).then(response => response.json()).then(data => setMensagem(data.mensagem));
        setPiada({ id: "", titulo: "", descricao: "" });
        handleSelect();
    }


    return (
        <div className='flex-1 rounded-lg bg-gray-50 px-4 pb-4 pt-8'>
            <h1 className="mb-4 font-extrabold leading-none tracking-tight lg:text-2xl mx-auto text-center">
                Sistema de envio de piadas!
            </h1>
            <form className="max-w-sm mx-auto">
                <input name='id' value={piada.id} onChange={handleChange} className="invisible" />
                <div className="mb-5">
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Título da piada</label>
                    <input name="titulo" value={piada.titulo} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Título" />
                </div>
                <div className="mb-5">
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Descrição da piada</label>
                    <input name="descricao" value={piada.descricao} onChange={handleChange} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type='text' placeholder="descrição" />
                </div>
                <div className="mb-5 flex justify-center items-center">
                    <button onClick={handleSave} className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar</button>
                </div>
            </form>
            <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-2 py-3" role="alert">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
                <p>{mensagem}</p>
            </div>
            <table>
                <thead className="text-white uppercase dark:text-white">
                    <tr>
                        <th scope="col" className="w-2/3 px-6 py-3 bg-gray-800 dark:bg-gray-800">
                            Título
                        </th>
                        <th scope="col" className="w-2/3 px-6 py-3 bg-gray-800 dark:bg-gray-800">
                            Piada
                        </th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {piadas &&
                        piadas.map((item) =>
                            <tr key={item.id}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">{item.titulo}</td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">{item.descricao}</td>
                                <td><button onClick={handleEdit} value={item.id} className="bg-gray-800 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">E</button></td>
                                <td><button onClick={handleDelete} value={item.id} className="bg-gray-800 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">X</button></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
