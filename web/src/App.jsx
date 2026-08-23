import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UiProvider } from "./context/UiContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MenuPage from "./pages/MenuPage";
import ReservationPage from "./pages/ReservationPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <UiProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </UiProvider>
    </BrowserRouter>
  );
}
