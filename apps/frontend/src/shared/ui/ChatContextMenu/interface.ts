import { chat } from "@/features/chat";
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    MutationDefinition,
} from "@reduxjs/toolkit/query";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";

export interface ChatContextMenuProps {
    triggerElement: (handlers: { onContextMenu: (e: React.MouseEvent) => void }) => React.ReactNode;
    chat: chat;
    editQuery?: MutationTrigger<
        MutationDefinition<
            any,
            BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
            "Projects" | "Issues" | "Statuses" | "Priorities",
            any,
            "issueApi"
        >
    >;
    deleteQuery?: MutationTrigger<
        MutationDefinition<
            any,
            BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
            "Projects" | "Issues" | "Statuses" | "Priorities",
            any,
            "issueApi"
        >
    >;
}
