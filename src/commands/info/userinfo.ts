import { CommandClient, ExtendedUser, Member } from 'eris';
import { TCommand } from '../../command';
import { getMemberDisplayColour, getMemberRoleMentions } from '../../functions';

export default class UserInfo extends TCommand {
    constructor(client: CommandClient) {
        super(
            'userinfo',
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
                                        name: `${member[0].username}#${member[0].discriminator}`,
                                    },
                                    thumbnail: {
                                        url: member[0].user.dynamicAvatarURL(),
                                    },
                                    color: getMemberDisplayColour(
                                        msg.member.guild.roles,
                                        member[0].roles,
                                    ),
                                    title: 'Display name:',
                                    description: member[0].nick
                                        ? member[0].nick
                                        : '`No nickname`',
                                    fields: [
                                        {
                                            name: 'Member created date',
                                            value: new Date(
                                                member[0].createdAt,
                                            ).toUTCString(),
                                            inline: true,
                                        },
                                        {
                                            name: 'Member joined date',
                                            value: new Date(
                                                member[0].joinedAt,
                                            ).toUTCString(),
                                            inline: true,
                                        },
                                        {
                                            name: 'Member Roles',
                                            value: getMemberRoleMentions(
                                                member[0].roles,
                                            ).join(' '),
                                            inline: false,
                                        },
                                    ],
                                    footer: {
                                        text: `ID: ${member[0].id}`,
                                    },
                                    timestamp: new Date(msg.timestamp),
                                },
                            });
                        })
                        .catch();
                }

                msg.member.guild
                    .fetchMembers({
                        userIDs: [args[0].replace(/(<@!|>)|(<@|>)/g, '')],
                    })
                    .then((member: Member[]) => {
                        msg.channel.createMessage({
                            embed: {
                                author: {
                                    name: `${member[0].username}#${member[0].discriminator}`,
                                },
                                thumbnail: {
                                    url: member[0].user.dynamicAvatarURL(),
                                },
                                color: getMemberDisplayColour(
                                    msg.member.guild.roles,
                                    member[0].roles,
                                ),
                                title: 'Display name:',
                                description: member[0].nick
                                    ? member[0].nick
                                    : '`No nickname`',
                                fields: [
                                    {
                                        name: 'Member created date',
                                        value: new Date(
                                            member[0].createdAt,
                                        ).toUTCString(),
                                        inline: true,
                                    },
                                    {
                                        name: 'Member joined date',
                                        value: new Date(
                                            member[0].joinedAt,
                                        ).toUTCString(),
                                        inline: true,
                                    },
                                    {
                                        name: 'Member Roles',
                                        value: getMemberRoleMentions(
                                            member[0].roles,
                                        ).join(' '),
                                        inline: false,
                                    },
                                ],
                                footer: {
                                    text: `ID: ${member[0].id}`,
                                },
                                timestamp: new Date(msg.timestamp),
                            },
                        });
                    })
                    .catch();
            },
            {
                aliases: ['whois', 'uinfo', 'memberinfo', 'minfo'],
                guildOnly: true,
                description: 'Displays information about a mentioned user',
                usage: '<mention>',
            },
        );
    }
}
