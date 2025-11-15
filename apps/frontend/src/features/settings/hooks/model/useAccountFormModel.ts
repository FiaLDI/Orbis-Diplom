import { useForm } from "react-hook-form";
import { useUpdateAccountMutation } from "@/features/settings/api";
import { useTranslation } from "react-i18next";
import type { AccountFormData } from "@/features/settings/types";
import { UserData } from "@/features/auth/types";

export function useAccountFormModel(user: UserData["info"]) {
  const { t } = useTranslation("settings");
  const [updateAccount, updateState] = useUpdateAccountMutation();

  const form = useForm<AccountFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      number: user?.number || "",
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    if (!user?.id) return;

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== ""),
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
