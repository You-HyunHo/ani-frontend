import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 1️⃣ 각 언어별/페이지별 JSON 파일들을 모두 import 합니다.
import koLogin from "./locales/ko/login.json";
import koRegister from "./locales/ko/register.json";


import jaLogin from "./locales/ja/login.json";
import jaRegister from "./locales/ja/register.json";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 2️⃣ resources 객체 안에 구조화하여 연결합니다.
    resources: {
      ko: {
        // '네임스페이스이름': 불러온파일변수명
        login: koLogin,
        register: koRegister,
       
      },
      ja: {
        login: jaLogin,
        register: jaRegister,
       
      }
    },
    
    // 3️⃣ 기본 설정
    fallbackLng: "ko", // 번역 파일이 없거나 감지에 실패했을 때 기본값
    debug: true, // 개발 단계에서 콘솔에 번역 관련 로그를 출력 (배포 시 false 권장)

    // 4️⃣ 네임스페이스 설정
    ns: ["login", "register", "common"], // 사용할 모든 네임스페이스 등록
    defaultNS: "common", // 기본으로 사용할 네임스페이스

    interpolation: {
      escapeValue: false // 리액트는 이미 XSS 방지를 하므로 false 설정
    }
  });

export default i18n;