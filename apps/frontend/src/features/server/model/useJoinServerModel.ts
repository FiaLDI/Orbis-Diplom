import { SubmitHandler, useForm } from "react-hook-form";
import { useJoinServerMutation } from "../api";
import { JoinServerFormData } from "../types";

export function useJoinServerModel(setOpen: any) {
    const [joinServer, joinState] = useJoinServerMutation();

    const joinForm = useForm<JoinServerFormData>({
        defaultValues: { serverId: "" },
    });

    const onJoin: SubmitHandler<JoinServerFormData> = async (data) => {
        if (!data.serverId.trim()) return;
        try {
            await joinServer(data.serverId).unwrap();
            joinForm.reset();
            setOpen(false);
        } catch (err) {
            console.error("Failed to join server:", err);
        }
    };

    return {
        joinForm,
        onJoin,
        joinState,
    };
}
