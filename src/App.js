import "./App.css";
import React, { Suspense } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
// import Masu from './Masu';
import Origami from "./Origami";

export default function App() {
  return (
    <Suspense fallback="Loading...">
      <Nav />
      <div style={{ marginTop: "4rem" }}>
        <Origami />
      </div>
      <Footer />
    </Suspense>
  );
}
