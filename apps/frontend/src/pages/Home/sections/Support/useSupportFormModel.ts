// features/support/model/useSupportFormModel.ts
import { useForm } from "react-hook-form";

export interface SupportFormData {
  name: string;
  email: string;
  description: string;
}

export function useSupportFormModel() {
  const form = useForm<SupportFormData>({
    defaultValues: {
      name: "",
      email: "",
      description: "",
    },
  });

  const onSubmit = async (data: SupportFormData) => {
    try {
      console.log("Support form:", data);
      // тут будет запрос к API
    } catch (e) {
      console.error(e);
    }
  };

  return {
    form,
    onSubmit,
  };
}
