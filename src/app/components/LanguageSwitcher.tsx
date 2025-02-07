"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSelector() {
  const router = useRouter();
  
  const [lang, setLang] = useState<string>("ge"); 

  useEffect(() => {
    const storedLang = localStorage.getItem("NEXT_LOCALE");
    if (storedLang) {
      setLang(storedLang);
    } else {
      const cookieLang = getCookie("lang");
      if (cookieLang) {
        setLang(cookieLang);
        localStorage.setItem("NEXT_LOCALE", cookieLang); 
      }
    }
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedLang = event.target.value;
    
    const pathWithoutLang = window.location.pathname.replace(/^\/(en|ge)/, "");
    
    router.push(`/${selectedLang}${pathWithoutLang}`);
    
    setLang(selectedLang);

    localStorage.setItem("NEXT_LOCALE", selectedLang);
    setCookie("NEXT_LOCALE", selectedLang, 365); 
  };

  function getCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : undefined;
  }

  function setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); 
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`; 
  }

  return (
    <select
      value={lang}
      onChange={handleLanguageChange}
      className="px-4 py-2 border rounded-md border-blue-500 bg-transparent text-black
       dark:text-white  
      focus:outline-none focus:ring-2 focus:ring-blue-500 "
    >
      <option value="ge" className=" bg-slate-200 dark:bg-gray-800">GE</option>
      <option value="en" className=" bg-slate-200 dark:bg-gray-800">EN</option>
    </select>
  );
}
