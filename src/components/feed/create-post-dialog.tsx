"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./rich-text-editor";
import { useCreatePostMutation } from "@/store/features/feed/feedApi";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  communityName: string;
  onCreated?: () => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  communityId,
  communityName,
  onCreated,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [createPost, { isLoading, isSuccess, isError, error }] =
    useCreatePostMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Post created",
        description: "Your post has been shared with the community.",
      });
      setTitle("");
      setContent("");
      onOpenChange(false);
      onCreated?.();
    }
  }, [isSuccess, onOpenChange, onCreated]);

  useEffect(() => {
    if (isError) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to create post. Please try again.";
      toast({
        title: "Failed to create post",
        description: message,
        variant: "destructive",
      });
    }
  }, [isError, error]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPost({ title: title.trim(), content, communityId }).unwrap();
    } catch (err) {
      // Error toast handled in effect
      console.error(err);
    }
  };

  const isCreateDisabled = !title.trim() || !content.trim() || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>
            Share an update with the <strong>{communityName}</strong> community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-title">
              Title
            </label>
            <Input
              id="post-title"
              placeholder="Give your post a descriptive title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="What would you like to share?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreateDisabled}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
