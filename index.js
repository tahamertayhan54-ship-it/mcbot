const mineflayer = require('mineflayer')
const { Client, GatewayIntentBits } = require('discord.js')

/* ===== DISCORD BOT ===== */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const DISCORD_TOKEN = 'MTQ1NzA4ODU2NzM4MDgwMzc5Ng.GUoo_g.Htmq0ROHcS_4xizq8Asl0yv00pKgqbpYFkfP9o'
const PREFIX = '!'

/* ===== MINECRAFT BOT ===== */
let mcBot = null
let alreadyDone = false

function startMcBot() {
  if (mcBot) return 'Bot zaten çalışıyor'

  mcBot = mineflayer.createBot({
    host: 'zurnacraft.net',
    port: 25565,
    username: '54sigma54',
    version: '1.19.2'
  })

  mcBot.once('spawn', () => {
    console.log('MC bot girdi')

    setTimeout(() => {
      if (!alreadyDone) mcBot.chat('/login benbitben')

      setTimeout(() => {
        if (!alreadyDone) {
          mcBot.chat('/warp afk')
          alreadyDone = true
        }
      }, 15000)
    }, 2000)
  })

  mcBot.on('chat', (u, m) => {
    console.log(`[MC] ${u}: ${m}`)
  })

  mcBot.on('end', () => {
    mcBot = null
    alreadyDone = false
  })

  return 'MC bot başlatıldı'
}

/* ===== DISCORD KOMUTLARI ===== */
client.on('messageCreate', msg => {
  if (!msg.content.startsWith(PREFIX)) return

  const cmd = msg.content.slice(1)

  if (cmd === 'start') {
    msg.reply(startMcBot())
  }

  if (cmd === 'stop') {
    if (mcBot) {
      mcBot.quit()
      mcBot = null
      alreadyDone = false
      msg.reply('MC bot durduruldu')
    }
  }

  if (cmd.startsWith('say ')) {
    if (!mcBot) return msg.reply('MC bot çalışmıyor')
    mcBot.chat(cmd.replace('say ', ''))
    msg.reply('Mesaj gönderildi')
  }
})

client.login(DISCORD_TOKEN)
