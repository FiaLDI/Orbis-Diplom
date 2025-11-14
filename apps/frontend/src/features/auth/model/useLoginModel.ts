import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../validation";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLoginModel = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data).unwrap();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return {
    onSubmit,
    navigate,
    register,
    handleSubmit,
    errors,
    error,
    isLoading,
  };
};
