import { ENV } from "./common-env";

export const environment = {
    production: true,
    api: `http://${ENV.HOST}:${ENV.PORT}/api`,
    url: `http://${ENV.HOST}:${ENV.PORT}`,
};