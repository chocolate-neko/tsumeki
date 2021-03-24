import { CommandClient } from 'eris';
import { TCommand } from '../../command';
import { logEmbedGenerator } from '../../functions';
import { stripIndents } from 'common-tags';
import { TsumekiClient } from '../../client';

export default class Kick extends TCommand {
    constructor(client: TsumekiClient) {
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
                            member.kick(reason.join(' '));
                            msg.channel.createMessage({
                                embed: logEmbedGenerator(
                                    {
                                        description: `${member.username}#${
                                            member.discriminator
                                        } was kicked\nReason:${reason.join(
                                            ' ',
                                        )}`,
                                        title: 'Member kicked',
                                        footer: `ID: ${member.id}`,
                                    },
                                    'SUCCESS',
                                ),
                            });
                        })
                        .catch();
                }
            },
            {
                aliases: ['k'],
                argsRequired: true,
                invalidUsageMessage: false,
                description: 'Kicks a specified user from the guild.',
                fullDescription: stripIndents`
                    <user> field is required.
                    [reason] field is optional.

                    * Note: Should \`reason\` field be left empty, it would be prefilled with \`No reason provided\` by default.
                `,
                usage: '<user> [reason]',
                permissionMessage: (msg) => {
                    msg.channel.createMessage({
                        embed: logEmbedGenerator({
                            description:
                                'you lack the permissions to use this command!',
                        }),
                    });
                    return '';
                },
                requirements: {
                    permissions: {
                        kickMembers: true,
                    },
                },
            },
        );
    }
}
