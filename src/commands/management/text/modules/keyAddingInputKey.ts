// Dependencies
import { ContextMessageUpdate } from 'telegraf'
import {
  ReplaceUTF8Surrogate,
  CheckValidation,
} from '../../../../helpers/crypto'

export async function keyAddingInputKey(ctx: ContextMessageUpdate, next) {
  if (ctx?.session?.stage != 6) {
    await next()
    return
  }
  if (ctx.keys.length > 9) {
    return await ctx.reply(ctx.i18n.t('too_many_keys_string'))
  }
  const key = ReplaceUTF8Surrogate(ctx.message.text)
  if (key.length > 300) {
    return await ctx.reply(ctx.i18n.t('too_many_keys_string'))
  }
  const validated = await CheckValidation(key)
  if (!validated) {
    return await ctx.reply(ctx.i18n.t('this_is_not_key'))
  }
  ctx.reply(ctx.i18n.t('name_input'))
  ctx.session.key = key
  ctx.session.stage = 7
  return await ctx.saveSession()
}
