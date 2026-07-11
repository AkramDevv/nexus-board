"use client";

import { useActionState } from "react";
import {
    CheckCircle2,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import {
    updateTaskStatusAction,
    type UpdateTaskStatusActionState,
} from "@/actions/task-actions";

const initialState: UpdateTaskStatusActionState = {
    success: false,
    message: "",
};

type TaskStatusFormProps = {
    taskId: string;
    currentStatus:
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE";
};

export function TaskStatusForm({
    taskId,
    currentStatus,
}: TaskStatusFormProps) {
    const [state, formAction, isPending] = useActionState(
        updateTaskStatusAction,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-4">
            <input
                type="hidden"
                name="taskId"
                value={taskId}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
                <select
                    key={`${taskId}-${currentStatus}`}
                    name="status"
                    defaultValue={currentStatus}
                    disabled={isPending}
                    className="h-11 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-500 disabled:opacity-60"
                >
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">
                        In progress
                    </option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                </select>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                    {isPending ? (
                        <>
                            <LoaderCircle className="size-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="size-4" />
                            Update status
                        </>
                    )}
                </button>
            </div>

            {state.message ? (
                <div
                    className={
                        state.success
                            ? "flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                            : "rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    }
                >
                    {state.success ? (
                        <CheckCircle2 className="size-4" />
                    ) : null}

                    {state.message}
                </div>
            ) : null}
        </form>
    );
}