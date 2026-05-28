import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tips")({
  component: TipsLayout,
});

function TipsLayout() {
  return <Outlet />;
}
