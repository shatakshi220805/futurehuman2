import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-bg min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
