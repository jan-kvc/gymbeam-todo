import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import FolderIcon from "../icons/FolderIcon";
import { useMenu } from "../MobileMenuContext";
import { Badge } from "../ui/badge";

interface Props {
  name: string;
  count: number;
}

export default function ListItem({ name, count }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const isActive = useMemo(() => {
    const listName = searchParams.get("list");
    const isActive = listName === name;
    const params = new URLSearchParams(searchParams.toString());
    params.set("list", name);

    return isActive;
  }, [searchParams, name]);

  const className = useMemo(() => {
    return cn(
      "flex items-center overflow-hidden justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
      {
        "bg-muted hover:bg-muted brightness-200": isActive,
      }
    );
  }, [isActive]);

  return (
    <Link
      href={pathname + "?" + createQueryString("list", name)}
      className={className}
      onClick={() => setIsMenuOpen(false)}
      // prefetch={false}
    >
      <div className="flex overflow-hidden items-center gap-3 w-full">
        <FolderIcon className="h-5 w-5" />
        <span className=" overflow-hidden">{name}</span>
      </div>
      <Badge variant="outline">{count}</Badge>
    </Link>
  );
}
