import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'en', 
            autoDisplay: false 
            // I REMOVED 'layout: SIMPLE' HERE -> This brings back the text & logo!
          }, 
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    }
  }, []);

  return (
    <div id="google_translate_element"></div>
  );
};

export default GoogleTranslate;