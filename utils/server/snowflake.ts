import { DiscordSnowflake } from "@sapphire/snowflake";

export function snowflake() {
	return DiscordSnowflake.generate().toString();
}
