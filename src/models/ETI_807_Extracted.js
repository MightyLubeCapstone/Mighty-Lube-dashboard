const ETI_807_Schema = {
    conveyorName: {
        type: String,
        required: true,
    },
    industrialChainManufacturer: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    otherIndustrialChainManufacturer: {
        type: String,
        required: function () {
            return this.industrialChainManufacturer === 5;
        },
    },
    conveyorLength: {

        type: Number,
        required: false,
    },
    conveyorLengthUnit: { 
        type: Number,
        enum: [1, 2, 3, 4],
        required: false,

    }
};