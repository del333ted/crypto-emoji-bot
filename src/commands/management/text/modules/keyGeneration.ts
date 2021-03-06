// Dependencies
import { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'
import { KeyModel } from '../../../../models/Key'
import { GenerateRandomKey } from '../../../../helpers/crypto'

export async function keyGeneration(ctx: ContextMessageUpdate, next) {
  if (ctx?.session?.stage != 5) {
    await next()
    return
  }
  if (ctx.keys.length > 9) {
    return await ctx.reply('too_many_keys_string')
  }
  const name = ctx.message.text
  if (name.length > 48) {
    return await ctx.reply('length_too_long_48')
  }
  const key = await GenerateRandomKey()
  let newkey = await KeyModel.create({
    key,
    name,
    user: ctx.dbuser._id.toString(),
  })

  ctx.reply(
    ctx.i18n.t('manage_key', { name, key: newkey.key }),
    Extra.HTML(true) as ExtraEditMessage,
  )

  ctx.session.stage = 1
  return await ctx.saveSession()
}
