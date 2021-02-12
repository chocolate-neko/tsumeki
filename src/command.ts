import { Command, CommandClient, CommandGenerator, CommandOptions } from 'eris';

export class TCommand extends Command {
    // private _label: string;
    private _generator: CommandGenerator;
    private _options: CommandOptions;

    constructor(
        label: string,
        generator: CommandGenerator,
        options?: CommandOptions,
    ) {
        super(label, generator, options ? options : {});
        // this._label = label;
        this._generator = generator;
        this._options = options ? options : {};
    }

    // public get label(): string {
    //     return this._label;
    // }

    public get generator(): CommandGenerator {
        return this._generator;
    }

    public get options(): CommandOptions {
        return this._options;
    }

    /**
     * Registers subcommands for the given command
     * @virtual
     * @param client CommandClient
     */
    public registerSubcommands(client: CommandClient) {}
}
