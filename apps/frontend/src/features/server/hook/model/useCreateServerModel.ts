import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateSeverMutation } from "@/features/server/api";
import { CreateServerFormData } from "@/features/server/types";

export function useCreateServerModel(setOpen: any) {
  const [createServer, createState] = useCreateSeverMutation();

  const createForm = useForm<CreateServerFormData>({
    defaultValues: { name: "" },
  });

  const onCreate: SubmitHandler<CreateServerFormData> = async (data) => {
    if (!data.name.trim() || data.name.length < 6) return;
    try {
      await createServer({ name: data.name }).unwrap();
      createForm.reset();
      setOpen(false);
    } catch (err) {
      console.error("Failed to create server:", err);
    }
  };

  return {
    createForm,
    onCreate,
    createState,
  };
}
