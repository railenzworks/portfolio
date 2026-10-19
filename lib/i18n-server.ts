import { cookies } from 'next/headers';
import { DEFAULT_LANG, DICT, isLang, LANG_COOKIE, type Lang } from './i18n';

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getDict() {
  return DICT[await getLang()];
}
