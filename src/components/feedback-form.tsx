import { useFormState } from "@/hooks/form-context";
import { FormState } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

export default function FeedbackForm({
  data,
  isFeedbackFormOpen,
  setFeedbackFormOpen,
}: {
  data: FormState;
  isFeedbackFormOpen: boolean;
  setFeedbackFormOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [formState] = useFormState();
  const [hasConsented, setHasConsented] = useState(false);

  const feedbackMutation = useMutation<void, Error, { formData: FormData }>({
    mutationKey: ["feedback"],
    mutationFn: async ({ formData }) => {
      if (!hasConsented)
        throw new Error(
          "We need your consent to submit your feedback.",
        );
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      }).then((blob) => blob.json());

      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onSuccess: () => {
      setFeedbackFormOpen(false);
    },
  });

  function handleFeedbackSubmission(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form || !(form instanceof HTMLFormElement)) return;

    const file = formState.formData?.get("resume");
    const formData = new FormData(form);

    if (file) {
      formData.set("resume", file);
    }

    feedbackMutation.mutate({ formData }, { onSuccess: form.reset });
  }

  function close() {
    setFeedbackFormOpen(false);
  }

  return (
    <div
      className={`fixed inset-0 transition bg-gray-900/20 dark:bg-gray-100/20 ${isFeedbackFormOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={close}
    >
      <form
        action="/api/feedback"
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleFeedbackSubmission}
        onClick={(e) => e.stopPropagation()}
        className={`fixed transition-transform left-0 top-0 h-full w-full sm:h-max sm:rounded-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:top-1/2 sm:left-1/2 bg-background p-10 shadow-lg flex flex-col sm:max-w-xl`}
      >
        <div className="flex flex-col items-center">
          <button
            className="text-2xl w-max self-end relative -top-4"
            type="button"
            onClick={close}
          >
            &times;
          </button>
          {feedbackMutation.error ? (
            <p className="text-red-400 mb-4 text-center">
              {feedbackMutation.error.message}
            </p>
          ) : null}
        </div>

        <input type="hidden" name="url" value={formState.url} />
        <input type="hidden" name="grade" value={data.grade} />
        <input
          type="hidden"
          name="yellow_flags"
          value={JSON.stringify(data.yellow_flags)}
        />
        <input
          type="hidden"
          name="red_flags"
          value={JSON.stringify(data.red_flags)}
        />
        <h3 className="text-center text-2xl font-bold mb-6">
          Thank you for your feedback
        </h3>
        <div className="flex flex-col items-center">
          <textarea
            aria-label="Description"
            id="description"
            name="description"
            placeholder="A brief description..."
            className="w-full mb-4 rounded p-2 border border-gray-400 bg-white/10"
            rows={10}
          ></textarea>
          <div className="flex items-center gap-3 mb-4 w-full">
            <input
              type="checkbox"
              name="consent"
              id="consent"
              required
              onChange={(e) => setHasConsented(e.target.checked)}
              className="shrink-0"
            />
            <label
              htmlFor="consent"
              className="text-sm font-bold select-none"
            >
              I consent to sharing my CV with the Resume Checker team.
            </label>
          </div>
          <button
            disabled={feedbackMutation.isPending || !hasConsented}
            className="w-full px-10 disabled:bg-indigo-800/50 disabled:cursor-not-allowed disabled:text-gray-300 py-2 text-center block rounded bg-indigo-800 font-bold hover:bg-indigo-600 cursor-pointer text-white"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}