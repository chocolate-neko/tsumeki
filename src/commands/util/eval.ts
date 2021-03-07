import { stripIndents } from 'common-tags';
import { CommandClient } from 'eris';
import { TsumekiClient } from '../../client';
import { TCommand } from '../../command';
import { logEmbedGenerator } from '../../functions';

export default class Eval extends TCommand {
    constructor(client: TsumekiClient) {
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
                fullDescription: stripIndents`
                    <expression> field is required.

                    Code blocks are allowed but only in javascript format ie.
                `,
                usage: '<expression>',
                invalidUsageMessage: (msg) => {
                    msg.channel.createMessage({
                        embed: logEmbedGenerator({
                            description:
                                'Please provide an expression to evaluate!',
                        }),
                    });
                    return '';
                },
            },
        );
    }

    public registerSubcommands(client: TsumekiClient) {
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
                fullDescription: stripIndents`
                    <expression> field is required.

                    Code blocks are allowed but only in javascript format ie.
                `,
                aliases: ['o', 'output'],
                usage: '<expression>',
                invalidUsageMessage: (msg) => {
                    msg.channel.createMessage({
                        embed: logEmbedGenerator({
                            description:
                                'Please provide an expression to evaluate!',
                        }),
                    });
                    return '';
                },
            },
        );
    }
}
