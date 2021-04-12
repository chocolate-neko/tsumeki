import { Collection, Guild } from 'eris';
import mongoose, {
    Connection,
    Document,
    FilterQuery,
    Model,
    Schema,
} from 'mongoose';
import { GuildSchema } from './@types';
import { logger } from './functions';
const dbConfig: {
    url: string;
    login: { user: string; password: string };
} = require('../dbconfig.json');

export default class DBClient {
    private db: Connection;
    private guilds: Model<Document>;
    private users: Model<Document>;
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
            new Schema({ guildid: String, guildname: String }),
        );
        this.users = mongoose.model(
            'users',
            new Schema({
                guildid: String,
                userid: String,
                userwallet: Number,
                userlevel: Number,
            }),
        );
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

    public async dbGuildIDCheck(guilds?: Collection<Guild>) {
        try {
            const queriedGuilds = await this.guilds.find({});
            guilds.forEach((guild) => {
                const found = queriedGuilds.find((doc) => {
                    return doc.get('guildid') == guild.id;
                });
                if (!found) {
                    this.dbInsert('guilds', <GuildSchema>{
                        guildid: guild.id,
                        guildname: guild.name,
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