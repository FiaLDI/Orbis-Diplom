import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { uploadFiles } from "@/features/upload";
import { useUpdateProfileMutation } from "@/features/settings";
import { useTranslation } from "react-i18next";
import type {FormData} from "../components/profile/interface";
import { UserData } from "@/features/auth";

export function useProfileFormModel(user: UserData["info"]) {
  const upload = useAppSelector((s) => s.upload);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("settings");

  const [updateProfile, updateState] = useUpdateProfileMutation();

  const form = useForm<FormData>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      birth_date: user?.birth_date
        ? new Date(user.birth_date).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "",
      location: user?.location || "",
      about: user?.about || "",
      avatar_url: user?.avatar_url || "",
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    const uploaded = await dispatch(uploadFiles(Array.from(files))).unwrap();

    form.setValue("avatar_url", uploaded[0], { shouldValidate: true });
  };


  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    try {
      await updateProfile({ id: user.id, data }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    form,
    onSubmit,
    handleAvatarChange,
    t,
    updateState,
    user,
    upload
  };
}
