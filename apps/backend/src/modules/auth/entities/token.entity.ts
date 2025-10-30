export class TokenEntity {
    access_token: string;
    refresh_token: string;
    expires_in: number;

    constructor(props: { access_token: string; refresh_token: string; expires_in?: number }) {
        this.access_token = props.access_token;
        this.refresh_token = props.refresh_token;
        this.expires_in = props.expires_in ?? 15 * 60;
    }

    toJSON() {
        return {
            access_token: this.access_token,
            expires_in: this.expires_in,
        };
    }
}
