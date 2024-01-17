"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearProcess = exports.triggerProcess = exports.getShellScript = void 0;
var ChildProcess = require("node:child_process");
var PortConfig = require("../config.json");
var servicePointer = null;
var CHECK_TIME_GAP = 5 * 1000;
var getShellScript = function () {
    var _a = PortConfig, _b = _a.computerPort, computerPort = _b === void 0 ? 8081 : _b, _c = _a.devicePort, devicePort = _c === void 0 ? 8081 : _c;
    return "adb reverse tcp:".concat(computerPort, " tcp:").concat(devicePort);
};
exports.getShellScript = getShellScript;
var triggerProcess = function () {
    var adbShellScript = "adb devices";
    ChildProcess.exec(adbShellScript, function (error, stdout, _) {
        if (error) {
            if (!error.message.includes("no devices/emulators found")) {
                console.error("shell error: ".concat(error.message, ". Make sure you have adb installed and added to your PATH."));
                return;
            }
        }
        var deviceNum = stdout.split("\n").reduce(function (acc, cur) {
            if (cur.includes("device")) {
                acc++;
            }
            return acc;
        }, 0) - 1;
        if (deviceNum > 1) {
            // only one device is allowed
            console.log("".concat(deviceNum, " devices found, this process will be ignored until you have only 1 device connected to adb.\n"));
            return;
        }
        if (deviceNum === 0) {
            // loop until device is connected to adb
            servicePointer = setTimeout(function () {
                (0, exports.triggerProcess)();
            }, CHECK_TIME_GAP);
        }
        else {
            var _a = PortConfig.computerPort, computerPort_1 = _a === void 0 ? 8081 : _a;
            console.log("adb is connected with 1 device now, trying to process '".concat((0, exports.getShellScript)(), "' "));
            ChildProcess.exec((0, exports.getShellScript)(), function (error, stdout, _) {
                if (error) {
                    console.error("shell error: ".concat(error.message, ". Make sure you have adb installed and added to your PATH."));
                    return;
                }
                if (stdout.includes("".concat(computerPort_1))) {
                    console.log("running adb shell script success:\n".concat(stdout, "You can now use your metro command to refresh your app.\n"));
                }
                (0, exports.clearProcess)();
            });
        }
    });
};
exports.triggerProcess = triggerProcess;
var clearProcess = function () {
    if (servicePointer) {
        clearTimeout(servicePointer);
    }
};
exports.clearProcess = clearProcess;
