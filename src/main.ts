import dotenv from 'dotenv'
dotenv.config()
import { Client, Intents } from 'discord.js';

import { command, button } from './tictactoe';

const client = new Client({ intents: Intents.ALL })


client.on('ready', async () => {

    console.log(`Logged in as ${client.user?.tag}!`);

})

client.ws.on('INTERACTION_CREATE', async interaction => {
    
    if (interaction.type === 2) {

        if (interaction.data.name === 'tic') {

            try {
                command(interaction, client)
            } catch (err) {
                console.error(err)
            }

        }

    } else {

        if (interaction.message.interaction?.name === 'tic') {

            button(interaction, client)
        
        }

    }
    
})


client.login(process.env.TOKEN)