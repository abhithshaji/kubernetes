import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/home/Login";
import SroHome from "./components/sro/SroHome";
import SroAddLand from "./components/sro/SroAddLand";
import SroDeleteLand from "./components/sro/SroDeleteLand";
import SroUpdateLand from "./components/sro/SroUpdateLand";
import SroSearchLand from "./components/sro/SroSearchLand";
import SroTransferLand from "./components/sro/SroTransferLand";
import RevenueSearchLand from "./components/revenue/RevenueSearchLand";
import RevenueMutation from "./components/revenue/RevenueMutation";
import BankMortgage from "./components/bank/BankMortgage";
import BankSearchLand from "./components/bank/BankSearchLand";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/sroHome" element={<SroHome />} />
          <Route path="/sroAddLand" element={<SroAddLand />} />
          <Route path="/sroSearchLand" element={<SroSearchLand />} />
          <Route path="/sroDeleteLand" element={<SroDeleteLand />} />
          <Route path="/sroUpdateLand" element={<SroUpdateLand />} />
          <Route path="/sroTransferLand" element={<SroTransferLand />} />

          <Route path="/revenueSearchLand" element={<RevenueSearchLand />} />
          <Route path="/revenueMutation" element={<RevenueMutation />} />

          <Route path="/bankMortgage" element={<BankMortgage />} />
          <Route path="/bankSearchLand" element={<BankSearchLand />} />

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
