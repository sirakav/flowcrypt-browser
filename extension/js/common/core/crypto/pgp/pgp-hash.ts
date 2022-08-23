/* ©️ 2016 - present FlowCrypt a.s. Limitations apply. Contact human@flowcrypt.com */

'use strict';

import { Buf } from '../../buf.js';
import { opgp } from './openpgpjs-custom.js';

export class PgpHash {

  public static sha256UtfStr = async (string: string) => {
    return opgp.util.Uint8Array_to_hex(await opgp.crypto.hash.digest(opgp.enums.hash.sha256, Buf.fromUtfStr(string)));
  };

  public static challengeAnswer = async (answer: string) => {
    return await PgpHash.cryptoHashSha256Loop(answer);
  };

  private static cryptoHashSha256Loop = async (string: string, times = 100000) => {
    for (let i = 0; i < times; i++) {
      string = await PgpHash.sha256UtfStr(string);
    }
    return string;
  };

}
