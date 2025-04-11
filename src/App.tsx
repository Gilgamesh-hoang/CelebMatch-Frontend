import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./layout/MainLayout.tsx";
import NormalLayout from "./layout/NormalLayout.tsx";

function App() {

  return (
      <BrowserRouter>
          <div className="App">
              <Routes>
                  <Route path="/" element={<MainLayout/>}>
                      {/*<Route index element={<Home />} />*/}
                  </Route>
                  <Route element={<NormalLayout/>}>
                      {/*<Route path="/login" element={<Login />} />*/}
                  </Route>
              </Routes>
          </div>
      </BrowserRouter>
  )
}

export default App
