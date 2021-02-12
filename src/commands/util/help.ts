import { Command, CommandClient, EmbedOptions } from 'eris';
import { TCommand } from '../../command';

export default class Help extends TCommand {
    constructor(client: CommandClient) {
        super(
            'help',
            (msg, args) => {
                let commands = '';
                for (const cmd in client.commands) {
                    if (
                        client.commands.hasOwnProperty(cmd) &&
                        client.commands[cmd] &&
                        client.commands[cmd].permissionCheck(msg) &&
                        !client.commands[cmd].hidden
                    ) {
                        commands += `\`${msg.prefix}${cmd}\`\n${client.commands[cmd].description}\n`;
                    }
                }
                let embed: EmbedOptions = {
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL,
                    },
                    color: parseInt('c964ea', 16),
                    title: `${msg.prefix}${this.label}`,
                    description: commands,
                    footer: {
                        text: `Type ${msg.prefix}help <command> for more details on the command`,
                    },
                };
                msg.channel.createMessage({
                    embed: embed,
                });
            },
            { usage: 'command' },
        );
    }
}
