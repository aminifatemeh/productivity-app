import React, { createContext, useState, useEffect } from "react";
import faTranslations from "../locales/fa.json";
import enTranslations from "../locales/en.json";

export const LanguageContext = createContext();

const translations = {
    fa: faTranslations,
    en: enTranslations,
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || "fa");

    useEffect(() => {
        localStorage.setItem("language", language);
        document.documentElement.setAttribute("dir", language === "fa" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", language);
    }, [language]);

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;