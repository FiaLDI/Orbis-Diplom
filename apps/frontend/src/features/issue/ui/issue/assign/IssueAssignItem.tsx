import React from "react";
import { Check, UserX } from "lucide-react";
import { config } from "@/config";

interface Props {
    member: any;
    isAssigned: boolean;
    loading: boolean;
    onAssign: (id: string) => void;
    onUnassign: (id: string) => void;
}

export const IssueAssignItem: React.FC<Props> = ({
    member,
    isAssigned,
    loading,
    onAssign,
    onUnassign,
}) => {
    const avatar =
        member.avatar_url &&
        (member.avatar_url.startsWith("http")
            ? member.avatar_url
            : `${config.cdnServiceUrl}/${member.avatar_url}`);

    return (
        <div
            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition ${
                isAssigned ? "bg-green-600/30" : "bg-gray-700/40 hover:bg-gray-600/50"
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
                    disabled={loading}
                    onClick={() => onUnassign(member.id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                >
                    <UserX size={14} /> Remove
                </button>
            ) : (
                <button
                    disabled={loading}
                    onClick={() => onAssign(member.id)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                >
                    <Check size={14} /> Assign
                </button>
            )}
        </div>
    );
};
