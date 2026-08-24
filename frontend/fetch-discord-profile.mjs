// fetch-discord-profile.mjs
import dotenv from "dotenv"
dotenv.config({ path: "../backend/.env" })
import { writeFileSync } from "fs"


const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const USER_ID = process.env.DISCORD_USER_ID

const BADGE_FLAGS = {
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUG_HUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  BUG_HUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT_DEVELOPER: 1 << 17,
  ACTIVE_DEVELOPER: 1 << 22,
}

function decodeBadges(flags) {
  return Object.entries(BADGE_FLAGS)
    .filter(([, bit]) => (flags & bit) === bit)
    .map(([name]) => name)
}

function buildImageUrl(type, id, hash, size) {
  if (!hash) return null
  const isAnimated = hash.startsWith("a_")
  return `https://cdn.discordapp.com/${type}/${id}/${hash}.webp?size=${size}${
    isAnimated ? "&animated=true" : ""
  }`
}

async function main() {
  const res = await fetch(`https://discord.com/api/v10/users/${USER_ID}`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  })

  if (!res.ok) {
    console.error("Failed to fetch:", res.status, await res.text())
    return
  }

  const user = await res.json()

  const result = {
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    avatar_url: buildImageUrl("avatars", user.id, user.avatar, 512),
    banner_url: buildImageUrl("banners", user.id, user.banner, 600),
    banner_color: user.banner_color,
    badges: decodeBadges(user.public_flags ?? 0),
  }

  const outputPath = "./src/data/discord-profile.json"
  writeFileSync(outputPath, JSON.stringify(result, null, 2))

  console.log(`Saved to ${outputPath}`)
}

main()