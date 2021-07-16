import { SiteClient } from 'datocms-client';

export default async function requestRecivier(request, response) {
    if(request.method === 'POST') {
        const TOKEN = 'c72a089a18de6002a3cf3788b5a82f';
        const client = new SiteClient(TOKEN);

       
        const registroCriado = await client.items.create({
            itemType: "972019", 
            ...request.body,
        })

        console.log(registroCriado);

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
} 