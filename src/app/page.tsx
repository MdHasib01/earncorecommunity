import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link href="/dashboard/feed/startup-central">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
