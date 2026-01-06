import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "title_start": "Intern",
      "title_end": "Connect",
      "subtitle": "AI-Powered Matching for the PM Internship Scheme",
      "upload_title": "🚀 Upload your Resume to find matches",
      "upload_analyzing": "✨ AI is reading your resume...",
      "profile_analyzed": "✅ Profile Analyzed",
      "name": "Name",
      "role": "Best Role",
      "rec_title": "🎯 Recommended for You",
      "all_title": "🌐 All Opportunities",
      "loading": "Loading opportunities...",
      "no_match": "No matches found. Update your skills!",
      "view_details": "Apply Now"
    }
  },
  hi: {
    translation: {
      "title_start": "इंटर्न",
      "title_end": "कनेक्ट",
      "subtitle": "पीएम इंटर्नशिप योजना के लिए एआई-आधारित मैचिंग",
      "upload_title": "🚀 मैच खोजने के लिए अपना बायोडाटा अपलोड करें",
      "upload_analyzing": "✨ एआई आपका बायोडाटा पढ़ रहा है...",
      "profile_analyzed": "✅ प्रोफाइल का विश्लेषण पूर्ण",
      "name": "नाम",
      "role": "भूमिका",
      "rec_title": "🎯 आपके लिए अनुशंसित",
      "all_title": "🌐 सभी अवसर",
      "loading": "अवसर लोड हो रहे हैं...",
      "no_match": "कोई मेल नहीं मिला।",
      "view_details": "आवेदन करें"
    }
  },
  mr: { // Marathi Support
    translation: {
      "title_start": "इंटर्न",
      "title_end": "कनेक्ट",
      "subtitle": "पीएम इंटर्नशिप योजनेसाठी एआय-आधारित मॅचिंग",
      "upload_title": "🚀 सामने शोधण्यासाठी आपला बायोडाटा अपलोड करा",
      "upload_analyzing": "✨ एआय आपला बायोडाटा वाचत आहे...",
      "profile_analyzed": "✅ प्रोफाइल विश्लेषण पूर्ण",
      "name": "नाव",
      "role": "भूमिका",
      "rec_title": "🎯 आपल्यासाठी शिफारस केलेले",
      "all_title": "🌐 सर्व संधी",
      "loading": "संधी लोड होत आहेत...",
      "no_match": "कोणतेही जुळले नाही.",
      "view_details": "अर्ज करा"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;