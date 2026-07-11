"use client";

import {
  useActionState,
  type FormEvent,
} from "react";
import {
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  deleteCommentAction,
  type DeleteCommentActionState,
} from "@/actions/comment-actions";

const initialState: DeleteCommentActionState = {
  success: false,
  message: "",
};

type CommentItemProps = {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;

    author: {
      name: string;
      email: string;
    };
  };

  canDelete: boolean;
};

export function CommentItem({
  comment,
  canDelete,
}: CommentItemProps) {
  const [state, formAction, isPending] = useActionState(
    deleteCommentAction,
    initialState,
  );

  const initials = comment.author.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleDelete(
    event: FormEvent<HTMLFormElement>,
  ) {
    const confirmed = window.confirm(
      "Delete this comment permanently?",
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <article className="border-t border-slate-800 py-5 first:border-t-0">
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <p className="font-semibold text-white">
                {comment.author.name}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {comment.author.email} ·{" "}
                {formatDistanceToNow(
                  comment.createdAt,
                  {
                    addSuffix: true,
                  },
                )}
              </p>
            </div>

            {canDelete ? (
              <form
                action={formAction}
                onSubmit={handleDelete}
              >
                <input
                  type="hidden"
                  name="commentId"
                  value={comment.id}
                />

                <button
                  type="submit"
                  disabled={isPending}
                  aria-label="Delete comment"
                  className="flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60"
                >
                  {isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </form>
            ) : null}
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {comment.content}
          </p>

          {comment.updatedAt.getTime() !==
          comment.createdAt.getTime() ? (
            <p className="mt-2 text-xs text-slate-600">
              Edited
            </p>
          ) : null}

          {state.message && !state.success ? (
            <p className="mt-3 text-sm text-red-400">
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}