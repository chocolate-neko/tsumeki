import { CommandClient } from 'eris';
import { TCommand } from '../../command';
import { embedGenerator } from '../../functions';

export default class Kick extends TCommand {
    constructor(client: CommandClient) {
        super(
            'kick',
            (msg, args) => {
                if (msg.channel.type == 0) {
                    let testString = '';
                    msg.channel.guild
                        .fetchMembers({ userIDs: args })
                        .then((members) => {
                            members.forEach((member) => {
                                testString += `${member.username} \`[${member.id}]\`\n`;
                            });
                        })
                        .then(() =>
                            msg.channel.createMessage({
                                content: testString ? testString : 'Nothing',
                                embed: embedGenerator(),
                            }),
                        )
                        .catch();
                }
            },
            {},
        );
    }
}
