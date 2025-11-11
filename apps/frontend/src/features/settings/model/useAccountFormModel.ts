import { useForm } from "react-hook-form";
import { useAppSelector } from "@/app/hooks";
import { useUpdateAccountMutation } from "@/features/settings";
import { useTranslation } from "react-i18next";
import type {FormData} from "../components/account/interface";

export function useAccountFormModel() {
  const user = useAppSelector((s) => s.auth.user?.info);
  const { t } = useTranslation("settings");
  const [updateAccount, updateState] = useUpdateAccountMutation();

  const form = useForm<FormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      number: user?.number || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "")
    );

    try {
      await updateAccount({ id: user.id, data: cleaned }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    form,
    onSubmit,
    t,
    error: updateState.error,
    isLoading: updateState.isLoading,
  };
}
