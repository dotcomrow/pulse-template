import { getRequestContext } from "@cloudflare/next-on-pages";

export default {
    async recordTelemetry() {
        console.log(getRequestContext().env);
    }
}