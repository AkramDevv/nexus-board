"use client";

import {
  useActionState,
  type FormEvent,
} from "react";
import {
  LoaderCircle,
  Trash2,
} from "lucide-react";

import {
  deleteTaskAction,
  type DeleteTaskActionState,
} from "@/actions/task-actions";

const initialState: DeleteTaskActionState = {
  success: false,
  message: "",
};

type DeleteTaskFormProps = {
  taskId: string;
  taskTitle: string;
};

export function DeleteTaskForm({
  taskId,
  taskTitle,
}: DeleteTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    deleteTaskAction,
    initialState,
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    const confirmed = window.confirm(
      `Delete "${taskTitle}" permanently?`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="taskId"
        value={taskId}
      />

      {state.message ? (
        <p className="mb-4 text-sm text-red-400">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="size-4" />
            Delete task
          </>
        )}
      </button>
    </form>
  );
}