import { stripIndents } from 'common-tags';
import { Command, CommandClient, EmbedOptions } from 'eris';
import { TsumekiClient } from '../../client';
import { TCommand } from '../../command';
import { capitalise, logEmbedGenerator, parseColor } from '../../functions';

export default class Help extends TCommand {
    constructor(client: TsumekiClient) {
        super(
            'help',
            (msg, [command]) => {
                if (command) {
                    if (
                        client.commands.hasOwnProperty(command) &&
                        client.commands[command] &&
                        client.commands[command].permissionCheck(msg) &&
                        !client.commands[command].hidden
                    ) {
                        msg.channel.createMessage({
                            embed: {
                                title: `${capitalise(
                                    `${client.commands[command].label} ${client.commands[command].usage}`,
                                    'TITLE',
                                )}`,
                                description: `${
                                    client.commands[command].description
                                }\n${
                                    client.commands[command].fullDescription ===
                                    'No full description'
                                        ? ''
                                        : client.commands[command]
                                              .fullDescription
                                }`,
                                fields: [
                                    {
                                        name: 'Aliases',
                                        value: client.commands[
                                            command
                                        ].aliases.join(', '),
                                    },
                                ],
                            },
                        });
                        return;
                    }
                    msg.channel.createMessage({
                        embed: logEmbedGenerator(
                            {
                                description: `Command ${command} doesn't exist`,
                            },
                            'INVALID',
                        ),
                    });
                    return;
                } else {
                    let commandEmbed: EmbedOptions = {
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL,
                        },
                        title: `${msg.prefix}${this.label}`,
                        color: parseColor('#fba7d7'),
                        fields: [],
                        footer: {
                            text: `Type ${msg.prefix}${this.label} [command] for more details on the command`,
                        },
                    };
                    client.commandCategories.forEach((cmdArr, category) => {
                        let cmdList = '';
                        cmdArr.forEach((cmd) => {
                            if (
                                client.commands[cmd.label].permissionCheck(
                                    msg,
                                ) &&
                                !client.commands[cmd.label].hidden
                            ) {
                                cmdList += `\`${cmd.label}\` | ${cmd.description}\n`;
                            }
                        });
                        commandEmbed.fields.push({
                            name: capitalise(category, 'TITLE'),
                            value: cmdList,
                        });
                    });
                    msg.channel.createMessage({ embed: commandEmbed });
                    return;
                }
            },
            {
                description: 'A list of commands I can perform',
                fullDescription: stripIndents`
                    [command] field is optional.
                `,
                usage: '[command]',
            },
        );
    }
}
