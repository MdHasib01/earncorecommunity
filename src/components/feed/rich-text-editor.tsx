"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import "react-quill/dist/quill.snow.css";

type ReactQuillType = typeof import("react-quill");

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const ReactQuill = dynamic<ReactQuillType>(
  async () => {
    const mod = await import("react-quill");
    return mod;
  },
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    ),
  }
);

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "blockquote",
      "code-block",
      "color",
      "background",
    ],
    []
  );

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
