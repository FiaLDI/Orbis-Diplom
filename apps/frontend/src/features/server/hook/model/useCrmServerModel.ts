import { useLazyGetServersQuery } from "@/features/server/api";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCreateServerModel } from "./useCreateServerModel";
import { useJoinServerModel } from "./useJoinServerModel";

export function useCrmServerModel() {
  const { t } = useTranslation("server");
  const [open, setOpen] = useState(false);

  const [trigger] = useLazyGetServersQuery();

  const { onCreate, createState, createForm } = useCreateServerModel(setOpen);
  const { onJoin, joinState, joinForm } = useJoinServerModel(setOpen);

  useEffect(() => {
    trigger({});
  }, [createState, joinState]);

  return {
    open,
    t,
    onCreate,
    onJoin,
    setOpen,
    createForm,
    joinForm,
    createState,
    joinState,
  };
}
