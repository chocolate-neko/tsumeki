import { readdir, stat } from 'fs';
import path from 'path';
import chalk from 'chalk';
import {
    Collection,
    CommandClient,
    EmbedField,
    EmbedOptions,
    Role,
} from 'eris';
import { TCommand } from './command';
import { TsumekiClient } from './client';
type LogType = 'LOG' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';
type EmbedType = 'WARNING' | 'ERROR' | 'INVALID' | 'SUCCESS' | 'DEFAULT';

interface EmbedGeneratorOptions {
    client?: CommandClient;
    displayAuthor?: boolean;
    title?: string;
    description: string;
    fields?: EmbedField[];
    footer?: string;
    timestamp?: boolean;
}

export function logger(
    msg: any,
    logType?: LogType,
    headerText?: any,
    endText?: any,
) {
    switch (logType) {
        case 'LOG':
            console.log(
                chalk`{bold.cyan [LOG${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
            break;
        case 'WARN':
            console.log(
                chalk`{bold.yellowBright [WARN${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
            break;
        case 'ERROR':
            console.log(
                chalk`{bold.black.bgRed [ERROR${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
            break;
        case 'SUCCESS':
            console.log(
                chalk`{bold.greenBright [SUCCESS${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
            break;
        case 'DEBUG':
            console.log(
                chalk`{bold.magenta [DEBUG${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
            break;
        default:
            console.log(
                chalk`{bold.magenta [DEBUG${
                    headerText ? `/${headerText.toUpperCase()}` : ''
                }]} ${msg} ${endText ? chalk`{grey [${endText}]}` : ''}`,
            );
    }
}

export function timeTranslate(timestamp: number): string {
    const seconds: any = (timestamp / 1000).toFixed(1);
    const minutes: any = (timestamp / (1000 * 60)).toFixed(1);
    const hours: any = (timestamp / (1000 * 60 * 60)).toFixed(1);
    const days: any = (timestamp / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + ' Sec';
    } else if (minutes < 60) {
        return minutes + ' Min';
    } else if (hours < 24) {
        return hours + ' Hrs';
    } else {
        return days + ' Days';
    }
}

export function loadCommands(
    dirPath: string,
    client: TsumekiClient,
    reload: boolean = false,
) {
    const resolvedPath = path.join(__dirname, dirPath);
    walk(
        resolvedPath,
        (err, results) => {
            if (err) return logger(err.message, 'ERROR', 'file load');
            if (!results)
                return logger(
                    'Empty file directory!',
                    'WARN',
                    'file load',
                    resolvedPath,
                );

            if (reload) {
                results.forEach((file) => {
                    delete require.cache[file[0]];
                });
            }

            let catBuffer: string = null;
            let cmdArr: { label: string; description: string }[] = [];
            results.forEach(([path, category]) => {
                if (catBuffer != category) cmdArr = [];
                catBuffer = category;

                logger(
                    `${path} ${chalk`{gray [${category}]}`}`,
                    'DEBUG',
                    'file load',
                );

                const command: TCommand = new (require(path).default)(client);
                client.registerCommand(
                    command.label,
                    command.generator,
                    command.options,
                );
                command.registerSubcommands(client);

                if (catBuffer == category)
                    cmdArr.push({
                        label: command.label,
                        description: command.description,
                    });

                if (catBuffer !== null || catBuffer != category)
                    client.commandCategories.set(catBuffer, cmdArr);
            });
        },
        (f: string) => /.js$/.test(f),
    );
}

export function getMemberDisplayColour(
    guildRoles: Collection<Role>,
    memberRoles: string[],
) {
    if (!memberRoles || memberRoles.length == 0) return 16777215;
    let colour = guildRoles.get(memberRoles[memberRoles.length - 1]).color;
    if (colour == 0) {
        colour = guildRoles.get(memberRoles[memberRoles.length - 1]).color;
    }
    return colour;
}

export function getMemberRoleMentions(memberRoles: string[]) {
    if (memberRoles.length == 0) return [`\`No roles\``];
    let mentionsArr: string[] = [];
    memberRoles.forEach((id) => {
        mentionsArr.push(`<@&${id}>`);
    });
    return mentionsArr;
}

export function logEmbedGenerator(
    options: EmbedGeneratorOptions,
    embedType: EmbedType = 'DEFAULT',
): EmbedOptions {
    const embedOptions: EmbedOptions = {
        author: options.displayAuthor
            ? {
                  name:
                      options.client?.user.username ?? `client is not defined`,
                  icon_url: options.client?.user.avatarURL,
              }
            : null,
        title: options.title,
        description: options.description,
        fields: options.fields ? options.fields : [],
        footer: options.footer ? { text: options.footer } : null,
        timestamp: options.timestamp ? new Date() : null,
    };

    let embed: EmbedOptions = embedOptions;

    switch (embedType) {
        case 'WARNING':
            embed.color = parseColor('#f0c46a');
            break;
        case 'SUCCESS':
            embed.color = parseColor('#67e972');
            break;
        case 'ERROR':
            embed.color = parseColor('#f15b5b');
            break;
        case 'DEFAULT':
            embed.color = parseColor('#fba7d7');
            break;
    }
    return embed;

    // return {
    //     description: 'This function has not been implemented properly **yet**',
    // };
}

export function parseColor(colorHex: string): number {
    return parseInt(colorHex.replace('#', ''), 16);
}

function walk(
    dir: string,
    done: (
        err: NodeJS.ErrnoException | null,
        results?: [string, string][],
    ) => void,
    filter?: (f: string) => boolean,
) {
    let results: [string, string][] = [];
    readdir(dir, (err, list) => {
        if (err) {
            return done(err);
        }
        let pending = list.length;
        if (!pending) {
            logger(
                'Potentially empty directory or invalid directory, please check directory path.',
                'WARN',
                'file load',
                dir,
            );
            return done(null, results);
        }
        list.forEach((file: string) => {
            file = path.resolve(dir, file);
            stat(file, (err2, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(
                        file,
                        (err3, res) => {
                            if (res) {
                                results = results.concat(res);
                            }
                            if (!--pending) {
                                done(null, results);
                            }
                        },
                        filter,
                    );
                } else {
                    if (
                        typeof filter === 'undefined' ||
                        (filter && filter(file))
                    ) {
                        const dirname = path.basename(path.dirname(file));
                        results.push([file, dirname]);
                    }
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
}
