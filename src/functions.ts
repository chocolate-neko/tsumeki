import { readdir, stat } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { Collection, CommandClient, Role } from 'eris';
import { TCommand } from './command';
type LogType = 'LOG' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';

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
    client: CommandClient,
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
                    delete require.cache[file];
                });
            }

            results.forEach((file) => {
                logger(file, 'DEBUG', 'file load');

                const command: TCommand = new (require(file).default)(client);
                client.registerCommand(
                    command.label,
                    command.generator,
                    command.options,
                );
                command.registerSubcommands(client);
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

function walk(
    dir: string,
    done: (err: NodeJS.ErrnoException | null, results?: string[]) => void,
    filter?: (f: string) => boolean,
) {
    let results: string[] = [];
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
                        results.push(file);
                    }
                    if (!--pending) {
                        done(null, results);
                    }
                }
            });
        });
    });
}
