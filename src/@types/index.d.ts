declare namespace Database {
    interface GuildSchema {
        guildid: string;
        guildname: string;
        options: {
            displaywelcomemessage: boolean;
            welcomemessage: string;
            welcomechannelid: string;
        };
        users: [];
    }

    interface UserSchema {
        userid: string;
        userwallet: number;
        userlevel: number;
    }
}

export = Database;
