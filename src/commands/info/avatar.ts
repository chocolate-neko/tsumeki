import { stripIndents } from 'common-tags';
import { CommandClient, Member, User } from 'eris';
import { TCommand } from '../../command';
import { getMemberDisplayColour } from '../../functions';

export default class Avatar extends TCommand {
    constructor(client: CommandClient) {
        super(
            'avatar',
            (msg, args) => {
                if (args.length == 0) {
                    msg.member.guild
                        .fetchMembers({
                            userIDs: [msg.author.id],
                        })
                        .then((member: Member[]) => {
                            msg.channel.createMessage({
                                embed: {
                                    author: {
                                        name: member[0].username,
                                    },
                                    image: {
                                        url: member[0].user.dynamicAvatarURL(
                                            undefined,
                                            256,
                                        ),
                                    },
                                    color: getMemberDisplayColour(
                                        msg.member.guild.roles,
                                        member[0].roles,
                                    ),
                                },
                            });
                        })
                        .catch();
                }
                msg.member.guild
                    .fetchMembers({
                        userIDs: [args[0].replace(/(<!@|>)|(<@|>)/g, '')],
                    })
                    .then((member: Member[]) => {
                        if (!member[0]) return;
                        msg.channel.createMessage({
                            embed: {
                                author: {
                                    name: member[0].username,
                                },
                                image: {
                                    url: member[0].user.dynamicAvatarURL(
                                        undefined,
                                        256,
                                    ),
                                },
                                color: getMemberDisplayColour(
                                    msg.member.guild.roles,
                                    member[0].roles,
                                ),
                            },
                        });
                    })
                    .catch();
            },
            {
                aliases: ['av', 'pfp'],
                guildOnly: true,
                description: 'Displays the profile image of the mentioned user',
                fullDescription: stripIndents`
                    [user] field is optional.
                `,
                usage: '[user]',
            },
        );
    }
}
