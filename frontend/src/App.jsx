import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Index";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;