"use client";

import { useParams } from "next/navigation";
import PostPageClient from "@/app/(root)/post/[id]/PostPageClient";

export default function PostPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  return <PostPageClient postId={id} />;
}
