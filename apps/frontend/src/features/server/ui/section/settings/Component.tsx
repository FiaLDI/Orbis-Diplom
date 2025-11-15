import React from "react";
import { useTranslation } from "react-i18next";
import { AuditDrawer } from "@/features/moderation";
import { useServerSettingsModel } from "@/features/server/hook";

import { SettingsHeader } from "./sections/SettingsHeader";
import { BasicSettingsSection } from "./sections/BasicSettingsSection";
import { MembersSection } from "./sections/MembersSection";
import { RolesSection } from "./sections/RolesSection";
import { DeleteServerSection } from "./sections/DeleteServerSection";
import { ServerSettingsLayout } from "@/features/server/ui/layout/ServerSettingsLayout";
import { InviteSection } from "./sections/InviteLinkSection";

export const ServerSettingsForm: React.FC = () => {
  const { t } = useTranslation("server");
  const { activeserver, allPermission, form, ui, lists, invites } =
    useServerSettingsModel();

  if (!activeserver) return null;

  return (
    <ServerSettingsLayout>
      <SettingsHeader
        title={`${t("settings.title")} ${activeserver.name}`}
        onClose={ui.onCloseSettings}
      />

      <BasicSettingsSection t={t} activeserver={activeserver} form={form} />

      <MembersSection
        t={t}
        serverId={activeserver.id}
        members={lists.members}
        roles={lists.roles}
        emitServerUpdate={ui.emit}
      />

      <RolesSection
        t={t}
        serverId={activeserver.id}
        roles={lists.roles}
        allPermissions={(allPermission ?? []) as any[]}
        onCreateRole={ui.onCreateRole}
        onDeleteRole={ui.onDeleteRole}
        emitServerUpdate={ui.emit}
      />

      <InviteSection
        serverId={activeserver.id}
        inviteLinks={activeserver.inviteLinks}
        onCreateInviteLink={invites.createServerLink}
        onDeleteInviteLink={invites.DeleteServerLinks}
      />

      <DeleteServerSection t={t} onDelete={ui.onDangerDeleteServer} />

      <AuditDrawer activeserver={activeserver as any} />
    </ServerSettingsLayout>
  );
};
