import { CommandClient } from 'eris';
import { TCommand } from '../../command';

export default class Eval extends TCommand {
    constructor(client: CommandClient) {
        super(
            'eval',
            (msg, args) => {
                const code = args
                    .join(' ')
                    .replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, '');
                const result = new Promise<string>(
                    (resolve: any, reject: any) => resolve(eval(code)),
                );

                return result
                    .then((output) => {
                        // if (typeof output !== 'string') {
                        //     output = require('util').inspect(output, { depth: 1 });
                        // }
                        // if (output.includes(client.token!)) {
                        //     output = output.replace(client.token!, 'token.1234.nicetry');
                        // }
                        msg.channel.createMessage(
                            'Expression evaluated sucessfully!',
                        );
                    })
                    .catch((err) => {
                        err = err.toString();
                        if (err.includes(client.token)) {
                            err = err.replace(
                                client.token,
                                'token.1234.nicetry',
                            );
                        }
                        msg.channel.createMessage(
                            `\`\`\`js\n${err.substring(0, 1900)}\n\`\`\``,
                        );
                    });
            },
            {
                argsRequired: true,
                description:
                    "Evaluates an expression that's passed in as an argument",
                usage: '<expression>',
                invalidUsageMessage:
                    'Please provide an expression to evaluate!',
            },
        );
    }

    public registerSubcommands(client: CommandClient) {
        client.commands[this.label].registerSubcommand(
            'withOutput',
            (msg, args) => {
                const code = args
                    .join(' ')
                    .replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, '');
                const result = new Promise<string>(
                    (resolve: any, reject: any) => resolve(eval(code)),
                );

                return result
                    .then((output) => {
                        if (typeof output !== 'string') {
                            output = require('util').inspect(output, {
                                depth: 1,
                            });
                        }
                        if (output.includes(client.token!)) {
                            output = output.replace(
                                client.token!,
                                'token.1234.nicetry',
                            );
                        }
                        msg.channel.createMessage(
                            `\`\`\`js\n${output.substring(0, 1900)}\n\`\`\``,
                        );
                    })
                    .catch((err) => {
                        err = err.toString();
                        if (err.includes(client.token)) {
                            err = err.replace(
                                client.token,
                                'token.1234.nicetry',
                            );
                        }
                        msg.channel.createMessage(
                            `\`\`\`js\n${err.substring(0, 1900)}\n\`\`\``,
                        );
                    });
            },
            {
                argsRequired: true,
                description:
                    "Evaluates an expression that's passed in as an argument (Returns an output)",
                aliases: ['o', 'output'],
                usage: '<expression>',
                invalidUsageMessage:
                    'Please provide an expression to evaluate!',
            },
        );
    }
}
