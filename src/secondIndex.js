import bar from "./bar";
import _ from "lodash";

const result = _.compact([0, 1, false, 2, "", 4]);
console.log("qita结果", result);

console.log("这是对象", bar.names);

import(/* webpackChunkName: "dynamic" */ "./dynamic.js").then((data) => {
  console.log("这是", data.default.customize);
});
