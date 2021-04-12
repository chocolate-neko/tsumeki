declare namespace Database {
    interface GuildSchema {
        guildid: string;
        guildname: string;
    }

    interface UserSchema {
        guildid: string;
        userid: string;
        userwallet: number;
        userlevel: number;
    }
}

export = Database;
