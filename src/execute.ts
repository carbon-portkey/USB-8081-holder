import * as ChildProcess from "node:child_process";
import { IDeviceConfig } from "./core";

const PortConfig = require("../config.json");

let servicePointer: NodeJS.Timeout | null = null;
const CHECK_TIME_GAP = 5 * 1000;

export const getShellScript = () => {
  const { computerPort = 8081, devicePort = 8081 } =
    PortConfig as IDeviceConfig;
  return `adb reverse tcp:${computerPort} tcp:${devicePort}`;
};

export const triggerProcess = () => {
  const adbShellScript = "adb devices";
  ChildProcess.exec(adbShellScript, (error, stdout, _) => {
    if (error) {
      if (!error.message.includes("no devices/emulators found")) {
        console.error(
          `shell error: ${error.message}. Make sure you have adb installed and added to your PATH.`
        );
        return;
      }
    }
    const deviceNum =
      stdout.split("\n").reduce((acc, cur) => {
        if (cur.includes("device")) {
          acc++;
        }
        return acc;
      }, 0) - 1;
    if (deviceNum > 1) {
      // only one device is allowed
      console.log(
        `${deviceNum} devices found, this process will be ignored until you have only 1 device connected to adb.\n`
      );
      return;
    }
    if (deviceNum === 0) {
      // loop until device is connected to adb
      servicePointer = setTimeout(() => {
        triggerProcess();
      }, CHECK_TIME_GAP);
    } else {
      const { computerPort = 8081 } = PortConfig as IDeviceConfig;
      console.log(
        `adb is connected with 1 device now, trying to process '${getShellScript()}' `
      );
      ChildProcess.exec(getShellScript(), (error, stdout, _) => {
        if (error) {
          console.error(
            `shell error: ${error.message}. Make sure you have adb installed and added to your PATH.`
          );
          return;
        }
        if (stdout.includes(`${computerPort}`)) {
          console.log(
            `running adb shell script success:\n${stdout}You can now use your metro command to refresh your app.\n`
          );
        }
        clearProcess();
      });
    }
  });
};

export const clearProcess = () => {
  if (servicePointer) {
    clearTimeout(servicePointer);
  }
};
