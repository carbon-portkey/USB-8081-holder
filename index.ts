import { usb } from "usb";
import process = require("node:process");
import { clearProcess, triggerProcess } from "./src/execute";

const PortConfig = require("./config.json");

// this will prevent the process from exiting until you force it
process.on("beforeExit", () => {
  console.log("beforeExit");
});

const onDeviceChange = () => {
  clearProcess();
  triggerProcess();
};

usb.on("attach", onDeviceChange);

usb.on("detach", onDeviceChange);

console.log("start to listen usb attach and detach event.\n");
console.log("press ctrl+c to exit.\n");
console.log(
  "using config in ./config.json :\n" +
    JSON.stringify(PortConfig, null, 2) +
    "\n"
);
