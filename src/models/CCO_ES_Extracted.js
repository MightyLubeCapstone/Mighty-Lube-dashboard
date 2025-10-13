// Extracted schema for CCO_ES - browser-compatible version
export const CCO_ES_Schema = {
  conveyorName: {
    type: String,
    required: true,
  },
  chainSize: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  otherChainSize: {
    type: String,
    required: function () {
      return this.chainSize === 5;
    },
  },
  industrialChainManufacturer: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    required: true,
  },
  otherChainManufacturer: {
    type: String,
    required: function () {
      return this.industrialChainManufacturer === 9;
    },
  },
  wheelManufacturer: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    required: true,
  },
  otherWheelManufacturer: {
    type: String,
    required: function () {
      return this.wheelManufacturer === 10;
    },
  },
  conveyorLength: {
    type: Number,
    required: true,
  },
  conveyorLengthUnit: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  conveyorSpeed: {
    type: Number,
    required: true,
  },
  conveyorSpeedUnit: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  conveyorIndex: {
    type: Number,
    required: true,
  },
  travelDirection: {
    type: Number,
    enum: [1, 2],
    required: false,
  },
  appEnviroment: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7],
    required: true,
  },
  ovenStatus: {
    type: Number,
    enum: [1, 2],
    required: function () {
      return this.appEnviroment === 3;
    },
  },
  ovenTemp: {
    type: Number,
    required: function () {
      return this.appEnviroment === 3;
    },
  },
  otherAppEnviroment: {
    type: String,
    required: function () {
      return this.appEnviroment === 7;
    },
  },
  surroundingTemp: {
    type: Number,
    enum: [1, 2],
    required: false,
  },
  conveyorLoaded: {
    type: Number,
    enum: [1, 2],
    required: false,
  },
  conveyorSwing: {
    type: Number,
    enum: [1, 2],
    required: false,
  },
  strandStatus: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  openBearings: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  lubeStatus: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  pointsOfLube: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
    required: true,
  },
  m12Plugs: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  op201Controller: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  op201Order: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  operatingVoltSingle: {
    type: Number,
    required: true,
  },
  controlVoltSingle: {
    type: Number,
    required: true,
  },
  monitorData: {
    // templateA reference - would need to be defined separately
    type: Object,
    required: false,
  },
  addFreeCarrier: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  templateBData: {
    // templateB reference - would need to be defined separately
    type: Object,
    required: function () {
      return this.addFreeCarrier === 1 || this.addFreeCarrier === 3;
    },
  },
  templateCData: {
    // templateC reference - would need to be defined separately
    type: Object,
    required: function () {
      return this.addFreeCarrier === 2 || this.addFreeCarrier === 3;
    },
  },
  wheelsOnPowerChain: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  templateDData: {
    // templateD reference - would need to be defined separately
    type: Object,
    required: function () {
      return this.wheelsOnPowerChain === 1;
    },
  },
  templateFData: {
    // templateF reference - would need to be defined separately
    type: Object,
    required: false,
  },
};
