import { Client, CommandClient } from 'eris';
import { TCommand } from '../../command';
import { parseColor } from '../../functions';
const info: {
    version: string;
    description: string;
    dependencies: { [s: string]: string };
} = require('../../../package.json');

export default class About extends TCommand {
    constructor(client: CommandClient) {
        super(
            'about',
            (msg, args) => {
                msg.channel.createMessage({
                    embed: {
                        author: {
                            name: `${client.user.username}#${client.user.discriminator}`,
                            icon_url: client.user.avatarURL,
                        },
                        title: 'About me',
                        description: `My version number: \`v${info.version}\`\n${info.description}`,
                        color: parseColor('#fba7d7'),
                        fields: [
                            {
                                name: 'My prefixes',
                                value: prefixes(client),
                                inline: true,
                            },
                            {
                                name: 'My owner/developer',
                                value: client.commandOptions.owner
                                    ? client.commandOptions.owner
                                    : '`Undefined`',
                                inline: true,
                            },
                            {
                                name: "Number of guilds I'm in",
                                value: client.guilds.size.toString(),
                                inline: false,
                            },
                            {
                                name: '`//////Advanced Section//////`',
                                value: 'Advanced information',
                                inline: false,
                            },
                            {
                                name: 'Discord user ID',
                                value: client.user.id,
                                inline: true,
                            },
                            {
                                name: 'Start time',
                                value: new Date(client.startTime).toUTCString(),
                                inline: true,
                            },
                            {
                                name: 'User agent',
                                value: client.requestHandler.userAgent,
                                inline: false,
                            },
                            {
                                name: 'Node packages',
                                value: Object.keys(info.dependencies).join(
                                    '\n',
                                ),
                            },
                        ],
                        footer: {
                            text: 'Developed with Eris💎',
                        },
                    },
                });
            },
            { description: 'Information about the bot', cooldown: 5000 },
        );
    }
}

function prefixes(client: CommandClient): string {
    let arr: string[] = [];
    for (let i = 0; i < client.commandOptions.prefix.length; i++) {
        if (i % 2 == 0) arr.push(`\`${client.commandOptions.prefix[i]}\``);
    }
    return arr.join(', ');
}
