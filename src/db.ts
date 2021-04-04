import { Collection, Guild } from 'eris';
import { Client, ClientConfig, QueryConfig, Submittable } from 'pg';
import { logger } from './functions';
const dbClientConfig: ClientConfig = require('../dbconfig.json');

export default class DBClient {
    public client: Client;
    constructor() {
        this.client = new Client(dbClientConfig);
        logger({
            message: 'Database initialised...',
            logType: 'LOG',
            headerText: 'Database',
        });
    }

    public async dbConnect() {
        try {
            await this.client.connect().then((conn) => {
                logger({
                    message: 'Database connected successfully!',
                    logType: 'SUCCESS',
                    headerText: 'Database',
                });
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbGuildIDCheck(guilds?: Collection<Guild>) {
        try {
            const res = await this.client.query(`SELECT guildid FROM guildids`);
            guilds.forEach(async (guild) => {
                const found = res.rows.find((row) => {
                    return row.guildid == guild.id;
                });
                if (!found) {
                    await this.client.query(
                        'INSERT INTO guildids(guildid, guildname) VALUES ($1, $2)',
                        [guild.id, guild.name],
                    );
                    logger({
                        message: 'Undefined guild found, inserting...',
                        logType: 'LOG',
                        headerText: 'Database',
                    });
                }
                console.log(found);
            });
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbInsert(table: string, cols: string[], values: any[]) {
        let insertValues = '(';
        let valueTicker = 1;
        values.forEach((value, index) => {
            insertValues += `$${valueTicker}`;
            valueTicker++;
            if (index != values.length - 1) insertValues += ',';
        });
        insertValues += ')';
        try {
            const res = await this.client.query(
                `INSERT INTO ${table}(${cols.toString()}) VALUES ${insertValues}`,
                values,
            );
            return res;
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbQuery(query: string | QueryConfig<any[]>, values?: any[]) {
        try {
            const res = await this.client.query(query, values);
            return res;
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }

    public async dbInsertMany(
        table: string,
        cols: string[],
        values: [...any[]][],
    ) {
        let valueArr: any[] = [];
        let insertValues = '';
        let valueTicker = 1;
        values.forEach((value, index) => {
            insertValues += '(';
            value.forEach((element, index) => {
                insertValues += `$${valueTicker}`;
                valueArr.push(element);
                valueTicker++;
                if (index != value.length - 1) insertValues += ',';
            });
            insertValues += ')';
            if (index != values.length - 1) insertValues += ',';
        });
        console.log(table, cols.toString());
        console.log(insertValues);
        try {
            const res = await this.client.query(
                `INSERT INTO ${table}(${cols.toString()}) VALUES ${insertValues}`,
                valueArr,
            );
            return res;
        } catch (err) {
            logger({
                message: err.message,
                logType: 'ERROR',
                headerText: 'Database',
            });
        }
    }
}
