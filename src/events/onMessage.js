import { Events } from "discord.js";
import { generateResponseMessage } from "../util/messageHandeler.mjs";
import 'dotenv/config';

/** @type {import('./index.js').Event<Events.MessageCreate>} */
export default {
  name: Events.MessageCreate,
  async execute(message) {
    console.log('[INFO] Message received:', message.content);
    if (message.author.bot) return;
    if (process.env.CHANNEL_ID.includes(message.channel.id) === false) return;


    // Construct the messages object by adding the system message and 20 messages history and the current message
    const messages = [];
    const systemMessage = {
        "role": "system",
        "content": process.env.SYSTEM_MESSAGE,
      };

    const messagesHistory = await message.channel.messages.fetch({ limit: 5 });

    messages.push(
      ...messagesHistory.map((msg) => ({
        "role": msg.author.bot ? 'assistant' : 'user',
        "content": `${msg.author.username}: ${msg.content}`,
      }))
    );

    messages.reverse();
    
    // Add the system message to the first index
    messages.unshift(systemMessage);
    
    console.log('[INFO] Messages:', messages);

    try {
      const response = await generateResponseMessage(messages);
      console.log('[INFO] Response:', response.data);
      
      const responseMessage = response.data.response;
      
      // Segments the response message into 2000 character chunks
      const chunkedResponseMessage = responseMessage.match(/[\S\s]{1,2000}/g);
      
      // Send the response message in chunks
      for (const chunk of chunkedResponseMessage) {
        await message.channel.send(chunk);
      }
        
    } catch (error) {
      console.error('[ERROR] Error generating response:', error);
    }
  },
};
