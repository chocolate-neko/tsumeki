import {
    ClientOptions,
    CommandClient,
    CommandClientOptions,
    Message,
    TextChannel,
} from 'eris';
import { GuildSchema } from './@types/index';
import { checkProfile } from './checkprofile';
import DBClient from './db';
import { logger, loadCommands } from './functions';

export class TsumekiClient extends CommandClient {
    // private client: CommandClient;
    public commandCategories: Map<
        string,
        { label: string; description: string; category: string }[]
    >;
    public database: DBClient;

    constructor(
        token: string,
        options?: ClientOptions,
        commandOptions?: CommandClientOptions,
    ) {
        super(token, options, commandOptions);
        this.commandCategories = new Map<
            string,
            { label: string; description: string; category: string }[]
        >();

        loadCommands('./commands', this);

        this.on('ready', () => {
            logger({
                message: `Logged in as ${this.user.username}#${this.user.discriminator}`,
                logType: 'LOG',
                headerText: 'login',
                endText: this.user.id,
            });
            this.database = new DBClient();
            this.database.dbConnect();
            this.database.dbGuildIDCheck(this.guilds);
            this.editStatus('online', {
                name: `${commandOptions.prefix[0]}help for help ❤`,
                type: 0,
            });
        });

        this.on('guildMemberRemove', (guild, member) => {
            const channel = guild.channels.filter((channel) => {
                return channel.name == 'tsu-welcome';
            })[0];
            if (channel.type == 0) {
                channel.createMessage(`${member.user.mention} left`);
            }
        });

        this.on('guildMemberAdd', (guild, member) => {
            const channel = guild.channels.filter((channel) => {
                return channel.name == 'tsu-welcome';
            })[0];
            if (channel.type == 0) {
                channel.createMessage(
                    `Welcome ${member.mention} to ${guild.name}!`,
                );
            }
        });

        this.on('guildCreate', async (guild) => {
            this.database.dbInsert('guilds', <GuildSchema>{
                id: guild.id,
                name: guild.name,
            });
            logger({
                message: `I've joined ${guild.name}!`,
                logType: 'CUSTOM',
                headerText: 'Server',
                customOptions: {
                    customLogType: 'Join',
                    displayColor: 'green.bold',
                },
            });
        });

        this.on('guildDelete', async (guild) => {
            this.database.dbDeleteOne('guilds', { guildid: guild.id });
            logger({
                message: "I've been removed from a guild",
                logType: 'CUSTOM',
                headerText: 'Server',
                endText: guild.id,
                customOptions: {
                    customLogType: 'Leave',
                    displayColor: 'yellow.bold',
                },
            });
        });

        this.on('messageCreate', async (message) => {
            checkProfile(<Message>message, this);
        });
    }

    public run() {
        this.connect();
    }
}
