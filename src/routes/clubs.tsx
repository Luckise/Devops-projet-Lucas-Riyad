import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs")({
  component: ClubsLayout,
});

function ClubsLayout() {
  return <Outlet />;
}
