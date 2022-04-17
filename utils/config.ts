const getStringValue = (name: string): string => {
  return process.env[name] ?? "";
};

const getBoolValue = (name: string): boolean => {
  return process.env[name] === "true";
};

export const config = {
  db_uri: getStringValue("MONGODB_URI"),
  secret: getStringValue("SECRET"),
  no_connection: getBoolValue("NO_CONNECTION"),
  mail: {
    service: getStringValue("MAIL_SERVICE"),
    address: getStringValue("MAIL"),
    password: getStringValue("MAIL_PASS"),
  },
};
