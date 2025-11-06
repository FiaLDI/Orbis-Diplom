export class MessageCheckEntity {
    constructor(
        private check: {
            chat_id: number | null;
            user_id: number | null;
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
