import { chat } from "@/features/chat";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, MutationDefinition } from "@reduxjs/toolkit/query";

export interface Props {
    chat: chat;
    isServer?: boolean;
    editQuery?: MutationTrigger<MutationDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, "Projects" | "Issues" | "Statuses" | "Priorities", any, "issueApi">>;
    deleteQuery?: MutationTrigger<MutationDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, "Projects" | "Issues" | "Statuses" | "Priorities", any, "issueApi">>;
}
