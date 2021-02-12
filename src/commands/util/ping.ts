import { CommandClient } from 'eris';
import { TCommand } from '../../command';
import { stripIndents } from 'common-tags';
import { timeTranslate } from '../../functions';

export default class Ping extends TCommand {
    constructor(client: CommandClient) {
        super(
            'ping',
            async (msg, args) => {
                const pingMsg = await msg.channel.createMessage('Pinging...');
                return pingMsg.edit(stripIndents`
                    Pong🏓
                    Bot: \`${pingMsg.timestamp - msg.timestamp}ms\`
                    Uptime: \`${timeTranslate(client.uptime)}\`
		        `);
            },
            {
                aliases: ['p', 'pong'],
                description: `Pings the bot`,
            },
        );
    }
}
