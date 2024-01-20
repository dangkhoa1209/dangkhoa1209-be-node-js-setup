import dotenv from "dotenv";
dotenv.config();

const dbDSN = process.env.DB_DSN || "mongodb+srv";
const dbPort = process.env.DB_PORT || "27017";
const dbHost = process.env.DB_HOST || "localhost";
const dbUsername = process.env.DB_USERNAME || "";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_DATABASE || "";

const connectionString = `${dbDSN}://${dbUsername}:${dbPassword}@${dbName}.${dbHost}?authSource=admin&retryWrites=true&w=majority`;

export default { dbHost, dbPort, dbUsername, dbPassword, connectionString };
