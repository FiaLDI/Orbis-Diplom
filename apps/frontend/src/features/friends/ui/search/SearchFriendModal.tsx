import React from "react";
import { ModalLayout, ModalInput } from "@/shared/ui";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchResultItem } from "./SearchResultItem";

interface Props {
  open: boolean;
  onClose: () => void;
  find: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  results: any[];
  onMessage: (id: string) => void;
  onInvite: (id: string) => void;
}

export const SearchFriendModal: React.FC<Props> = ({
  open,
  onClose,
  find,
  handleChange,
  results,
  onMessage,
  onInvite,
}) => {
  const { t } = useTranslation("friends");

  return (
    <ModalLayout open={open} onClose={onClose}>
      <div className="text-white flex flex-col gap-5 w-[600px]">
        <div className="bg-background w-full rounded flex items-center justify-between p-5">
          <h2 className="w-full text-2xl">{t("search")}</h2>
          <button onClick={onClose} className="cursor-pointer p-0 w-fit">
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
            {results.length > 0 ? (
              results.map((u, idx) => (
                <SearchResultItem
                  key={`search-user-${idx}`}
                  user={u}
                  onMessage={onMessage}
                  onInvite={onInvite}
                  t={t}
                />
              ))
            ) : find.trim() ? (
              <li className="text-gray-400">{t("notfound")}</li>
            ) : null}
          </ul>
        </div>
      </div>
    </ModalLayout>
  );
};
