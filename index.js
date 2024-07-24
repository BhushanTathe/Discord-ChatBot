
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bot messages

    const userInput = message.content;

    try {
        const response = await axios.post(
            'https://api.cohere.ai/v1/generate',
            {
                prompt: userInput,
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${COHERE_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Log the response to understand its structure
        console.log('Cohere API response:', response.data);

        // Ensure the expected structure exists before accessing properties
        if (response.data && response.data.generations && response.data.generations.length > 0 && typeof response.data.generations[0].text === 'string') {
            const botReply = response.data.generations[0].text.trim();
            message.reply(botReply);
        } else {
            console.error('Unexpected response format:', response.data);
            message.reply('Sorry, I couldn’t generate a response. Please try again later.');
        }
    } catch (error) {
        console.error('Error interacting with Cohere API:', error);
        message.reply('Sorry, something went wrong while processing your request.');
    }
});

client.login(DISCORD_BOT_TOKEN);
