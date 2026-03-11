import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const loadPath = (lngs: readonly string[], namespaces: readonly string[]) => {
  const lng = lngs[0] ?? 'en';
  const ns = namespaces[0] ?? 'file';
  const folder = lng === 'en' ? 'defult-en' : lng;
  return `/locales/${folder}/${ns}.json`;
};

void i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['file'],
    defaultNS: 'file',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
