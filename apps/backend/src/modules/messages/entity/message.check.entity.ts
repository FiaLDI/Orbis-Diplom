export class MessageCheckEntity {
    constructor(
        private check: {
            chat_id: string | null;
            user_id: string | null;
        } | null
    ) {}

    boolean() {
        return this.check?.user_id && this.check?.chat_id;
    }

    toJSON() {
        return {
            chatId: this.check?.chat_id,
            userId: this.check?.user_id,
        };
    }
}
