declare namespace Database {
    interface GuildSchema {
        id: string;
        name: string;
        options: {
            displaywelcomemessage: boolean;
            welcomemessage: string;
            welcomechannelid: string;
        };
    }

    interface UserSchema {
        id: String;
        globalprofile: {
            wallet: Number;
            level: Number;
            inventory: String[];
        };
        guildprofiles: {
            guildid: String;
        }[];
    }
}

export = Database;
