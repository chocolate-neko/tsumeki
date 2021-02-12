import { CommandClient } from 'eris';
import { TCommand } from '../../command';
import { loadCommands, logger } from '../../functions';

export default class Reload extends TCommand {
    constructor(client: CommandClient) {
        super(
            'reload',
            async (msg, args) => {
                const reloading = await msg.channel.createMessage(
                    'Reloading commands...',
                );
                for (const cmd in client.commands) {
                    client.unregisterCommand(cmd);
                    logger(`Unregistered command: ${cmd}`, 'LOG', 'cmd reload');
                }
                loadCommands('./commands', client, true);
                reloading.edit('Reloaded commands!');
            },
            {},
        );
    }
}
