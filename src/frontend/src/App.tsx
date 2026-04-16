import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/Dashboard";
import { HomePage } from "./pages/Home";
import { ProgressPage } from "./pages/Progress";
import { WorkoutFormPage } from "./pages/WorkoutForm";
import { WorkoutResultPage } from "./pages/WorkoutResult";

// Root route renders Layout with Outlet
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const workoutFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workout-form",
  component: WorkoutFormPage,
});

const workoutResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workout-result",
  component: WorkoutResultPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: ProgressPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  workoutFormRoute,
  workoutResultRoute,
  progressRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
