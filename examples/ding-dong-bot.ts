/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  EventLogoutPayload,
  EventLoginPayload,
  EventScanPayload,
  EventErrorPayload,
  EventMessagePayload,
}                         from 'wechaty-puppet'
import {
  PuppetWalnut,
}               from '../src/mod'

/**
 *
 * 1. Declare your Bot!
 *
 */
const puppet = new PuppetWalnut({ sms:'+861234' })

/**
 *
 * 2. Register event handlers for Bot
 *
 */
puppet
  .on('logout', onLogout)
  .on('login',  onLogin)
  .on('scan',   onScan)
  .on('error',  onError)
  .on('message', onMessage)

/**
 *
 * 3. Start the bot!
 *
 */
puppet.start()
  .catch(async (e: any) => {
    console.error('Bot start() fail:', e)
    await puppet.stop()
    process.exit(-1)
  })

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan (payload: EventScanPayload) {
  if (payload.qrcode) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(payload.qrcode),
    ].join('')
    console.info(`[${payload.status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)

  } else {
    console.info(`[${payload.status}]`)
  }
}

function onLogin (payload: EventLoginPayload) {
  console.info(`${payload.contactId} login`)
  puppet.messageSendText(payload.contactId, 'Wechaty login').catch(console.error)
}

function onLogout (payload: EventLogoutPayload) {
  console.info(`${payload.contactId} logouted`)
}

function onError (payload: EventErrorPayload) {
  console.error('Bot error:', payload.data)
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (payload: EventMessagePayload) {
  const msgPayload = await puppet.messagePayload(payload.messageId)
  if (/ding/i.test(msgPayload.text || '')) {
    console.info('ding success')
    await puppet.messageSendText(
     msgPayload.fromId!,
     'dong',
    )
  } else {
    console.info('ding not found')
    await puppet.messageSendText(
      msgPayload.fromId!,
      'ding please',
    )
  }
  console.info(JSON.stringify(msgPayload))
}

/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
Puppet Version: ${puppet.version()}

Please wait... I'm trying to login in...

`
console.info(welcome)
