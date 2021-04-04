import { CommandClient } from 'eris';
import { TsumekiClient } from '../../client';
import { TCommand } from '../../command';
import { loadCommands, logger } from '../../functions';

export default class Reload extends TCommand {
    constructor(client: TsumekiClient) {
        super(
            'reload',
            async (msg, args) => {
                const reloading = await msg.channel.createMessage(
                    'Reloading commands...',
                );
                for (const cmd in client.commands) {
                    client.unregisterCommand(cmd);
                    logger({
                        message: `Unregistered command: ${cmd}`,
                        logType: 'LOG',
                        headerText: 'cmd reload',
                    });
                }
                loadCommands('./commands', client, true);
                reloading.edit('Reloaded commands!');
            },
            {},
        );
    }
}
