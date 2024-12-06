import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import App from "../App";
import { TolovSahifa, TaklifSahifa } from "@pages";
const index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<TolovSahifa />} />
        <Route path="/tg-taklif" element={<TaklifSahifa />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default index;
