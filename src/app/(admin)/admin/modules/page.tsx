"use client";

import Link from "next/link";
import { useDeleteModuleMutation, useGetModulesQuery } from "@/lms/store/lms.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminModulesPage() {
  const { data: modules = [], isLoading, isFetching, isError } = useGetModulesQuery();
  const [deleteModule, { isLoading: isDeleting }] = useDeleteModuleMutation();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Modules</div>
          <div className="text-sm text-muted-foreground">Create, edit, and delete modules.</div>
        </div>
        <Link href="/admin/modules/create">
          <Button>Create Module</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isError ? (
            <div className="text-red-600">Failed to load modules.</div>
          ) : modules.length ? (
            modules.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{m.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {m.description || "No description"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    Course: {m.course}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/modules/edit/${m._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={async () => {
                      const ok = window.confirm("Delete this module?");
                      if (!ok) return;
                      await deleteModule(m._id).unwrap();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No modules found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

