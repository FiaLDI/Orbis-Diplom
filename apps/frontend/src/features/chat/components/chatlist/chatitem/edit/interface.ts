import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    MutationDefinition,
} from "@reduxjs/toolkit/query";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
export interface ChatEditFormProps {
    initialData: any;
    onClose: () => void;
    onSave: () => void;
    editQuery?: MutationTrigger<
        MutationDefinition<
            any,
            BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
            "Projects" | "Issues" | "Statuses" | "Priorities",
            any,
            "issueApi"
        >
    >;
    activeServerId?: string;
    issueId?: string | null;
}
