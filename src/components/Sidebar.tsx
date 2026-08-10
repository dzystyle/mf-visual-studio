import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  FolderClosed,
  Sparkles,
  Smile,
  Package,
  Tv,
  BookOpen,
} from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

const items = [
  { to: "/", icon: Home, label: "首页" },
  { to: "/projects", icon: FolderClosed, label: "项目" },
  { to: "/quick", icon: Sparkles, label: "快速生成" },
  { to: "/elements", icon: Smile, label: "元素库" },
  { to: "/skill", icon: Package, label: "Skill" },
  { to: "/tv", icon: Tv, label: "ArtrailTV" },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center justify-between border-r border-border/40 bg-sidebar py-4">
      <div className="flex flex-col items-center gap-1">
        <Link to="/" className="mb-3 flex h-10 w-10 items-center justify-center">
          <img src={logoAsset.url} alt="Logo" className="h-7 w-7" />
        </Link>

        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex w-full flex-col items-center gap-1 py-2"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-accent text-foreground"
                    : "text-sidebar-foreground group-hover:bg-accent/60 group-hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <span
                className={`text-[10px] leading-none ${
                  active ? "text-foreground" : "text-sidebar-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="my-2 h-px w-8 bg-border" />

        <Link
          to="/tutorial"
          className="group flex w-full flex-col items-center gap-1 py-2"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
              pathname === "/tutorial"
                ? "bg-accent text-foreground"
                : "text-sidebar-foreground group-hover:bg-accent/60 group-hover:text-foreground"
            }`}
          >
            <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>
          <span
            className={`text-[10px] leading-none ${
              pathname === "/tutorial" ? "text-foreground" : "text-sidebar-foreground"
            }`}
          >
            教程
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3 text-sidebar-foreground">
        {["微信", "DC", "X", "YT"].map((s) => (
          <div
            key={s}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[9px] hover:bg-accent/60 hover:text-foreground"
          >
            {s}
          </div>
        ))}
      </div>
    </aside>
  );
}
