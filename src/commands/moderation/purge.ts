import { CommandClient, GuildTextableChannel } from 'eris';
import { TCommand } from '../../command';
import { logEmbedGenerator } from '../../functions';

export default class Purge extends TCommand {
    // TODO Work on purge @high
    // TODO Allow purging of messages by ID
    constructor(client: CommandClient) {
        super(
            'purge',
            (msg, [amount]) => {
                if (isNaN(parseInt(amount))) return;
                if (msg.channel.type == 0) {
                    let ids: string[] = [];

                    msg.channel
                        .getMessages(parseInt(amount))
                        .then((msgs) => {
                            msgs.forEach((msg) => {
                                ids.push(msg.id);
                            });
                        })
                        .then(async () => {
                            const deleteMsg = await msg.channel.createMessage({
                                embed: logEmbedGenerator(
                                    {
                                        description: `Deleting ${ids.length} message(s)...`,
                                    },
                                    'WARNING',
                                ),
                            });
                            (<GuildTextableChannel>msg.channel).deleteMessages(
                                ids,
                            );
                            deleteMsg.edit({
                                embed: logEmbedGenerator(
                                    {
                                        description: `${ids.length} message(s) were deleted!`,
                                    },
                                    'SUCCESS',
                                ),
                            });
                        })
                        .catch();
                }
            },
            {
                argsRequired: true,
                invalidUsageMessage: false,
                deleteCommand: true,
                defaultSubcommandOptions: {
                    argsRequired: true,
                    invalidUsageMessage: false,
                },
            },
        );
    }

    // TODO Purge user specific messages to the amount specified or until hard limit is reached [100]
    public registerSubcommands(client: CommandClient) {
        client.commands[this.label].registerSubcommand(
            'from',
            (msg, [userId, amount]) => {
                const msgDeleteAmt =
                    isNaN(parseInt(amount)) || amount === undefined
                        ? 50
                        : parseInt(amount);

                if (msg.channel.type == 0) {
                    let ids: string[] = [];

                    msg.channel
                        .getMessages(msgDeleteAmt)
                        .then((msgs) => {
                            msgs.forEach((msg) => {
                                if (
                                    msg.author.id ===
                                    userId.replace(/(<@!|>)|(<@|>)/g, '')
                                ) {
                                    ids.push(msg.id);
                                }
                            });
                        })
                        .then(async () => {
                            const deleteMsg = await msg.channel.createMessage({
                                embed: logEmbedGenerator(
                                    {
                                        description: `Deleting ${ids.length} message(s)...`,
                                    },
                                    'WARNING',
                                ),
                            });
                            (<GuildTextableChannel>msg.channel).deleteMessages(
                                ids,
                            );
                            deleteMsg.edit({
                                embed: logEmbedGenerator(
                                    {
                                        description: `${ids.length} message(s) were deleted!`,
                                    },
                                    'SUCCESS',
                                ),
                            });
                        })
                        .catch();
                }
            },
            {},
        );
    }
}
