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
  deleteProjectAction,
  type DeleteProjectActionState,
} from "@/actions/project-actions";

const initialState: DeleteProjectActionState = {
  success: false,
  message: "",
};

type DeleteProjectFormProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectForm({
  projectId,
  projectName,
}: DeleteProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    deleteProjectAction,
    initialState,
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    const confirmed = window.confirm(
      `Delete "${projectName}" permanently?\n\nAll tasks, comments, members, and activity records belonging to this project will also be deleted.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="mt-6"
    >
      <input
        type="hidden"
        name="projectId"
        value={projectId}
      />

      {state.message ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Deleting project...
          </>
        ) : (
          <>
            <Trash2 className="size-4" />
            Delete project
          </>
        )}
      </button>
    </form>
  );
}