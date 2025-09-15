// Frontend-only map from product code to a file path that contains the mapping object in the models folder.
// Fill these paths so they are accessible by the frontend (e.g., served from /public or a CDN).
import fgco_Mapping from '../models/fgco_Mapping.js';
import fglm_Mapping from '../models/fglm_Mapping.js';
import enumMappingsCC5_CL from '../models/CC5_CL_Mappings.js';
import enumMappingsCC5_OP4OE from '../models/CC5_OP4OE_Mappings.js';
import enumMappingsCOE_CDL from '../models/COE_CDL_Mappings.js';
import enumMappingsCOE_CEL from '../models/COE_CEL_Mappings.js';
import enumMappingsCOE_OP4OE from '../models/COE_OP4OE_Mappings.js';
import enumMappingsFT_FTL from '../models/FT_FTL_Mappings.js';
import enumMappingsFT_OP4OE from '../models/FT_OP4OE_Mappings.js';
import enumMappingsFT_OPCO from '../models/FT_OPCO_Mappings.js';
import enumMappingsIBR_OP4OE from '../models/IBR_OP4OE_Mappings.js';
import enumMappingsIBR_RFC from '../models/IBR_RFC_Mappings.js';
import enumMappingsOHP_001 from '../models/OHP_001_Mappings.js';
import enumMappingsOHP_2100I from '../models/OHP_2100I_Mappings.js';
import enumMappingsOHP_9000I from '../models/OHP_9000I_Mappings.js';
import enumMappingsOHP_CBS from '../models/OHP_CBS_Mappings.js';
import enumMappingsOHP_CDL from '../models/OHP_CDL_Mappings.js';
import enumMappingsOHP_ES from '../models/OHP_ES_Mappings.js';
import enumMappingsOHP_OEB from '../models/OHP_OEB_Mappings.js';
import enumMappingsOHP_YCB from '../models/OHP_YCB_Mappings.js';
import enumMappingsOHP_PMM from '../models/OHP_PMM_Mappings.js';
import enumMappingsOHP_OP55 from '../models/OHP_OP55_Mappings.js';
import enumMappingsOHP_OP8NP from '../models/OHP_OP8NP_Mappings.js';
import enumMappingsOHP_OP13 from '../models/OHP_OP13_Mappings.js';
import enumMappingsOHP_PML from '../models/OHP_PML_Mappings.js';
import enumMappingsOHP_OP8 from '../models/OHP_OP8_Mappings.js';
import enumMappingsETI_807 from '../models/ETI_807_Mappings.js';
import enumMappingsETI_91 from '../models/ETI_91_Mappings.js';
import enumMappingsETI_9000INVL from '../models/ETI_9000INVL_Mappings.js';
import enumMappingsETI_OP48E from '../models/ETI_OP48E_Mappings.js';
import enumMappingsETO_2100 from '../models/ETO_2100_Mappings.js';
import enumMappingsETO_9000E from '../models/ETO_9000E_Mappings.js';
import enumMappingsETO_OP48E from '../models/ETO_OP48E_Mappings.js';
import enumMappingsIFT_IFTL from '../models/IFT_IFTL_Mappings.js';
import enumMappingsIFT_OP4OE from '../models/IFT_OP4OE_Mappings.js';

export const productTypeToImported = {
    FGCO: fgco_Mapping,
    FGLM: fglm_Mapping,
    CC5_CL: enumMappingsCC5_CL,
    CC5_OP4OE: enumMappingsCC5_OP4OE,
    COE_CDL: enumMappingsCOE_CDL,
    COE_CEL: enumMappingsCOE_CEL,
    COE_OP4OE: enumMappingsCOE_OP4OE,
    FT_FTL: enumMappingsFT_FTL,
    FT_OP4OE: enumMappingsFT_OP4OE,
    FT_OPCO: enumMappingsFT_OPCO,
    IBR_OP4OE: enumMappingsIBR_OP4OE,
    IBR_RFC: enumMappingsIBR_RFC,
    OHP_001: enumMappingsOHP_001,
    OHP_2100I: enumMappingsOHP_2100I,
    OHP_9000I: enumMappingsOHP_9000I,
    OHP_CBS: enumMappingsOHP_CBS,
    OHP_CDL: enumMappingsOHP_CDL,
    OHP_ES: enumMappingsOHP_ES,
    OHP_OEB: enumMappingsOHP_OEB,
    OHP_YCB: enumMappingsOHP_YCB,
    OHP_PMM: enumMappingsOHP_PMM,
    OHP_OP55: enumMappingsOHP_OP55,
    OHP_OP8NP: enumMappingsOHP_OP8NP,
    OHP_OP13: enumMappingsOHP_OP13,
    OHP_PML: enumMappingsOHP_PML,
    OHP_OP8: enumMappingsOHP_OP8,
    ETI_807: enumMappingsETI_807,
    ETI_91: enumMappingsETI_91,
    ETI_9000INVL: enumMappingsETI_9000INVL,
    ETI_OP48E: enumMappingsETI_OP48E,
    ETO_2100: enumMappingsETO_2100,
    ETO_9000E: enumMappingsETO_9000E,
    ETO_OP48E: enumMappingsETO_OP48E,
    IFT_IFTL: enumMappingsIFT_IFTL,
    IFT_OP4OE: enumMappingsIFT_OP4OE,
    // IFT_OPCO: enumMappingsIFT_OPCO,
};

// Optional globals if you include mapping scripts via <script> tags in public/index.html
// Update names to match actual global variable identifiers defined by those scripts
// Removed legacy global variable lookup

function isLeafMappingObject(obj) {
    if (!obj || typeof obj !== 'object') return false;
    const values = Object.values(obj);
    if (values.length === 0) return false;
    return values.every(v => v !== null && typeof v !== 'object');
}

export function flattenMappingKeys(mappingObject, parentKey = '') {
    const collected = [];
    if (!mappingObject || typeof mappingObject !== 'object') return collected;
    for (const key of Object.keys(mappingObject)) {
        const value = mappingObject[key];
        const path = parentKey ? `${parentKey}.${key}` : key;
        if (isLeafMappingObject(value)) {
            collected.push(path);
        } else if (value && typeof value === 'object') {
            collected.push(...flattenMappingKeys(value, path));
        }
    }
    return collected;
}

//Unfinished
function collectPreferencesFromMapping(mappingObject, configObject, parentKey = '') {
    const items = [];
    if (!mappingObject || typeof mappingObject !== 'object') return items;
    for (const key of Object.keys(mappingObject)) {
        const value = mappingObject[key];
        const path = parentKey ? `${parentKey}.${key}` : key;
        if (isLeafMappingObject(value)) {
            const selectedIndex = configObject && Object.prototype.hasOwnProperty.call(configObject, key)
                ? configObject[key]
                : undefined;
            const label = typeof selectedIndex === 'number' ? (value[selectedIndex] || 'Undefined') : 'Undefined';
            items.push({ name: path, index: selectedIndex, label });
        } else if (value && typeof value === 'object') {
            items.push(...collectPreferencesFromMapping(value, configObject, path));
        }
    }
    return items;
}

// Removed fetch/dynamic path resolution to avoid CRA import constraints

export async function getMappingKeysForProductType(productType) {
    if (!productType) return [];
    // Prefer imported registry (authoritative, no network/parsing)
    const imported = productTypeToImported[productType];
    if (imported && typeof imported === 'object') {
        try { if (typeof window !== 'undefined') { window[productType] = imported; } } catch (e) {}
        console.log('[mappingRegistry] using imported mapping for', productType);
        const keys = flattenMappingKeys(imported);
        return { keys, candidates: ['[imported]'], successPath: '[imported]' };
    }
    // No global bindings
    console.warn('[mappingRegistry] No imported/global mapping found for', productType);
    return { keys: [], candidates: [], successPath: null };
}

// Get the full mapping object (not just keys). Will attempt the same resolution strategy.
export async function getMappingForProductType(productType) {
    const result = await getMappingKeysForProductType(productType);
    // If window[productType] was set during resolution, return it
    try {
        if (typeof window !== 'undefined' && window[productType] && typeof window[productType] === 'object') {
            console.log('[mappingRegistry] returning mapping object from window for', productType);
            return { mapping: window[productType], sourcePath: result.successPath, candidates: result.candidates };
        }
    } catch (e) {}
    return { mapping: null, sourcePath: result.successPath, candidates: result.candidates };
}

// Get preference list (variable -> chosen label) based on provided configuration object
export async function getPreferencesForProduct(productType, configurationObject) {
    if (!productType) return { items: [], sourcePath: null };
    // Prefer imported mapping
    const imported = productTypeToImported[productType];
    let mappingObject = imported;
    let sourcePath = '[imported]';
    if (!mappingObject) {
        console.warn('[mappingRegistry] No mapping object available for', productType, 'to build preferences');
        return { items: [], sourcePath: null };
    }
    const items = collectPreferencesFromMapping(mappingObject, configurationObject || {});
    return { items, sourcePath };
}

// Confirm module loaded
console.log('[mappingRegistry] module loaded');


