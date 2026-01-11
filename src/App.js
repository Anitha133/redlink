import React from "react";
import RegisterForm from "./components/RegisterForm";
import LoginPage from "./components/login";
import {Route, Routes, BrowserRouter, Navigate} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/register" element={<RegisterForm/>}></Route>
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;
