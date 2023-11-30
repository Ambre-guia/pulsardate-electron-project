import { createConnection } from "mysql2";

export default createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  database: "pulsardate",
});
