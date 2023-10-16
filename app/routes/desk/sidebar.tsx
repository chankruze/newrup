import { NavList } from "./nav-list";

export const Sidebar = () => {
  return (
    <aside className="hidden gap-6 border-r md:flex md:flex-col md:w-64">
      <nav className="flex-1 overflow-y-auto">
        <NavList />
      </nav>
    </aside>
  );
};
