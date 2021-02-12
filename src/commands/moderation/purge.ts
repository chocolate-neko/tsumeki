import { CommandClient, GuildTextableChannel } from 'eris';
import { TCommand } from '../../command';

export default class Purge extends TCommand {
    // TODO Work on purge @high
    // TODO Allow purging of messages by ID
    constructor(client: CommandClient) {
        super(
            'purge',
            (msg, args) => {
                if (!args[0]) return;
                if (parseInt(args[0]) === NaN) return;
                if (msg.channel.type == 0) {
                    let ids: string[] = [];

                    msg.channel
                        .getMessages(parseInt(args[0]))
                        .then((msgs) => {
                            msgs.forEach((msg) => {
                                ids.push(msg.id);
                            });
                        })
                        .then(() => {
                            (<GuildTextableChannel>msg.channel).deleteMessages(
                                ids,
                            );
                        })
                        .catch();
                }
            },
            {},
        );
    }

    // TODO Purge user specific messages to the amount specified or until hard limit is reached [100]
    public registerSubcommands(client: CommandClient) {
        client.commands[this.label].registerSubcommand(
            'from',
            (msg, args) => {
                const msgDeleteAmt =
                    parseInt(args[1]) === NaN || args[1] === undefined
                        ? 50
                        : parseInt(args[1]);
                if (!args[0]) return;

                if (msg.channel.type == 0) {
                    let ids: string[] = [];

                    msg.channel
                        .getMessages(msgDeleteAmt)
                        .then((msgs) => {
                            msgs.forEach((msg) => {
                                if (msg.author.id === args[0]) {
                                    ids.push(msg.id);
                                }
                            });
                        })
                        .then(() => {
                            (<GuildTextableChannel>msg.channel).deleteMessages(
                                ids,
                            );
                        })
                        .catch((err) => console.log(err));
                }
            },
            {},
        );
    }
}
