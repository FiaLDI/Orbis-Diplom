import { UserProfile } from "@/modules/users/entity/user.profile";
import { Prisma } from "@prisma/client";

export class RequestsFriends {
  private requests: UserProfile[] = [];
  private direction: "incoming" | "outcoming" = "incoming";

  setRequest(
    direction: "incoming" | "outcoming",
    requests: UserProfile[]
  ) {
    this.direction = direction;
    this.requests = requests;
  }

  toJSON() {
    return this.requests.map((u) => u.toJSON());
  }
}
