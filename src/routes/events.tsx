import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import EventsFeed from "../components/EventsFeed";

function EventsLayout() {
  const matches = useRouterState({ select: (s) => s.matches });
  const hasChild = matches.some((m) => m.routeId !== "__root__" && m.routeId !== "/events");

  if (hasChild) return <Outlet />;
  return <EventsFeed />;
}

export const Route = createFileRoute("/events")({
  component: EventsLayout,
});
