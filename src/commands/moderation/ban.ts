import { stripIndents } from 'common-tags';
import { TsumekiClient } from '../../client';
import { TCommand } from '../../command';
import { logEmbedGenerator } from '../../functions';

export default class Ban extends TCommand {
    constructor(client: TsumekiClient) {
        super(
            'ban',
            (msg, [id, ...reason]) => {
                if (msg.channel.type == 0) {
                    msg.channel.guild
                        .fetchMembers({
                            userIDs: [id.replace(/(<@!|>)|(<@|>)/g, '')],
                        })
                        .then(([member]) => {
                            if (!member) return;
                            member.ban(undefined, reason.join(' '));
                            msg.channel.createMessage({
                                embed: logEmbedGenerator(
                                    {
                                        description: `${member.username}#${
                                            member.discriminator
                                        } was banned\nReason:${reason.join(
                                            ' ',
                                        )}`,
                                        title: 'Member banned',
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
                aliases: ['b'],
                argsRequired: true,
                invalidUsageMessage: false,
                description: 'Bans a specified user from the guild.',
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
                        banMembers: true,
                    },
                },
            },
        );
    }
}
