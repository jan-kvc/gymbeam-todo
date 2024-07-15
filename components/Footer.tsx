import Link from "next/link";

export default function Footer({}) {
  return (
    <footer className="bg-muted/60 p-4 sm:p-6 text-sm text-muted-foreground border-t">
      <div className="container max-w-7xl mx-auto flex justify-between flex-col sm:flex-row">
        <p>&copy; 2024 Gymbeam. All rights reserved.</p>
        <nav className="flex max-sm:justify-between  gap-4">
          <Link href="#" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" prefetch={false}>
            Terms
          </Link>
          <Link href="#" prefetch={false}>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
