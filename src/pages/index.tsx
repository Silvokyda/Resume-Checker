import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useFormState } from "@/hooks/form-context";
import { useMutationState } from "@tanstack/react-query";
import ErrorBadge from "@/components/error-badge";

function usePasteEvent(pasteListener: (event: ClipboardEvent) => void) {
  useEffect(() => {
    document.addEventListener("paste", pasteListener);

    return () => {
      document.removeEventListener("paste", pasteListener);
    };
  }, [pasteListener]);
}

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);
  const [, setFormState] = useFormState();

  const onDrop = useCallback(
    (files: File[]) => {
      const formData = new FormData();
      const [cvFile] = files;

      if (!cvFile) return;

      formData.set("resume", cvFile);
      setFormState({ formData });
      router.push("/review");
    },
    [router, setFormState],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  usePasteEvent(async (event: ClipboardEvent) => {
    event.preventDefault();
    const data = event.clipboardData;
    if (!data) {
      return;
    }

    const url = data.getData("text").toString();
    if (!url.startsWith("https") || !url.endsWith(".pdf")) {
      setError(
        new Error("URL must start with 'https' and end with 'pdf'"),
      );
      return;
    }
    setFormState({ url });
    router.push("/review");
  });

  async function handleFormSubmission(event: ChangeEvent) {
    const formElement = event.currentTarget.parentElement;
    if (!formElement || !(formElement instanceof HTMLFormElement)) return;
    const formData = new FormData(formElement);
    const honeypot = formData.get("name");

    if (honeypot) {
      return;
    }

    setFormState({ formData });
    router.push("/review");
  }

  function prevent(event: FormEvent) {
    event.preventDefault();
  }

  const mutations = useMutationState({
    filters: { mutationKey: ["resume-check"] },
    select: (mutation) => mutation.state.error,
  });

  const mutationError = mutations[mutations.length - 1];

  return (
    <>
      <ErrorBadge error={error || mutationError} />

      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-12">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Upload your CV and get immediate feedback
            </h1>
          </div>

          <form
            {...getRootProps()}
            onSubmit={prevent}
            method="POST"
            action="/api/grade"
            encType="multipart/form-data"
            className={`mx-auto w-full max-w-lg p-12 border-2 rounded-lg ${
              isDragActive 
                ? "cursor-grabbing dark:border-gray-400 border-gray-800" 
                : "border-gray-400 dark:border-gray-500"
            } border-dashed flex flex-col items-center justify-center gap-4`}
          >
            <span className="px-10 py-3 rounded-lg bg-indigo-800 font-bold hover:bg-indigo-600 cursor-pointer text-white">
              Click to upload your CV
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              or drag and drop your CV
            </span>
            <input
              className="sr-only"
              onChange={handleFormSubmission}
              id="resume"
              name="resume"
              {...getInputProps()}
            />
            <input className="hidden" type="text" name="name" />
          </form>
        </div>
      </div>
    </>
  );
}