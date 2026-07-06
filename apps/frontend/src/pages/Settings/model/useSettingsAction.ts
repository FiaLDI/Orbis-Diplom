import { useLogoutUserMutation } from "@/features/auth";
import { useNavigate } from "react-router-dom";

export function useSettingsAction() {
    const [logout] = useLogoutUserMutation();
    const navigate = useNavigate();

    const backHandler = () => {
        navigate("/app");
    };

    const logoutHandler = async () => {
        await logout({}).unwrap();
        navigate("/");
    };

    return {
        backHandler,
        logoutHandler,
    };
}
