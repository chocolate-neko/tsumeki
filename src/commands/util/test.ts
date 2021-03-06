import { CommandClient, CommandGenerator, CommandOptions } from 'eris';
import { TsumekiClient } from '../../client';
import { TCommand } from '../../command';

export default class Test extends TCommand {
    constructor(client: TsumekiClient) {
        super('test', (msg, args) => {
            msg.channel.createMessage(
                'this is a test command message that was reloaded',
            );
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `${client.user.username}#${client.user.discriminator}`,
                        icon_url: client.user.avatarURL,
                    },
                    description: 'Test description',
                    thumbnail: {
                        url: client.user.avatarURL,
                    },
                },
            });
        });
    }

    public registerSubcommands(client: TsumekiClient) {
        client.commands[this.label].registerSubcommand('sub', (msg, args) => {
            msg.channel.createMessage('this is a sub command');
        });
    }
}
