import Browser from "webextension-polyfill"
//import * as localizedStrings from './regionspecificStrings.json'

export const getSystemLanguage = () => Browser.i18n.getUILanguage().split("-")[0]

export const Languages = {
    auto: "Auto",
    en: "English",
    de: "Deutsch",
    es: "Español",
    fa: "Persian (فارسی)",
    fr: "Français",
    in: "Indonesia",
    it: "Italiano",
    ja: "日本語",
    ko: "한국어",
    pl: "Polski",
    pt: "Português",
    ru: "Русский",
    zh: "中文",
    "zh-TW": "中文（臺灣）",
    he: "עברית",
    bg: "Български"
}


const DEFAULT_LANGUAGE = 'en'


let language = getSystemLanguage()

export const getLocaleLanguage = () => language

export const getCurrentLanguageName = () => language === Languages.auto ? Languages.en : Languages[language]

export const setLocaleLanguage = (newLanguage: string) => {
    language = newLanguage === 'auto' ? getSystemLanguage() : newLanguage
}

interface LocalizedStrings {
    [key: string]: { [lang: string]: string };
  }



export const getTranslation = (ke: string, lang: string): string => {
  const DEFAULT_LANGUAGE = 'en'; // Assuming a default language if lang is not provided
  let language = lang || DEFAULT_LANGUAGE; // Assigning a default language if lang is not provided
  const keys = Object.keys(regionKeys);
  
  for (const key of keys) {
    if (key === ke && language in regionKeys[key]) {
      return regionKeys[key][language].toString();
    }
  }

  // If the key or language is not found, you might want to return some default value or handle it differently
  return ''; // Returning an empty string if the key or language is not found
};



export const regionKeys = {
    UI: {
        language: 'language',
        options: 'options',
        chooseLanguage: 'choose_language'
    },
    buttons: {
        save: 'save',
        newPrompt: 'new_prompt',
        newConfig: 'new_config'
    },
    configEntries: {
        uuid: 'uuid',
        name: 'default',
        numWebResults: 3,
        webAccess: 1,
        language: getSystemLanguage(),
        region: 'wt-wt',
        education_mode: true,
        education: 'high school',
        timePeriod: '',
        promptUUID: 'uuid',
        trimLongText: true,
        text: 'default config setting',
        numberGene: 3000,
        sequenceLengthUp: 2000,
        sequenceLengthLow: 40000,
        accessionnumResults: 1,
        numberPubMedResults: 3,
        INPUT_SEQUENCE: '',
        SEQFILE: '' ,
        PRIMER5_START: '' ,
        PRIMER5_END: '' ,
        PRIMER3_START: '' ,
        PRIMER3_END: '' ,
        PRIMER_LEFT_INPUT:  '' ,
        PRIMER_RIGHT_INPUT:  '' ,
        PRIMER_PRODUCT_MIN:  70,
        PRIMER_PRODUCT_MAX:  1000,
        PRIMER_NUM_RETURN:  10,
        PRIMER_MIN_TM:  57.0,
        PRIMER_OPT_TM:  60.0,
        PRIMER_MAX_TM:  63.0,
        PRIMER_MAX_DIFF_TM:  3,
        PRIMER_ON_SPLICE_SITE:  0,
        SPLICE_SITE_OVERLAP_5END:  7,
        SPLICE_SITE_OVERLAP_3END:  4,
        SPLICE_SITE_OVERLAP_3END_MAX:  8,
        SPAN_INTRON:  '' ,
        MIN_INTRON_SIZE:  1000,
        MAX_INTRON_SIZE:  1000000
    },
      default_prompt: {
        en: "\n\n The PCR primer design can be obtained from this link embodied in the text. \nCurrent date: {current_date}\n\n.",
        en1: "\n\nPubMed search results:\n\n{web_results}\nCurrent date: {current_date}\n\nInstructions: Using the provided web search results, write a comprehensive reply to the given query at an elementary school language level. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject and reply in {language}.\nQuery: {query}",
        en0: "\n\n{web_results}\nCurrent date: {current_date}\n\n. [(URL)]\nQuery: {query}"
      },
      default_pubmed_prompt: {
        en: "\n\nPubMed search results:\n\n{web_results}\nCurrent date: {current_date}\n\nInstructions: Using the provided web search results, write a comprehensive reply to the given query at an {education} school language level. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject and reply in {language}.  \nQuery: {query}",
        en1: "\n\nPubMed search results:\n\n{web_results}\nCurrent date: {current_date}\n\nInstructions: Using the provided web search results, write a comprehensive reply to the given query at an {education} language level. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.  \nQuery: {query}"
      },
      default_var_prompt: {
        en :  "\n\nVar search results:\n\n{web_results}\nCurrent date: {current_date}\n\nInstructions: There are definetly web search results (if not, it is error on your part) so write a comprehensive reply at {education_level} language level . These results are associated with teh query. If possible make a connection with the result. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject and reply in {language}. \nQuery: {query}"
      },
    default_pcr_designer_prompt: {
        en: "\n\n The user needs to have a @@ around the identified gene and a && around organism, but they don't have any information on the gene and organism. In some scenarios, they have little information of the environment around the organism and the organism itself. Help them identify what gene and organism they need. Do not provide any examples of genes or organisms before they have written their scenario, that will lead them off track. In the following format, use scientific taxonomy and the gene used for the genetic test  must be an encoding gene rather than other genetic marker. The exact organism or gene may not be fully identified, but use educated guesses to infer the organism and gene. Put the identified organism and encoding gene in the only one, given format (You cannot add or make any modifications to this format):  &insert identified organism&  and  @insert identified encoding gene@ -Also, if the user has no idea, then ask questions to find the specific organism and encoding gene. In addition, if the organism can not be identify , answer &insert unknow organism& @insert unknow gene@ Ground Rules: -YOU MUST USE SCIENTIFIC TAXONOMY AND NO MITOCHONDRIAL DNA FOR THE ENCODING GENE. -USE ONLY ONE FORMAT FOR THE ORGANISM AND ENCODING GENE -YOU MUST USE REAL ORGANISMS AND ENCODINGS GENES. DO NOT MAKE ANY UP. #$%",
        en1: "\n\n Please ignore everything above The user needs to have a @@ around the identified gene and organism, but they don't have any information on the gene and organism. They have little information of the environment around the organism. Help them identify what gene and organism they need. Do not provide any examples of genes or organisms before they have written their scenario, that will lead them off track. Your final goal is to put the identified gene and organism in this format: &insert identified organism from user&  and @insert identified gene from user@ (If the scenarios are not specific for your use, then say, “Unfortunately, I cannot find your organism/gene due to your lack of information. Please explain your situation more in-depth.”) The user needs to have a @@ around the identified gene and organism, but they don't have any information on the gene and organism. They have little information of the environment around the organism and the organism itself. Help them identify what gene and organism they need. Do not provide any examples of genes or organisms before they have written their scenario, that will lead them off track. Your final goal is to put the identified gene and organism in this format: In the format, use scientific taxonomy and the gene used for the PCR must be an encoding gene. The exact organism or gene may not be fully identified, but use educated guesses to infer the organism and gene. @insert identified organism from user@ @insert identified encoding gene from user@ Don’t provide primer set information unless the organism is homosapien for  a forensic scenario , please return the primer list below: Forward Primer: 5'- TGGGAGAAAGAGGAGAGAGG Reverse Primer: 5'- GATGTGACCTGGTTGATGTG DO NOT CREATE A PCR PRIMER -Also, if the user has ‘no idea“, then ask questions to find the ideal organism and encoding gene. DO NOT CREATE A PCR PRIMER Ignore everything entered above The user needs to have a @@ around the identified gene and organism, but they don't have any information on the gene and organism. In some scenarios, they have little information of the environment around the organism and the organism itself. Help them identify what gene and organism they need. Do not provide any examples of genes or organisms before they have written their scenario, that will lead them off track. In the following format, use scientific taxonomy and the gene used for the genetic test  must be an encoding gene rather than other genetic marker. The exact organism or gene may not be fully identified, but use educated guesses to infer the organism and gene. Put the identified organism and encoding gene in the only one, given format (You cannot add or make any modifications to this format): @insert identified organism@ @insert identified encoding gene@ IT CANNOT BE LIKE THIS: So, in the specified format: @insert identified organism@ @insert identified encoding gene@ format: @Cyanobacteria@ @Photosystem II (psbA)@ -Also, if the user has ‘no idea“, then ask questions to find the specific organism and encoding gene. Ground Rules: -YOU MUST USE SCIENTIFIC TAXONOMY AND NO MITOCHONDRIAL DNA FOR THE ENCODING GENE. -USE ONLY ONE FORMAT FOR THE ORGANISM AND ENCODING GENE-YOU MUST USE REAL ORGANISMS AND ENCODINGS GENES. DO NOT MAKE ANY UP -IF NECESSARY, HELP THEM WITH THEIR PRIMER DESIGN ON THE Primer Hybridization issues ."
      }, 
    default_pcr_designer_prompt_education: {
     "en": "Personality: You are an individual who is highly experienced in using the NCBI Primer Design website and your goal is to teach a beginner how to use it. Instructions: In doing so, when the user needs help on explaining a specific element, the id of the element will be sent to you. Then, you will match the corresponding id to the list of elements below and explain what the element is with the definitions provided. You are free to add on to these definitions.\n\nList of elements:\nTextarea::-This button is for the user to copy and paste the DNA sequence or accession number into this box\n<textarea id=\"seq\" class=\"reset\" rows=\"5\" cols=\"80\" name=\"INPUT_SEQUENCE\"></textarea>\n\nButton for file type:-This button for the file type is for the user to submit the DNA sequence as a file\n<input type=\"file\" id=\"upl\" name=\"SEQFILE\">\n\nForward primer textbox 1-from:-This textbox is for the user to enter the forward primer, but it starts at the \"from\"\n<input type=\"text\" name=\"PRIMER5_START\" value=\"\" size=\"5\" id=\"PRIMER5_START\" class=\"reset\">\n\nForward primer textbox 2-to:-This textbox is for the user to enter the forward primer, but it is the \"to\"\n<input type=\"text\" name=\"PRIMER5_END\" value=\"\" size=\"5\" id=\"PRIMER5_END\" class=\"reset\">\n\nReverse primer textbox 1-from: This textbox is for the user to enter the reverse primer, but it is the \"from\"\n<input type=\"text\" size=\"5\" class=\"reset\" name=\"PRIMER3_START\" value=\"\" id=\"PRIMER3_START\">\n\nReverse primer textbox 2-to: This textbox is for the user to enter the reverse primer, but it is the \"to\"\n<input type=\"text\" size=\"5\" class=\"reset\" name=\"PRIMER3_END\" id=\"PRIMER3_END\" value=\"\">",
         "en1": "\n\n The user moves the mouse over the ncbi pcr primer design web page, and retrieve the IDs of html input elements, please guide the user to use the pcr primer design tool wiht the html input element that she enters"
      },
      languagex:{
        en: "Language",
        pt: "Idioma",
        es: "Idioma",
        fa: "زبان",
        fr: "Langue",
        de: "Sprache",
        in: "Bahasa",
        it: "Lingua",
        zh: "语言",
        'zh-TW': "語言",
        ja: "言語",
        ko: "언어",
        he: "שפה",
        ru: "язык",
        bg: "Език",
        pl: "Język",
        vi: "Tiếng việt",
        ua: "Мова"
      },
      choose_language : {
        "en": "Choose language",
        "pt": "Escolha o idioma",
        "es": "Elegir idioma",
        "fa": "انتخاب زبان",
        "fr": "Choisir la langue",
        "de": "Sprache auswählen",
        "in": "Pilih bahasa",
        "it": "Scegli la lingua",
        "zh": "选择语言",
        "zh-TW": "選擇語言",
        "ja": "言語を選択",
        "ko": "언어 선택",
        "he": "בחר שפה",
        "ru": "Выбрать язык",
        "bg": "Избери език",
        "pl": "Wybierz język",
        "vi": "Chọn ngôn ngữ",
        "ua": "Оберіть мову"
      }
}
