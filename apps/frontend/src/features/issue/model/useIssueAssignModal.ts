import { useState, useCallback } from "react";

export function useIssueAssignModal() {
  const [assignModal, setAssignModal] = useState<{
    open: boolean;
    issue: any | null;
  }>({
    open: false,
    issue: null,
  });

  const closeModalAssign = () => {
    setAssignModal({ open: false, issue: null });
  };

  const setAssignModalHandler = (data: any) => {
    setAssignModal({ open: true, issue: data });
  };

  return {
    assignModal,
    closeModalAssign,
    setAssignModalHandler,
  };
}
