import { UserProfile } from "@/modules/users/entity/user.profile";

export class UserFriend {
  private friends: UserProfile[];

  constructor(props: { friends: UserProfile[] }) {
    this.friends = props.friends;
  }

  toJSON() {
    return this.friends.map((u) => u.toJSON());
  }
}
