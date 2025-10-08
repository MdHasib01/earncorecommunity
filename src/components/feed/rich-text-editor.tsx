"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type QuillType from "quill";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "blockquote", "code-block"],
  [{ color: [] }, { background: [] }],
  ["clean"],
];

const EMPTY_HTML = "<p><br></p>";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType>();
  const onChangeRef = useRef(onChange);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let mounted = true;

    const loadQuill = async () => {
      const { default: Quill } = await import("quill");

      if (!mounted || !containerRef.current) {
        return;
      }

      const quill = new Quill(containerRef.current, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
        placeholder,
      });

      quill.root.innerHTML = value || "";

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        const normalized = html === EMPTY_HTML ? "" : html;
        onChangeRef.current(normalized);
      });

      quillRef.current = quill;
      setIsReady(true);
    };

    void loadQuill();

    return () => {
      mounted = false;
      quillRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    const current = quill.root.innerHTML;
    const normalizedCurrent = current === EMPTY_HTML ? "" : current;
    const normalizedValue = value || "";

    if (normalizedCurrent === normalizedValue) {
      return;
    }

    const selection = quill.getSelection();
    quill.clipboard.dangerouslyPasteHTML(normalizedValue);

    if (selection) {
      quill.setSelection(selection);
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.root.dataset.placeholder = placeholder ?? "";
    }
  }, [placeholder]);

  return (
    <div className="rich-text-editor">
      {!isReady && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}
      <div
        ref={containerRef}
        className={isReady ? undefined : "hidden"}
        aria-hidden={!isReady}
      />
    </div>
  );
}
