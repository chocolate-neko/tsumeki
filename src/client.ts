import {
    ClientOptions,
    CommandClient,
    CommandClientOptions,
    Message,
    TextChannel,
} from 'eris';
import { logger, loadCommands } from './functions';

export class TsumekiClient extends CommandClient {
    // private client: CommandClient;
    public commandCategories: Map<
        string,
        { label: string; description: string; category: string }[]
    >;

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
            console.log(this.commandCategories);
            this.editStatus('online', {
                name: `${commandOptions.prefix[0]}help for help ❤`,
                type: 0,
            });
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
