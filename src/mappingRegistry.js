// Frontend-only map from product code to a file path that contains the mapping object in the models folder.
// Fill these paths so they are accessible by the frontend (e.g., served from /public or a CDN).
import fgco_Mapping from './models/fgco_Mapping.js';
import fglm_Mapping from './models/fglm_Mapping.js';
import enumMappingsCC5_CL from './models/CC5_CL_Mappings.js';
import enumMappingsCC5_OP4OE from './models/CC5_OP4OE_Mappings.js';
import enumMappingsCOE_CDL from './models/COE_CDL_Mappings.js';
import enumMappingsCOE_CEL from './models/COE_CEL_Mappings.js';
import enumMappingsCOE_OP4OE from './models/COE_OP4OE_Mappings.js';
import enumMappingsFT_FTL from './models/FT_FTL_Mappings.js';
import enumMappingsFT_OP4OE from './models/FT_OP4OE_Mappings.js';
import enumMappingsFT_OPCO from './models/FT_OPCO_Mappings.js';
import enumMappingsIBR_OP4OE from './models/IBR_OP4OE_Mappings.js';
import enumMappingsIBR_RFC from './models/IBR_RFC_Mappings.js';
import enumMappingsOHP_001 from './models/OHP_001_Mappings.js';
import enumMappingsOHP_2100I from './models/OHP_2100I_Mappings.js';
import enumMappingsOHP_9000I from './models/OHP_9000I_Mappings.js';
import enumMappingsOHP_CBS from './models/OHP_CBS_Mappings.js';
import enumMappingsOHP_CDL from './models/OHP_CDL_Mappings.js';
import enumMappingsOHP_ES from './models/OHP_ES_Mappings.js';
import enumMappingsOHP_OEB from './models/OHP_OEB_Mappings.js';
import enumMappingsOHP_YCB from './models/OHP_YCB_Mappings.js';
import enumMappingsOHP_PMM from './models/OHP_PMM_Mappings.js';
import enumMappingsOHP_OP55 from './models/OHP_OP55_Mappings.js';
import enumMappingsOHP_OP8NP from './models/OHP_OP8NP_Mappings.js';
import enumMappingsOHP_OP13 from './models/OHP_OP13_Mappings.js';
import enumMappingsOHP_PML from './models/OHP_PML_Mappings.js';
import enumMappingsOHP_OP8 from './models/OHP_OP8_Mappings.js';
import enumMappingsETI_807 from './models/ETI_807_Mappings.js';
import enumMappingsETI_91 from './models/ETI_91_Mappings.js';
import enumMappingsETI_9000INVL from './models/ETI_9000INVL_Mappings.js';
import enumMappingsETI_OP48E from './models/ETI_OP48E_Mappings.js';
import enumMappingsETO_2100 from './models/ETO_2100_Mappings.js';
import enumMappingsETO_9000E from './models/ETO_9000E_Mappings.js';
import enumMappingsETO_OP48E from './models/ETO_OP48E_Mappings.js';
import enumMappingsIFT_IFTL from './models/IFT_IFTL_Mappings.js';
import enumMappingsIFT_OP4OE from './models/IFT_OP4OE_Mappings.js';
import enumMappingsCCO_139A from './models/CCO_139A_Mappings.js';
import enumMappingsCCO_900L from './models/CCO_900L_Mappings.js';
import enumMappingsCCO_ES from './models/CCO_ES_Mappings.js';
import enumMappingsCCO_OEB from './models/CCO_OEB_Mappings.js';

// Import extracted schemas
import { FGCOSchema } from './models/FGCO_Extracted.js';
import { FGLMSchema } from './models/FGLM_Extracted.js';
import { CC5_CLSchema } from './models/CC5_CL_Extracted.js';
import { CC5_OP4OE_Schema } from './models/CC5_OP4OE_Extracted.js';
import { CCO_139A_Schema } from './models/CCO_139A_Extracted.js';
import { CCO_ES_Schema } from './models/CCO_ES_Extracted.js';
import { CCO_OEB_Schema } from './models/CCO_OEB_Extracted.js';
import { OHP_CDLSchema } from './models/OHP_CDL_Extracted.js';
import { OHP_OP55Schema } from './models/OHP_OP55_Extracted.js';
import { COE_CEL_Schema } from './models/COE_CEL_Extracted.js';

// Function to extract schema objects from model files using dynamic import
async function extractSchemaFromFile(filePath) {
    try {
        // Use dynamic import to load the module
        const module = await import(filePath);
        
        // Look for the .obj export (JSON schema)
        const objExport = module[Object.keys(module).find(key => key.endsWith('obj'))];
        if (objExport) {
            return objExport;
        }
        
        // If no .obj export, try to access the schema property
        if (module.schema) {
            return module.schema;
        }
        
        console.warn(`No schema found in ${filePath}`);
        return null;
    } catch (error) {
        // If the import fails due to mongoose, try to extract from the .obj export directly
        if (error.message.includes('mongoose') || error.message.includes('Cannot find module')) {
            console.warn(`Module import failed for ${filePath}, trying alternative approach...`);
            
            // For now, return null - we'll need to handle this differently
            return null;
        }
        
        console.warn(`Could not extract schema from ${filePath}:`, error.message);
        return null;
    }
}

// Cache for extracted schemas
const schemaCache = new Map();

// Function to get schema for a product type
async function getSchemaForProductType(productType) {
    if (schemaCache.has(productType)) {
        return schemaCache.get(productType);
    }
    
    const filePath = `./src/models/${productType.toLowerCase()}.js`;
    const schema = await extractSchemaFromFile(filePath);
    
    if (schema) {
        schemaCache.set(productType, schema);
    }
    
    return schema;
}

// Dynamic schema extraction using a web worker or service worker approach
// Since we can't import the files directly, we'll use a different strategy

// Create a schema registry that can be populated dynamically
const schemaRegistry = new Map();

// Function to register schemas (can be called from build process or server)
export function registerSchema(productType, schemaObject) {
    schemaRegistry.set(productType, schemaObject);
}

// Function to get schema from registry
export function getSchemaFromRegistry(productType) {
    return schemaRegistry.get(productType) || null;
}

// For now, let's test with a dynamic approach using fetch to get the raw file content
// and parse it with a more robust regex
async function extractSchemaDynamically(productType) {
    try {
        // Try to fetch the raw file content
        const response = await fetch(`/src/models/${productType}.js`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${productType}.js`);
        }
        
        const fileContent = await response.text();
        
        // More robust regex to extract the schema object
        // This handles nested objects and functions better
        const schemaMatch = fileContent.match(/new\s+mongoose\.Schema\s*\(\s*(\{(?:[^{}]|{[^{}]*})*)\s*\)/s);
        
        if (!schemaMatch) {
            console.warn(`Could not extract schema from ${productType}.js`);
            return null;
        }
        
        const schemaText = schemaMatch[1];
        
        // Use Function constructor to safely evaluate the schema object
        const schemaFunction = new Function(`return ${schemaText}`);
        const schemaObject = schemaFunction();
        
        return schemaObject;
    } catch (error) {
        console.warn(`Error extracting schema for ${productType}:`, error.message);
        return null;
    }
}

// const FGLM_JS = require("./models/fglm.js");
// const CC5_CL_JS = require("./models/CC5_CL.js");
// const CC5_OP4OE_JS = require("./models/CC5_OP4OE.js");
// const CCO_139A_JS = require("./models/CCO_139A.js");
// const CCO_900L_JS = require("./models/CCO_900L.js");
// const CCO_ES_JS = require("./models/CCO_ES.js");
// const CCO_OEB_JS = require("./models/CCO_OEB.js");
// const COE_CDL_JS = require("./models/COE_CDL.js");
// const COE_CEL_JS = require("./models/COE_CEL.js");
// const COE_OP4OE_JS = require("./models/COE_OP4OE.js");
// const COE_OP52_JS = require("./models/COE_OP52.js");
// const ETI_807_JS = require("./models/ETI_807.js");
// const ETI_9000INVL_JS = require("./models/ETI_9000INVL.js");
// const ETI_91_JS = require("./models/ETI_91.js");
// const ETI_OP48E_JS = require("./models/ETI_OP48E.js");
// const ETO_2100_JS = require("./models/ETO_2100.js");
// const ETO_9000E_JS = require("./models/ETO_9000E.js");
// const ETO_OP48E_JS = require("./models/ETO_OP48E.js");
// const FC_314_JS = require("./models/FC_314.js");
// const FC_317_JS = require("./models/FC_317.js");
// const FC_TCG_JS = require("./models/FC_TCG.js");
// const FRO_314_JS = require("./models/FRO_314.js");
// const FRO_317_JS = require("./models/FRO_317.js");
// const FRO_9000F_JS = require("./models/FRO_9000F.js");
// const FRO_ES_JS = require("./models/FRO_ES.js");
// const FRO_OEB_JS = require("./models/FRO_OEB.js");
// const FRO_OP139A_JS = require("./models/FRO_OP139A.js");
// const FT_FTL_JS = require("./models/FT_FTL.js");
// const FT_OP4OE_JS = require("./models/FT_OP4OE.js");
// const FT_OPCO_JS = require("./models/FT_OPCO.js");
// const IBR_OP4OE_JS = require("./models/IBR_OP4OE.js");
// const IBR_RFC_JS = require("./models/IBR_RFC.js");
// const IFT_IFTL_JS = require("./models/IFT_IFTL.js");
// const IFT_OP4OE_JS = require("./models/IFT_OP4OE.js");
// const OHP_001_JS = require("./models/OHP_001.js");
// const OHP_2100I_JS = require("./models/OHP_2100I.js");
// const OHP_9000I_JS = require("./models/OHP_9000I.js");
// const OHP_CBS_JS = require("./models/OHP_CBS.js");
// const OHP_CDL_JS = require("./models/OHP_CDL.js");
// const OHP_ES_JS = require("./models/OHP_ES.js");
// const OHP_GPC_JS = require("./models/OHP_GPC.js");
// const OHP_MLP_JS = require("./models/OHP_MLP.js");
// const OHP_OEB_JS = require("./models/OHP_OEB.js");
// const OHP_OP13_JS = require("./models/OHP_OP13.js");
// const OHP_OP139A_JS = require("./models/OHP_OP139A.js");
// const OHP_OP4A_JS = require("./models/OHP_OP4A.js");
// const OHP_OP52_JS = require("./models/OHP_OP52.js");
// const OHP_OP55_JS = require("./models/OHP_OP55.js");
// const OHP_OP8_JS = require("./models/OHP_OP8.js");
// const OHP_OP8NP_JS = require("./models/OHP_OP8NP.js");
// const OHP_PML_JS = require("./models/OHP_PML.js");
// const OHP_PMM_JS = require("./models/OHP_PMM.js");
// const OHP_YCB_JS = require("./models/OHP_YCB.js");

export const productTypeToImported = {
    FGCO: { schema: FGCOSchema, mapping: fgco_Mapping },
    FGLM: { schema: FGLMSchema, mapping: fglm_Mapping },
    CC5_CL: { schema: CC5_CLSchema, mapping: enumMappingsCC5_CL },
    CC5_OP4OE: { schema: CC5_OP4OE_Schema, mapping: enumMappingsCC5_OP4OE },
    CCO_139A: { schema: CCO_139A_Schema, mapping: enumMappingsCCO_139A },
    CCO_900L: { schema: null, mapping: enumMappingsCCO_900L },
    CCO_ES: { schema: CCO_ES_Schema, mapping: enumMappingsCCO_ES },
    CCO_OEB: { schema: CCO_OEB_Schema, mapping: enumMappingsCCO_OEB },
    COE_CDL: { schema: null, mapping: enumMappingsCOE_CDL },
    COE_CEL: { schema: COE_CEL_Schema, mapping: enumMappingsCOE_CEL },
    COE_OP4OE: { schema: null, mapping: enumMappingsCOE_OP4OE },
    FT_FTL: { schema: null, mapping: enumMappingsFT_FTL },
    FT_OP4OE: { schema: null, mapping: enumMappingsFT_OP4OE },
    FT_OPCO: { schema: null, mapping: enumMappingsFT_OPCO },
    IBR_OP4OE: { schema: null, mapping: enumMappingsIBR_OP4OE },
    IBR_RFC: { schema: null, mapping: enumMappingsIBR_RFC },
    OHP_001: { schema: null, mapping: enumMappingsOHP_001 },
    OHP_2100I: { schema: null, mapping: enumMappingsOHP_2100I },
    OHP_9000I: { schema: null, mapping: enumMappingsOHP_9000I },
    OHP_CBS: { schema: null, mapping: enumMappingsOHP_CBS },
    OHP_CDL: { schema: OHP_CDLSchema, mapping: enumMappingsOHP_CDL },
    OHP_ES: { schema: null, mapping: enumMappingsOHP_ES },
    OHP_OEB: { schema: null, mapping: enumMappingsOHP_OEB },
    OHP_YCB: { schema: null, mapping: enumMappingsOHP_YCB },
    OHP_PMM: { schema: null, mapping: enumMappingsOHP_PMM },
    OHP_OP55: { schema: OHP_OP55Schema, mapping: enumMappingsOHP_OP55 },
    OHP_OP8NP: { schema: null, mapping: enumMappingsOHP_OP8NP },
    OHP_OP13: { schema: null, mapping: enumMappingsOHP_OP13 },
    OHP_PML: { schema: null, mapping: enumMappingsOHP_PML },
    OHP_OP8: { schema: null, mapping: enumMappingsOHP_OP8 },
    ETI_807: { schema: null, mapping: enumMappingsETI_807 },
    ETI_91: { schema: null, mapping: enumMappingsETI_91 },
    ETI_9000INVL: { schema: null, mapping: enumMappingsETI_9000INVL },
    ETI_OP48E: { schema: null, mapping: enumMappingsETI_OP48E },
    ETO_2100: { schema: null, mapping: enumMappingsETO_2100 },
    ETO_9000E: { schema: null, mapping: enumMappingsETO_9000E },
    ETO_OP48E: { schema: null, mapping: enumMappingsETO_OP48E },
    IFT_IFTL: { schema: null, mapping: enumMappingsIFT_IFTL },
    IFT_OP4OE: { schema: null, mapping: enumMappingsIFT_OP4OE },
    // IFT_OPCO: enumMappingsIFT_OPCO,
};

// Test the extracted schemas
(async () => {
    console.log("TEST");
    console.log("FGCO Schema:", productTypeToImported.FGCO.schema);
    console.log("CC5_CL Schema:", productTypeToImported.CC5_CL.schema);
    console.log("CC5_OP4OE Schema:", productTypeToImported.CC5_OP4OE.schema);
    console.log("CCO_139A Schema:", productTypeToImported.CCO_139A.schema);
    console.log("CCO_ES Schema:", productTypeToImported.CCO_ES.schema);
    console.log("CCO_OEB Schema:", productTypeToImported.CCO_OEB.schema);
    console.log("OHP_CDL Schema:", productTypeToImported.OHP_CDL.schema);
    console.log("COE_CEL Schema:", productTypeToImported.COE_CEL.schema);
})();

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

function collectPreferencesFromMapping(mappingObject, configObject, parentKey = '') {
    const items = [];
    if (!mappingObject || typeof mappingObject !== 'object') return items;

    const localConfig = (configObject && typeof configObject === 'object') ? configObject : {};

    const toNumericIndex = (raw) => {
        if (raw == null) return undefined;
        if (typeof raw === 'object' && raw.$numberInt) {
            const n = parseInt(raw.$numberInt, 10);
            return Number.isFinite(n) ? n : undefined;
        }
        if (typeof raw === 'number') return raw;
        const n = parseInt(String(raw), 10);
        return Number.isFinite(n) ? n : undefined;
    };

    for (const key of Object.keys(mappingObject)) {
        const value = mappingObject[key];
        const path = parentKey ? `${parentKey}.${key}` : key;

        if (isLeafMappingObject(value)) {
            let selectedIndex = undefined;
            let label = 'Undefined';

            if (Object.prototype.hasOwnProperty.call(localConfig, key)) {
                selectedIndex = localConfig[key];
                const numericIndex = toNumericIndex(selectedIndex);

                if (Array.isArray(value)) {
                    if (typeof numericIndex === 'number') {
                        const zeroBased = (numericIndex >= 0 && numericIndex < value.length)
                            ? numericIndex
                            : numericIndex - 1;
                        if (zeroBased >= 0 && zeroBased < value.length) {
                            label = value[zeroBased];
                        }
                    }
                } else if (value && typeof value === 'object') {
                    if (Object.prototype.hasOwnProperty.call(value, numericIndex)) {
                        label = value[numericIndex];
                    } else if (Object.prototype.hasOwnProperty.call(value, String(numericIndex))) {
                        label = value[String(numericIndex)];
                    } else if (Object.prototype.hasOwnProperty.call(value, selectedIndex)) {
                        label = value[selectedIndex];
                    }
                }
            }

            items.push({ name: path, index: selectedIndex, label });
        } else if (value && typeof value === 'object') {
            const nextConfig = (localConfig && typeof localConfig[key] === 'object') ? localConfig[key] : undefined;
            items.push(...collectPreferencesFromMapping(value, nextConfig, path));
        }
    }
    return items;
}

export async function getMappingKeysForProductType(productType) {
    if (!productType) return [];
    const imported = productTypeToImported[productType];
    if (imported && typeof imported === 'object') {
        try { if (typeof window !== 'undefined') { window[productType] = imported; } } catch (e) {}
        const keys = flattenMappingKeys(imported);
        return { keys, candidates: ['[imported]'], successPath: '[imported]' };
    }
    console.warn('[mappingRegistry] No imported/global mapping found for', productType);
    return { keys: [], candidates: [], successPath: null };
}

export async function getMappingForProductType(productType) {
    const result = await getMappingKeysForProductType(productType);
    try {
        if (typeof window !== 'undefined' && window[productType] && typeof window[productType] === 'object') {
            return { mapping: window[productType], sourcePath: result.successPath, candidates: result.candidates };
        }
    } catch (e) {}
    return { mapping: null, sourcePath: result.successPath, candidates: result.candidates };
}

export async function getPreferencesForProduct(productType, configurationObject) {
    if (!productType) return { items: [], sourcePath: null };
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

// New function to get enhanced order details with schema-based enum resolution
export async function getEnhancedOrderDetails(productType, userData) {
    if (!productType || !userData) return { items: [], sourcePath: null };
    
    const imported = productTypeToImported[productType];
    if (!imported || !imported.schema || !imported.mapping) {
        console.warn('[mappingRegistry] No schema or mapping available for', productType);
        return { items: [], sourcePath: null };
    }
    
    const schema = imported.schema;
    const mapping = imported.mapping;
    const items = [];
    
    // Loop through ALL schema fields
    for (const [fieldName, fieldConfig] of Object.entries(schema)) {
        if (!fieldConfig || typeof fieldConfig !== 'object') continue;
        
        const fieldType = fieldConfig.type;
        const isEnum = fieldConfig.enum && Array.isArray(fieldConfig.enum);
        const isRequired = fieldConfig.required;
        
        // Get the user's value for this field
        const userValue = userData[fieldName];
        
        let displayValue = 'undefined';
        let displayLabel = fieldName;
        let originalValue = userValue;
        
        // Only process if we have a value and it's not a complex object
        if (userValue !== undefined && userValue !== null && typeof userValue !== 'object') {
            displayValue = userValue;
            
            // If it's an enum field, resolve the display value
            if (isEnum && mapping[fieldName]) {
                const enumMapping = mapping[fieldName];
                const numericValue = parseInt(userValue, 10);
                
                if (enumMapping[numericValue]) {
                    displayValue = enumMapping[numericValue];
                } else if (enumMapping[String(numericValue)]) {
                    displayValue = enumMapping[String(numericValue)];
                }
            }
        }
        
        // Convert field name to human-readable label
        displayLabel = fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
        
        items.push({
            name: fieldName,
            label: displayLabel,
            value: displayValue,
            originalValue: originalValue,
            type: fieldType,
            isEnum: isEnum,
            required: isRequired
        });
    }
    
    return { items, sourcePath: '[enhanced]' };
}


