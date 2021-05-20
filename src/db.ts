import { Collection, Guild, Member, User } from 'eris';
import mongoose, {
    Connection,
    Document,
    FilterQuery,
    Model,
    Schema,
    UpdateQuery,
} from 'mongoose';
import { GuildSchema, UserSchema } from './@types';
import { logger } from './functions';
const dbConfig: {
    url: string;
    login: { user: string; password: string };
} = require('../dbconfig.json');

export default class DBClient {
    private db: Connection;
    private guilds: Model<Document>;
    private users: Model<Document>;
    private shop: Model<Document>; // TODO: Implement shop system
    constructor() {
        // Check mongodb connection
        this.db = mongoose.connection;
        this.db.on('error', (err) =>
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            }),
        );
        this.db.once('open', () =>
            logger({
                message: 'Database connected successfully!',
                logType: 'SUCCESS',
                headerText: 'Database',
            }),
        );

        // Begin schema & model creation
        this.guilds = mongoose.model(
            'guilds',
            new Schema({
                id: String,
                name: String,
                options: {
                    displaywelcomemessage: Boolean,
                    welcomemessage: String,
                    welcomechannelid: String,
                },
            }),
        );

        this.users = mongoose.model(
            'users',
            new Schema({
                id: String,
                globalprofile: {
                    wallet: Number,
                    level: Number,
                    exp: Number,
                    inventory: [String],
                },
                guildprofiles: [
                    new Schema({
                        guildid: String,
                        level: Number,
                        exp: Number,
                    }),
                ],
            }),
        );
        // this.users = mongoose.model(
        //     'users',
        //     new Schema({
        //         guildid: String,
        //         userid: String,
        //         userwallet: Number,
        //         userlevel: Number,
        //     }),
        // );
    }

    public dbConnect() {
        mongoose.connect(dbConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin',
            auth: {
                user: dbConfig.login.user,
                password: dbConfig.login.password,
            },
        });
    }

    public async dbGuildIDCheck(guilds: Collection<Guild>) {
        try {
            const queriedGuilds = await this.guilds.find({});
            guilds.forEach((guild) => {
                const found = queriedGuilds.find((doc) => {
                    return doc.get('id') == guild.id;
                });
                if (!found) {
                    this.dbInsert('guilds', <GuildSchema>{
                        id: guild.id,
                        name: guild.name,
                        options: {
                            displaywelcomemessage: guild.systemChannelID
                                ? true
                                : false,
                            welcomemessage: 'Welcome {user} to {server}!',
                            welcomechannelid: guild.systemChannelID,
                        },
                    });
                    logger({
                        message: 'Undefined guild found, inserting...',
                        logType: 'LOG',
                        headerText: 'Database',
                    });
                }
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbMemberGuildProfileCheck(
        member: Member,
        guilds: Collection<Guild>,
    ) {
        try {
            const memberInGuild = guilds.find((guild) => guild == member.guild);
            const guildProfileExists = await this.users.findOne({
                id: member.id,
                'guildprofiles.guildid': member.guild.id,
            });
            if (memberInGuild && !guildProfileExists) {
                this.dbUpdateData(
                    'users',
                    { id: member.id },
                    {
                        $push: {
                            guildprofiles: {
                                guildid: member.guild.id,
                                level: 0,
                                exp: 0.0,
                            },
                        },
                    },
                );
            }
        } catch (err) {
            logger({
                message: err.messasge,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbMemberIDCheck(member: Member) {
        try {
            const foundUser = await this.users.findOne({
                id: member.id,
            });
            if (!foundUser) {
                this.dbInsert('users', <UserSchema>{
                    id: member.id,
                    globalprofile: {
                        wallet: 0,
                        level: 0,
                        exp: 0.0,
                        inventory: [],
                    },
                    // initiate the first guild profile when the member first starts out
                    guildprofiles: [
                        { guildid: member.guild.id, level: 0, exp: 0.0 },
                    ],
                });
                logger({
                    message: `New user inserted into user database: ${member.id}`,
                    logType: 'LOG',
                    headerText: 'Database',
                });
                return false;
            } else {
                return true;
            }
        } catch (err) {
            logger({
                message: err.messasge,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbInsert(model: string, doc: { [name: string]: any }) {
        if (!this.hasOwnProperty(model))
            return logger({
                message: `Model '${model}' does not exist`,
                logType: 'WARN',
                headerText: 'Database',
            });

        try {
            const res = await (<Model<Document>>(<any>this)[model]).create(doc);
            logger({
                message: `Successfully inserted 1 document`,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Insert',
                    displayColor: 'bold.greenBright',
                },
                headerText: 'Database',
                endText: res._id,
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Insert',
                    displayColor: 'bold.black.bgRed',
                },
                headerText: 'Database',
            });
        }
    }

    public async dbUpdateData(
        model: string,
        filter: FilterQuery<Document>,
        update: UpdateQuery<Document>,
    ) {
        if (!this.hasOwnProperty(model)) {
            return logger({
                message: `Model '${model}' does not exist`,
                logType: 'WARN',
                headerText: 'Database',
            });
        }

        try {
            const res = await (<Model<Document>>(<any>this)[model]).updateOne(
                filter,
                update,
            );
            logger({
                message: `Updated 1 document`,
                logType: 'DEBUG',
                headerText: 'Database',
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbRetrieveOne(model: string, filter: FilterQuery<Document>) {
        if (this.hasOwnProperty(model)) {
            try {
                const res = await (<Model<Document>>(<any>this)[model]).findOne(
                    filter,
                );
                return res;
            } catch (err) {
                logger({
                    message: err.message,
                    logType: 'ERROR',
                    headerText: 'Database',
                });
            }
        } else {
            logger({
                message: `Model '${model}' does not exist`,
                logType: 'WARN',
                headerText: 'Database',
            });
        }
    }

    public async dbDeleteOne(model: string, filter: FilterQuery<Document>) {
        if (!this.hasOwnProperty(model))
            return logger({
                message: `Model '${model}' does not exist`,
                logType: 'WARN',
                headerText: 'Database',
            });
        try {
            const res = await (<Model<Document>>(<any>this)[model]).deleteOne(
                filter,
            );
            logger({
                message: `Deleted ${res.deletedCount} document${
                    res.deletedCount > 1 ? 's' : ''
                }`,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Delete',
                    displayColor: 'bold.yellowBright',
                },
                headerText: 'Database',
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Delete',
                    displayColor: 'bold.black.bgRed',
                },
                headerText: 'Database',
            });
        }
    }

    public async dbInsertMany(model: string, doc: { [name: string]: any }[]) {
        if (!this.hasOwnProperty(model))
            return logger({
                message: `Model '${model}' does not exist`,
                logType: 'WARN',
                headerText: 'Database',
            });

        try {
            const res = await (<Model<Document>>(<any>this)[model]).create(doc);
            logger({
                message: `Successfully inserted ${res.length} document${
                    res.length > 1 ? 's' : ''
                }`,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Insert',
                    displayColor: 'bold.greenBright',
                },
                headerText: 'Database',
                endText: res[0]._id,
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'CUSTOM',
                customOptions: {
                    customLogType: 'Insert',
                    displayColor: 'bold.black.bgRed',
                },
                headerText: 'Database',
            });
        }
    }
}
