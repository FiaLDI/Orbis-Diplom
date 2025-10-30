import { z } from "zod";
import { UserFriendSchema } from "@/modules/friends/dtos/user.friend.dto";

declare global {
    namespace Express {
        interface Request {
            user?: z.infer<typeof UserFriendSchema>;
        }
    }
}
