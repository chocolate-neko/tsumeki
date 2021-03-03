import { CommandClient, EmbedOptions } from 'eris';
import { TCommand } from '../../command';
import NekoClient from 'nekos.life';

export default class Neko extends TCommand {
    private nekoClient: NekoClient = new NekoClient();
    constructor(client: CommandClient) {
        super(
            'neko',
            async (msg, args) => {
                msg.channel.createMessage({
                    embed: {
                        author: {
                            name: 'Neko',
                            icon_url: client.user.avatarURL,
                        },
                        image: await this.nekoClient.sfw.neko(),
                        footer: {
                            text: 'Powered by nekos.life',
                        },
                    },
                });
            },
            {
                aliases: ['catgirl'],
                description: 'Sends a neko in chat',
                defaultSubcommandOptions: {
                    aliases: ['catgirl'],
                    description: 'Sends a neko in chat',
                },
            },
        );
    }

    public registerSubcommands(client: CommandClient) {
        client.commands[this.label].registerSubcommand(
            'sfw',
            async (msg, args) => {
                msg.channel.createMessage({
                    embed: {
                        author: {
                            name: 'Neko',
                            icon_url: client.user.avatarURL,
                        },
                        image: await this.nekoClient.sfw.neko(),
                        footer: {
                            text: 'Powered by nekos.life',
                        },
                    },
                });
            },
            {},
        );
        client.commands[this.label].registerSubcommand(
            'nsfw',
            async (msg, args) => {
                if (msg.channel.type == 0 && !msg.channel.nsfw)
                    return 'This can only be executed in an nsfw channel!';
                msg.channel.createMessage({
                    embed: {
                        author: {
                            name: 'Neko',
                            icon_url: client.user.avatarURL,
                        },
                        image: await this.nekoClient.nsfw.neko(),
                        footer: {
                            text: 'Powered by nekos.life',
                        },
                    },
                });
            },
            { fullDescription: 'NSFW' },
        );
    }
}
