import React, { useState } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import {
  useAssignUserToIssueMutation,
  useLazyGetIssuesQuery,
  useUnassignUserFromIssueMutation,
} from "../../../api";
import { useAppSelector } from "@/app/hooks";
import { Check, UserX } from "lucide-react";
import { config } from "@/config";

interface Props {
  issue: any;
  projectId: number;
  onClose: () => void;
}

export const Component: React.FC<Props> = ({ issue, onClose, projectId }) => {
  const [assignUser] = useAssignUserToIssueMutation();
  const [unassignUser] = useUnassignUserFromIssueMutation();
  const [getIssues] = useLazyGetIssuesQuery();

  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [localAssigned, setLocalAssigned] = useState<number[]>(
    issue?.assignees?.map((a: any) => a.user_id || a.id) || []
  );

  const membersServer =
    useAppSelector((s) => s.server.activeserver?.users) || [];

  const filteredMembers = membersServer.filter((m: any) =>
    m.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async (userId: number) => {
    setLocalAssigned((prev) => [...new Set([...prev, userId])]);
    setLoadingId(userId);

    try {
      await assignUser({ issueId: issue.id, userId }).unwrap();
    } catch (err) {
      setLocalAssigned((prev) => prev.filter((id) => id !== userId));
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnassign = async (userId: number) => {
    setLocalAssigned((prev) => prev.filter((id) => id !== userId));
    setLoadingId(userId);

    try {
      await unassignUser({ issueId: issue.id, userId }).unwrap();
    } catch (err) {
      console.error("unassign error:", err);
      setLocalAssigned((prev) => [...prev, userId]);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ModalLayout 
      open={!!issue} 
      onClose={ ()=>{
        onClose(); 
      getIssues(projectId);}}
    >
      <div className="p-4 text-white space-y-4">
        <h4 className="text-lg font-semibold py-3 bg-[#4354ee8f] rounded text-center">
          👤 Manage Assignees
        </h4>

        {/* 🔍 Поиск */}
        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-2 py-1 text-black"
        />

        {/* 👥 Список участников */}
        <div className="max-h-[300px] overflow-y-auto space-y-1">
          {filteredMembers.length === 0 ? (
            <p className="text-gray-400 text-center">No members found</p>
          ) : (
            filteredMembers.map((member: any) => {
              const isAssigned = localAssigned.includes(member.id);
              const avatar =
                member.user_profile?.avatar_url &&
                (member.user_profile.avatar_url.startsWith("http")
                  ? member.user_profile.avatar_url
                  : `${config.cdnServiceUrl}/${member.user_profile.avatar_url}`);

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition ${
                    isAssigned
                      ? "bg-green-600/30"
                      : "bg-gray-700/40 hover:bg-gray-600/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={avatar || "/img/icon.png"}
                      alt={member.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{member.username}</span>
                  </div>

                  {isAssigned ? (
                    <button
                      disabled={loadingId === member.id}
                      onClick={() => handleUnassign(member.id)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                    >
                      <UserX size={14} /> Remove
                    </button>
                  ) : (
                    <button
                      disabled={loadingId === member.id}
                      onClick={() => handleAssign(member.id)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <Check size={14} /> Assign
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 🔘 Кнопка закрытия */}
        <button
          onClick={()=>{
        onClose(); 
      getIssues(projectId);}}
          className="mt-3 w-full py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
        >
          Close
        </button>
      </div>
    </ModalLayout>
  );
};
