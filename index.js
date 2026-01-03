const mineflayer = require('mineflayer')
const { Client, GatewayIntentBits } = require('discord.js')

/* ===== ENV ===== */
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
if (!DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN yok (Railway Variables)')
  process.exit(1)
}

/* ===== DISCORD ===== */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

/* ===== MINECRAFT ===== */
let mcBot = null
let done = false

function startMcBot() {
  if (mcBot) return 'MC bot zaten çalışıyor'

  done = false
  mcBot = mineflayer.createBot({
    host: 'zurnacraft.net',
    port: 25565,
    username: '54sigma54',
    version: '1.19.2'
  })

  mcBot.once('spawn', () => {
    console.log('[MC] Sunucuya girdi')

    setTimeout(() => {
      if (!done) {
        mcBot.chat('/login benbitben')
        console.log('[MC] /login yazıldı')

        setTimeout(() => {
          if (!done) {
            mcBot.chat('/warp afk')
            console.log('[MC] /warp afk yazıldı')
            done = true
          }
        }, 15000)
      }
    }, 2000)
  })

  mcBot.on('chat', (u, m) => {
    console.log(`[MC CHAT] ${u}: ${m}`)
  })

  mcBot.on('end', () => {
    console.log('[MC] Çıkış yaptı')
    mcBot = null
    done = false
  })

  mcBot.on('error', err => console.log('[MC ERROR]', err))
  return 'MC bot başlatıldı'
}

/* ===== DISCORD KOMUT ===== */
client.on('messageCreate', msg => {
  if (msg.author.bot) return
  if (msg.content === '!start') {
    msg.reply(startMcBot())
  }
  if (msg.content === '!stop') {
    if (!mcBot) return msg.reply('MC bot çalışmıyor')
    mcBot.quit()
    mcBot = null
    done = false
    msg.reply('MC bot durduruldu')
  }
})

client.once('ready', () => {
  console.log(`[DISCORD] Giriş yapıldı: ${client.user.tag}`)
})

client.login(DISCORD_TOKEN)
