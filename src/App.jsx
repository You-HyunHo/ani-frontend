import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Write from "./pages/Write";
import Detail from "./pages/Detail";
import Edit from "./pages/Edit";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/board"
          element={
            <PrivateRoute>
              <Board />
            </PrivateRoute>
          }
        />

        <Route
          path="/board/write"
          element={
            <PrivateRoute>
              <Write />
            </PrivateRoute>
          }
        />

        <Route
          path="/board/:id"
          element={
            <PrivateRoute>
              <Detail />
            </PrivateRoute>
          }
        />

        <Route
          path="/board/edit/:id"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
