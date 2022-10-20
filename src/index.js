import bar from "./bar";
import "./assets/less/test.less";
import _ from "lodash";
import $ from "jQuery";

const result = _.compact([0, 1, false, 2, "", 3]);
console.log("结果", result);

console.log("第三方", $);

bar.func();
