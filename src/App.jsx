import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Write from "./pages/Write";
import Detail from "./pages/Detail";
import Edit from "./pages/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/board" element={<Board />} />

        <Route path="/board/write" element={<Write />} />

        <Route path="/board/:id" element={<Detail />} />

        <Route path="/board/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
