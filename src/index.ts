import { TsumekiClient } from './client';
const token: { token: string } = require('../token.json');

const client = new TsumekiClient(
    token.token,
    {},
    {
        prefix: ['t.', 'T.', 't!', 'T!'],
        defaultHelpCommand: false,
        argsSplitter: (str: string) => str.split(' '),
        owner: 'Cococat🍫#7225',
        defaultCommandOptions: {
            caseInsensitive: true,
            defaultSubcommandOptions: {
                caseInsensitive: true,
            },
        },
    },
);

client.run();
