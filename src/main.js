import "./styles.css";
import { BrassketApp } from "./app.js";

function start() {
  window.app = new BrassketApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
