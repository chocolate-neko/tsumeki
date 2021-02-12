import {
    ClientOptions,
    CommandClient,
    CommandClientOptions,
    Message,
    TextChannel,
} from 'eris';
import { logger, loadCommands } from './functions';

export class TsumekiClient {
    private client: CommandClient;

    constructor(
        token: string,
        options?: ClientOptions,
        commandOptions?: CommandClientOptions,
    ) {
        this.client = new CommandClient(token, options, commandOptions);

        loadCommands('./commands', this.client);

        this.client.on('ready', () => {
            logger(
                `Logged in as ${this.client.user.username}#${this.client.user.discriminator}`,
                'LOG',
                'login',
                this.client.user.id,
            );
            this.client.editStatus('online', {
                name: `${commandOptions.prefix[0]}help for help ❤`,
                type: 0,
            });
        });

        // this.client.on("messageCreate", (message: Message) => {
        //     if (message.author.bot) return;
        //     if (!message.command) return;
        // });
    }

    public run() {
        this.client.connect();
    }
}
