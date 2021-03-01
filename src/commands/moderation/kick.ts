import { CommandClient } from 'eris';
import { TCommand } from '../../command';
import { logEmbedGenerator } from '../../functions';

export default class Kick extends TCommand {
    constructor(client: CommandClient) {
        super(
            'kick',
            (msg, [id, ...reason]) => {
                if (msg.channel.type == 0) {
                    msg.channel.guild
                        .fetchMembers({
                            userIDs: [id.replace(/(<@!|>)|(<@|>)/g, '')],
                        })
                        .then(([member]) => {
                            if (!member) return;
                            msg.channel.createMessage({
                                embed: logEmbedGenerator(
                                    {
                                        description: `${member.username}#${
                                            member.discriminator
                                        } was kicked\nReason: ${reason.join(
                                            ' ',
                                        )}`,
                                        title: 'Fake kick',
                                        footer: `ID: ${member.id}`,
                                    },
                                    'SUCCESS',
                                ),
                            });
                        })
                        .catch();
                }
            },
            { argsRequired: true, invalidUsageMessage: false },
        );
    }
}
