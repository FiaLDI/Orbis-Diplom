import React, { useEffect, useState, useRef, useCallback } from "react";
import { ModalInput, ModalLayout } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLazyGetUserbyNameQuery, useStartChattingMutation } from "@/features/user";
import { ModalButton } from "@/shared/ui";
import { useSendRequestMutation } from "../../..";
import { CirclePlus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    const { t } = useTranslation("friends");
    const [find, setFind] = useState<string>("");
    const timerRef = useRef<NodeJS.Timeout>();
    const [trigger, { data, isSuccess: isSuccessSearch }] = useLazyGetUserbyNameQuery();
    const myid = useAppSelector((s) => s.auth.user?.info.id);
    const [startChatting, { isSuccess: isSuccessChat, isError: isErrorChat }] =
        useStartChattingMutation();
    const [inviteFriend] = useSendRequestMutation();

    const debounce = useCallback((value: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            trigger(value);
        }, 500);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFind(value);
        debounce(value);
    };

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className="cursor-pointer"
            >
                <CirclePlus
                    color="white"
                    className="w-15 h-15 lg:w-8 lg:h-8"
                    strokeWidth={"1.25"}
                />
            </button>
            <ModalLayout
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div className=" text-white flex flex-col gap-5 w-[600px]">
                    <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
                        <h2 className="w-full text-2xl">{t("search")}</h2>
                        <button
                            className="cursor-pointer p-0 w-fit"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <X />
                        </button>
                    </div>
                    <div className="p-5 w-full flex flex-col gap-5 bg-foreground">
                        <ModalInput
                            change={handleChange}
                            value={find}
                            placeHolder={t("placeholder")}
                        />
                        <ul className="flex flex-col gap-3">
  {data && data?.data && data.data.length > 0 ? (
    data.data.map((val: any, idx: number) => {
      if (val.id === myid) return null;

      return (
        <li
          key={`search-user-${idx}`}
          className="flex gap-10 bg-[#4a55e9] p-3 justify-between rounded"
        >
          <div className="flex items-center gap-2">
            <img
              src={val.user_profile?.avatar_url || "/img/icon.png"}
              alt=""
              className="w-15 h-15 lg:w-10 lg:h-10 rounded-full object-cover"
            />
            <span className="text-3xl lg:text-base">{val.username}</span>
          </div>

          <div className="flex gap-5">
            <ModalButton handler={() => startChatting(val.id)}>
              {t("modal.message")}
            </ModalButton>
            <ModalButton handler={() => inviteFriend(val.id)}>
              {t("modal.addfriend")}
            </ModalButton>
          </div>
        </li>
      );
    })
  ) : find.trim() && (
    <li className="text-gray-400">{t("notfound")}</li>
  )}
</ul>

                    </div>
                </div>
            </ModalLayout>
        </>
    );
};
