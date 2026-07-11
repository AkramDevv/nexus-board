"use client";

import {
    useActionState,
    type FormEvent,
} from "react";
import {
    LoaderCircle,
    Save,
    Trash2,
} from "lucide-react";

import {
    removeProjectMemberAction,
    updateProjectMemberRoleAction,
    type RemoveProjectMemberActionState,
    type UpdateMemberRoleActionState,
} from "@/actions/member-actions";

const updateInitialState: UpdateMemberRoleActionState = {
    success: false,
    message: "",
};

const removeInitialState: RemoveProjectMemberActionState = {
    success: false,
    message: "",
};

type ProjectMemberRowProps = {
    projectId: string;

    member: {
        id: string;
        role: "OWNER" | "ADMIN" | "MEMBER";

        user: {
            id: string;
            name: string;
            email: string;
        };
    };
};

export function ProjectMemberRow({
    projectId,
    member,
}: ProjectMemberRowProps) {

    const [
        updateState,
        updateAction,
        isUpdating,
    ] = useActionState(
        updateProjectMemberRoleAction,
        updateInitialState,
    );

    const [
        removeState,
        removeAction,
        isRemoving,
    ] = useActionState(
        removeProjectMemberAction,
        removeInitialState,
    );

    const initials = member.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    function handleRemove(
        event: FormEvent<HTMLFormElement>,
    ) {
        const confirmed = window.confirm(
            `Remove ${member.user.name} from this project?\n\nTasks currently assigned to this user will become unassigned.`,
        );

        if (!confirmed) {
            event.preventDefault();
        }
    }

    return (
        <div className="border-t border-slate-800 py-5 first:border-t-0">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                            {member.user.name}
                        </p>

                        <p className="truncate text-sm text-slate-500">
                            {member.user.email}
                        </p>
                    </div>
                </div>

                {member.role === "OWNER" ? (
                    <span className="inline-flex w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400">
                        Project owner
                    </span>
                ) : (
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <form
                            action={updateAction}
                            className="flex gap-2"
                        >
                            <input
                                type="hidden"
                                name="projectId"
                                value={projectId}
                            />

                            <input
                                type="hidden"
                                name="memberId"
                                value={member.id}
                            />

                            <select
                                key={`${member.id}-${member.role}`}
                                name="role"
                                defaultValue={member.role}
                                disabled={isUpdating || isRemoving}
                                className="h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-blue-500 disabled:opacity-60"
                            >
                                <option value="MEMBER">Member</option>
                                <option value="ADMIN">Admin</option>
                            </select>

                            <button
                                type="submit"
                                disabled={isUpdating || isRemoving}
                                aria-label={`Save ${member.user.name}'s role`}
                                className="flex size-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-60"
                            >
                                {isUpdating ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                            </button>
                        </form>

                        <form
                            action={removeAction}
                            onSubmit={handleRemove}
                        >
                            <input
                                type="hidden"
                                name="projectId"
                                value={projectId}
                            />

                            <input
                                type="hidden"
                                name="memberId"
                                value={member.id}
                            />

                            <button
                                type="submit"
                                disabled={isUpdating || isRemoving}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                            >
                                {isRemoving ? (
                                    <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                    <Trash2 className="size-4" />
                                )}

                                Remove
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {updateState.message ? (
                <p
                    className={
                        updateState.success
                            ? "mt-3 text-sm text-emerald-400"
                            : "mt-3 text-sm text-red-400"
                    }
                >
                    {updateState.message}
                </p>
            ) : null}

            {removeState.message ? (
                <p className="mt-3 text-sm text-red-400">
                    {removeState.message}
                </p>
            ) : null}
        </div>
    );
}