// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import {ENV} from "./src/config/env.js";

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  traceSampleRate: 1.0, // Adjust this value in production as needed
  profilesSampleRate: 1.0, // Adjust this value in production as needed
  environment: ENV.NODE_ENV || "development",
  includeLocalVariables: true, // Set to false in production for security reasons
  // To disable sending user data, uncomment the line below. For more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
  // dataCollection: { userInfo: false },

  sendDefaultPii: true, // Set to false in production for security reasons
});