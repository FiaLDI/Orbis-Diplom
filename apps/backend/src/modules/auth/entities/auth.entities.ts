import { DomainError } from "@/common/errors/DomainError";

export class UserEntity {
    id?: string;
    email?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    birth_date?: Date | null;
    number?: string | null;
    password_hash?: string | null;

    constructor(partial: Partial<UserEntity>) {
        console.log(partial);
        Object.assign(this, partial);
    }

    get age(): number | null {
        if (!this.birth_date) return null;
        const now = new Date();
        let age = now.getFullYear() - this.birth_date.getFullYear();
        const beforeBirthday =
            now.getMonth() < this.birth_date.getMonth() ||
            (now.getMonth() === this.birth_date.getMonth() &&
                now.getDate() < this.birth_date.getDate());
        if (beforeBirthday) age--;
        return age;
    }

    get displayName(): string {
        return this.username ?? this.email ?? "Unknown User";
    }

    /**
     * Проверка бизнес-правил (доменных инвариантов)
     * — вызывается в сервисе перед сохранением
     */
    assertValid() {
        if (!this.username || this.username.length < 3) {
            throw new DomainError("Username must be at least 3 characters long");
        }

        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            throw new DomainError("Invalid email format");
        }

        if (this.age !== null && (this.age < 13 || this.age > 120)) {
            throw new DomainError("User age must be between 13 and 120");
        }
    }

    toPublic() {
        return {
            id: this.id,
            email: this.email ?? null,
            username: this.username ?? null,
            avatar_url: this.avatar_url ?? null,
            birth_date: this.birth_date ?? null,
            number: this.number ?? null,
            displayName: this.displayName,
        };
    }
}
