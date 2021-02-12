import { CommandClient, Guild } from 'eris';
import { TCommand } from '../../command';

export default class ServerInfo extends TCommand {
    constructor(client: CommandClient) {
        super(
            'serverinfo',
            (msg, args) => {
                const guild: Guild = msg.member.guild;

                msg.channel.createMessage({
                    embed: {
                        author: {
                            name: `${client.user.username}#${client.user.discriminator}`,
                            icon_url: client.user.avatarURL,
                        },
                        color: parseInt('fc9fde', 16),
                        title: `Information of ${guild.name}`,
                        description: guild.description
                            ? guild.description
                            : '`No description available for this guild`',
                        fields: [
                            {
                                name: 'Member count',
                                value: guild.memberCount.toString(),
                                inline: true,
                            },
                            {
                                name: 'Number of channels',
                                value: guild.channels.size.toString(),
                                inline: true,
                            },
                            {
                                name: 'Number of roles',
                                value: guild.roles.size.toString(),
                                inline: true,
                            },
                            {
                                name: 'Guild creation date',
                                value: new Date(guild.createdAt).toUTCString(),
                                inline: false,
                            },
                            {
                                name: 'Guild owner',
                                value: `<@!${guild.ownerID}>`,
                                inline: false,
                            },
                        ],
                        thumbnail: {
                            url: guild.iconURL,
                        },
                        footer: {
                            text: `Guild ID: ${guild.id}`,
                        },
                    },
                });
            },
            {
                aliases: ['sinfo', 'guildinfo', 'ginfo'],
                guildOnly: true,
                description: 'Provides information about the current guild',
            },
        );
    }
}
