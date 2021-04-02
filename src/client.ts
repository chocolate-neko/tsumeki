import {
    ClientOptions,
    CommandClient,
    CommandClientOptions,
    Message,
    TextChannel,
} from 'eris';
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
            logger(
                `Logged in as ${this.user.username}#${this.user.discriminator}`,
                'LOG',
                'login',
                this.user.id,
            );
            this.database = new DBClient();
            this.database.dbConnect();
            this.database.dbGuildIDCheck(this.guilds);
            // this.database.dbInsertMany(
            //     'test',
            //     ['col1', 'col2', 'col3'],
            //     [
            //         ['hello world!', 'something', 'bloop'],
            //         ['data4', 'data5', 'data6'],
            //     ],
            // );
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
            console.log('member left');
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
            console.log('member joined');
        });

        // Little easter-egg for fun 😋
        this.on('messageCreate', (message) => {
            if (
                message.content === `<@${this.user.id}>` ||
                message.content === `<@!${this.user.id}>`
            ) {
                message.channel.createMessage(`yes? ${message.author.mention}`);
            }
        });

        // this.client.on("messageCreate", (message: Message) => {
        //     if (message.author.bot) return;
        //     if (!message.command) return;
        // });
    }

    public run() {
        this.connect();
    }
}
