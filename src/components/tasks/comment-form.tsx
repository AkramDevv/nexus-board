"use client";

import { useActionState, useRef } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  MessageSquarePlus,
} from "lucide-react";

import {
  createCommentAction,
  type CreateCommentActionState,
} from "@/actions/comment-actions";

const initialState: CreateCommentActionState = {
  success: false,
  message: "",
};

type CommentFormProps = {
  taskId: string;
};

export function CommentForm({
  taskId,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateCommentActionState,
      formData: FormData,
    ) => {
      const result = await createCommentAction(
        previousState,
        formData,
      );

      if (result.success) {
        formRef.current?.reset();
      }

      return result;
    },
    initialState,
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
    >
      <input
        type="hidden"
        name="taskId"
        value={taskId}
      />

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="sr-only"
        >
          Add comment
        </label>

        <textarea
          id="content"
          name="content"
          rows={4}
          placeholder="Write a comment..."
          disabled={isPending}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
        />

        {state.fieldErrors?.content?.[0] ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.content[0]}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {state.message ? (
          <div
            className={
              state.success
                ? "flex items-center gap-2 text-sm text-emerald-400"
                : "text-sm text-red-400"
            }
          >
            {state.success ? (
              <CheckCircle2 className="size-4" />
            ) : null}

            {state.message}
          </div>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <MessageSquarePlus className="size-4" />
              Add comment
            </>
          )}
        </button>
      </div>
    </form>
  );
}