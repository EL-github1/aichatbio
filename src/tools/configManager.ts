import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, regionKeys, getSystemLanguage  } from "./regionspecific"
export const SAVED_CONFIGS_KEY = 'saved_configs'
export const SAVED_CONFIGS_MOVED_KEY = 'saved_configs_moved_to_local'
import { defaults } from 'lodash-es'

export async function getConfig(): Promise<Config> {
    const config = await Browser.storage.sync.get(getDefaultConfig())

    return defaults(config, getDefaultConfig())
}

export async function updateConfig(config: Partial<Config>): Promise<void> {
    await Browser.storage.sync.set(config)
}

export interface Config {
    uuid: string,
    name: string,
    numWebResults: number,
    webAccess: number,
    region: string,
    education: string,
    timePeriod: string,
    promptUUID: string,
    trimLongText: boolean,
    text: string,
    language: string,
    // mode
    education_mode: boolean,
    //accession
    numberGene: number,
    sequenceLengthUp: number,
    sequenceLengthLow: number,
    accessionnumResults: number,
    //pubmed
    numberPubMedResults: number
    // primer
    INPUT_SEQUENCE: string,
    SEQFILE: string,
    PRIMER5_START: string,
    PRIMER5_END: string,
    PRIMER3_START: string,
    PRIMER3_END: string,
    PRIMER_LEFT_INPUT:  string,
    PRIMER_RIGHT_INPUT:  string,
    PRIMER_PRODUCT_MIN:  number,
    PRIMER_PRODUCT_MAX:  number,
    PRIMER_NUM_RETURN:  number,
    PRIMER_MIN_TM:  number,
    PRIMER_OPT_TM:  number,
    PRIMER_MAX_TM:  number,
    PRIMER_MAX_DIFF_TM:  number,
    PRIMER_ON_SPLICE_SITE:  number,
    SPLICE_SITE_OVERLAP_5END:  number,
    SPLICE_SITE_OVERLAP_3END:  number,
    SPLICE_SITE_OVERLAP_3END_MAX:  number,
    SPAN_INTRON:  string,
    MIN_INTRON_SIZE:  number,
    MAX_INTRON_SIZE:  number
    
}

export const getDefaultConfig = () => {
    return {
        uuid: 'default_uuid',
        name: 'default',
        numWebResults: 3,
        webAccess: 1,
        language: getSystemLanguage(),
        education_mode: false,
        region: 'wt-wt',
        education: 'high school',
        timePeriod: '',
        promptUUID: 'uuid',
        trimLongText: true,
        text: getTranslation('defaultPrompt', 'en'), //+ (getLocaleLanguage() !== 'en' ? `\nReply in ${getCurrentLanguageName()}` : ''),
        numberGene: 3000,
        sequenceLengthUp: 50000,
        sequenceLengthLow: 1000,
        accessionnumResults: 1,
        numberPubMedResults: 3,
        INPUT_SEQUENCE: '',//
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
       }
}

export const getDefaultConfigs = () => {
    return [ {
        uuid: 'default_uuid',
        name: 'default',
        numWebResults: 30,
        webAccess: 0,
        language: getSystemLanguage(),
        education_mode: false,
        region: 'wt-wt',
        education: 'high school',
        timePeriod: '',
        promptUUID: 'uuid',
        trimLongText: true,
        text: 'chatbio',
        numberGene: 3000,
        sequenceLengthUp: 400,
        sequenceLengthLow: 100,
        accessionnumResults: 1,
        numberPubMedResults: 3,
        INPUT_SEQUENCE: '',//
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
        MIN_INTRON_SIZE:  1,
        MAX_INTRON_SIZE:  1000000
       },
       {}
    ]
}
export const saveConfig = async (config: Config) => {
    const savedConfigs = await getSavedConfigs()
    const index = savedConfigs.findIndex((i: Config) => i.uuid === config.uuid)
    if (index >= 0) {
        savedConfigs[index] = config
    } else {
        config.uuid = uuidv4()
        savedConfigs.push(config)
    }
    await Browser.storage.local.set({ [SAVED_CONFIGS_KEY]: savedConfigs })

}

export const deleteConfig = async (config: Config) => {
    let savedConfigs = await getSavedConfigs()
    savedConfigs = savedConfigs.filter((i: Config) => i.uuid !== config.uuid)
    await Browser.storage.local.set({ [SAVED_CONFIGS_KEY]: savedConfigs })
}


export const getSavedConfigs = async (addDefaults = true) => {
    const { [SAVED_CONFIGS_KEY]: localConfigs, [SAVED_CONFIGS_MOVED_KEY]: configsMoved } = await Browser.storage.local.get({ [SAVED_CONFIGS_KEY]: [], [SAVED_CONFIGS_MOVED_KEY]: false })

    let savedConfigs = localConfigs
    if (!configsMoved) {
        const syncStorage = await Browser.storage.sync.get({ [SAVED_CONFIGS_KEY]: [] })
        const syncConfigs = syncStorage?.[SAVED_CONFIGS_KEY] ?? []

        savedConfigs = localConfigs.reduce((configs: Config[], config: Config) => {
            if (!configs.some(({ uuid }) => uuid === config.uuid)) configs.push(config);
            return configs
        }, syncConfigs)

        await Browser.storage.local.set({ [SAVED_CONFIGS_KEY]: savedConfigs, [SAVED_CONFIGS_MOVED_KEY]: true })
        await Browser.storage.sync.set({ [SAVED_CONFIGS_KEY]: [] })
    }

    return savedConfigs
}

