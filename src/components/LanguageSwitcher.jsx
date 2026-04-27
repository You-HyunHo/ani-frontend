import { useTranslation } from "react-i18next";
import "../css/LanguageSwitcher.css"; // 스타일은 따로 뺍니다.

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 선택한 언어를 로컬스토리지에 저장해두면 다음에 접속해도 유지됩니다.
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div className="language-switcher">
      <button 
        className={i18n.language === 'ko' ? 'active' : ''} 
        onClick={() => changeLanguage('ko')}
      >
        KR
      </button>
      <span className="divider">|</span>
      <button 
        className={i18n.language === 'ja' ? 'active' : ''} 
        onClick={() => changeLanguage('ja')}
      >
        JP
      </button>
    </div>
  );
}

export default LanguageSwitcher;