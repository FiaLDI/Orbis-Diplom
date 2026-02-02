import React from "react";
import { ModalLayout, ModalInput, HeadComponent, CloseButton } from "@/shared/ui";
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
      <div className="text-white flex flex-col w-[600px]">
          <div className="bg-foreground/20 w-full flex items-center justify-between p-2">
            <HeadComponent title={t("search")} />
            <CloseButton handler={() => {onClose()}} />
          </div>

        <div className="p-2 w-full flex flex-col gap-5 bg-background">
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
