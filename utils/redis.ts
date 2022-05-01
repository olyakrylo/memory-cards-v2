import Redis, { RedisKey } from "ioredis";

import { config } from "./config";

class RedisClient {
  instance: Redis;

  constructor() {
    this.instance = new Redis(config.redis.url, {
      password: config.redis.password,
    });
  }

  async uploadImage(
    key: string,
    buffer: Buffer
  ): Promise<{ uploaded: boolean }> {
    const status = await this.instance.set(key, buffer);
    return { uploaded: status === "OK" };
  }

  getImage(key: string): Promise<Buffer | null> {
    return this.instance.getBuffer(key);
  }

  getKeys(): Promise<string[]> {
    return this.instance.keys("*");
  }

  async deleteByKeys(keys: RedisKey[]): Promise<{ deleted: boolean }> {
    const res = await this.instance.del(keys);
    return { deleted: keys.length === res };
  }
}

export default new RedisClient();
