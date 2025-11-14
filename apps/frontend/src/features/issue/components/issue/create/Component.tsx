import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ModalLayout } from "@/shared";
import { FormProvider } from "react-hook-form";
import { useIssueFormModel } from "@/features/issue/model/useIssueFormModel";
import { IssueEditLayout } from "@/features/issue/ui/layout/IssueEditLayout";
import { IssueEditHead } from "@/features/issue/ui/layout/IssueEditHead";
import { IssueEditForm } from "@/features/issue/ui/form/IssueEditForm";
import { Statuses } from "@/features/issue/types";

interface Props {
  projectId: string;
  serverId: string;
  statuses: { id: number; name: Statuses }[];
  priorities: string[];
  issues: any[];
  initialData?: any | null;
  emitServerUpdate: any;
  updateIssue: any;
  createIssue: any;
  createState: any;
  updateState: any;
}

export const IssueFormModal: React.FC<Props> = ({
  projectId,
  serverId,
  statuses,
  priorities,
  issues,
  initialData = null,
  emitServerUpdate,
  updateIssue,
  createIssue,
  createState,
  updateState,
}) => {
  const isEditing = !!initialData;
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  const { form, onSubmit } = useIssueFormModel({
    serverId,
    projectId,
    emitServerUpdate,
    statuses,
    initialData,
    updateIssue,
    createIssue,
    onClose: handleClose,
  });

  const { handleSubmit } = form;

  useEffect(() => {
    if (isEditing) setOpen(true);
  }, [isEditing, initialData]);

  return (
    <ModalLayout
      open={open}
      onClose={handleClose}
      key={initialData?.id ?? "new"}
    >
      <IssueEditLayout
        head={
          <IssueEditHead
            title={isEditing ? "Edit Issue" : "Create Issue"}
            onClose={handleClose}
          />
        }
        form={
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-5 flex flex-col gap-5"
              autoComplete="off"
            >
              <IssueEditForm
                updateState={updateState}
                createState={createState}
                onClose={handleClose}
                statuses={statuses}
                priorities={priorities}
                issues={issues}
                isEditing={isEditing}
                initialData={initialData}
              />
            </form>
          </FormProvider>
        }
      />
    </ModalLayout>
  );
};
