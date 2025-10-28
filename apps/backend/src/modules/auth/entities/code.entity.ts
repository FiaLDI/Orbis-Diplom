export class CodeEntity {
    email: string;
    code: string;
    ttlSec: number;

    constructor(email: string, code: string, ttlSec = 300) {
        this.email = email;
        this.code = code;
        this.ttlSec = ttlSec;
    }

    toJSON() {
        return {
            email: this.email,
            expires_in: this.ttlSec,
        };
    }
}
