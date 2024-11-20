import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
import { expand } from "dotenv-expand";

const YAML_CONFIG_FILENAME = "configuration.yaml";

function expandConfigMap(configMap: Record<string, any>) {
  for (const key in configMap) {
    if (typeof configMap[key] === "object") {
      if (Array.isArray(configMap[key])) {
        for (let element of configMap[key]) {
          expandConfigMap(element);
        }
      } else {
        expandConfigMap(configMap[key]);
      }
    } else if (typeof configMap[key] === "string") {
      const expandConfig = {
        parsed: {
          [key]: configMap[key],
        },
      };
      expand(expandConfig);
      configMap[key] = expandConfig.parsed[key];
    }
  }
}

export default () => {
  const configMap = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf8"),
  ) as Record<string, any>;
  expandConfigMap(configMap);
  return configMap;
};
