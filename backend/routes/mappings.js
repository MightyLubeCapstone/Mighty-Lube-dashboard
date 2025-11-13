const express = require('express');
const router = express.Router();

// Load central mapping registry from root models directory
const mappingRegistry = require('../../src/models/mappings.js');

function isLeafMappingObject(obj) {
    if (!obj || typeof obj !== 'object') return false;
    const values = Object.values(obj);
    if (values.length === 0) return false;
    // A leaf mapping has primitive (string/number/boolean) values (usually strings)
    return values.every(v => v !== null && typeof v !== 'object');
}

function collectMappingKeys(mappingObject, parentKey = '') {
    const collected = [];
    if (!mappingObject || typeof mappingObject !== 'object') return collected;

    for (const key of Object.keys(mappingObject)) {
        const value = mappingObject[key];
        const path = parentKey ? `${parentKey}.${key}` : key;

        if (isLeafMappingObject(value)) {
            collected.push(path);
        } else if (value && typeof value === 'object') {
            collected.push(...collectMappingKeys(value, path));
        }
    }

    return collected;
}

router.get('/:productType/keys', (req, res) => {
    try {
        const { productType } = req.params;
        if (!productType) {
            return res.status(400).json({ error: 'productType is required' });
        }

        // Registry keys are like FGCO_Mapping, FGLM_Mapping, etc.
        const registryKeyExact = `${productType}_Mapping`;
        let mappingObject = mappingRegistry[registryKeyExact];

        if (!mappingObject) {
            // Fallback: try case-insensitive match on the base type + _Mapping suffix
            const foundEntry = Object.entries(mappingRegistry).find(([key]) => key.toLowerCase() === registryKeyExact.toLowerCase());
            mappingObject = foundEntry ? foundEntry[1] : null;
        }

        if (!mappingObject) {
            return res.status(404).json({ error: `No mapping found for product type ${productType}` });
        }

        const keys = collectMappingKeys(mappingObject);
        return res.status(200).json({ productType, keys });
    } catch (err) {
        console.error('Error in GET /:productType/keys', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;


