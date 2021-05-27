import { Message } from 'eris';
import { TsumekiClient } from './client';

export async function checkProfile(message: Message, client: TsumekiClient) {
    const userAlreadyExists = await client.database.dbMemberIDCheck(
        message.member,
    );
    if (userAlreadyExists) {
        client.database.dbMemberGuildProfileCheck(
            message.member,
            client.guilds,
        );
        let walletAmt: number = (
            await client.database.dbRetrieveOne('users', {
                id: message.author.id,
            })
        ).get('globalprofile.wallet');
        walletAmt++;
        console.log(walletAmt);
        client.database.dbUpdateData(
            'users',
            {
                id: message.author.id,
            },
            {
                $set: {
                    'globalprofile.wallet': walletAmt,
                },
            },
        );
    }
}
