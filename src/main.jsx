import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, useLocation } from 'react-router-dom'
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
      if (hash) {
          const section = document.getElementById(hash.replace("#", ""));
          if (section) {
              setTimeout(() => {
                  section.scrollIntoView({ behavior: "smooth" });
              }, 100);
          }
      } else {
          window.scrollTo(0, 0);
      }
  }, [pathname, hash]);

  return null;
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/Airbnb/admin">
      <ScrollToTop/>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
