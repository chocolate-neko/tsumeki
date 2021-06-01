// import 'eris';
// import Eris from 'eris';

declare namespace ReEris {
    type AdvancedMessageContent = {
        allowedMentions?: AllowedMentions;
        content?: string;
        components: Component;
        embed?: EmbedOptions;
        flags?: number;
        messageReference?: MessageReferenceReply;
        /** @deprecated */
        messageReferenceID?: string;
        tts?: boolean;
    };

    type Component = {};
}

export = ReEris;
