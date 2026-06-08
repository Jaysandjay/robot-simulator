import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LiveTelemetry } from './pages/LiveTelemetry';

const router = createBrowserRouter([
  { path: '/', element: <LiveTelemetry /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
