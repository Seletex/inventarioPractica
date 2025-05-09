import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const HiladorDeCarga = ({ message = "Cargando página..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 200px)",
        textAlign: "center",
      }}
    >
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        animationDuration=".5s"
      />
      <p style={{ marginTop: "1rem" }}>{message}</p>
    </div>
  );
};
export default HiladorDeCarga;
