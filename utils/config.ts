const getStringValue = (name: string): string => {
  return process.env[name] ?? "";
};

const getBoolValue = (name: string): boolean => {
  return process.env[name] === "true";
};

export const config = {
  db_uri: getStringValue("MONGODB_URI"),
  secret: getStringValue("SECRET"),
  redis: {
    url: getStringValue("REDIS_URL"),
    password: getStringValue("REDIS_PASS"),
  },
  no_connection: getBoolValue("NO_CONNECTION"),
  mail: {
    service: getStringValue("MAIL_SERVICE"),
    address: getStringValue("MAIL"),
    password: getStringValue("MAIL_PASS"),
  },
  img_domain: getStringValue("IMG_DOMAIN"),
};
