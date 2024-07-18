"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const SpT = require('./specialFields/tools');
const maskPan = require('./maskPan');
const toSafeLog = require('./safeToLog');
/**
 * Set of methods for unpacking TCP message encoded in ISO 8583 format. Members of Main Class
 * @module Message-UnPackage
 */
const unpack_0_127 = require('./unpack/unpack_0_127');
const unpack_127_1_63 = require('./unpack/unpack_127_1_63');
const unpack_127_25_1_63 = require('./unpack/unpack_127_25_1_63');
/**
 * Set of methods for assembling the bitmaps for message field 0-127, 127.0-63, 127.25.0-39. Members of Main Class
 * @module Bitmap-Assemble
 */
const assembleBitMap = require('./bitmap/assembleBitMap');
const assembleBitMap_127 = require('./bitmap/assembleBitMap_127');
const assembleBitMap_127_25 = require('./bitmap/assembleBitMap_127_25');
/**
 * Set of methods for packing JSON message into a Buffer message. Members of Main Class
 * @module Message-Package
 */
const assemble0_127_Fields = require('./pack/assemble0_127_Fields');
const assemble127_extensions = require('./pack/assemble127_extensions');
const assemble127_25_extensions = require('./pack/assemble127_25_extensions');
/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
class Main {
    constructor(message, customFormats, requiredFieldsSchema) {
        this.MsgType = null;
        this.BufferMsg = null;
        this.Msg = null;
        this.metaData = {};
        if (Buffer.isBuffer(message)) {
            this.BufferMsg = message;
        }
        else {
            this.MsgType = message[0];
            this.Msg = message;
        }
        this.formats = customFormats || {};
        this.hasSpecialFields = SpT.detectSpecial(this.Msg, this.formats);
        this.bitmaps = null;
        this.fields = {};
        this.requiredFieldsSchema = requiredFieldsSchema;
        this.maskPan = maskPan.bind(this);
        this.toSafeLog = toSafeLog.bind(this);
        this.assembleBitMap = assembleBitMap.bind(this);
        this.assembleBitMap_127 = assembleBitMap_127.bind(this);
        this.assembleBitMap_127_25 = assembleBitMap_127_25.bind(this);
        this.unpack_0_127 = unpack_0_127.bind(this);
        this.unpack_127_1_63 = unpack_127_1_63.bind(this);
        this.unpack_127_25_1_63 = unpack_127_25_1_63.bind(this);
        this.assemble0_127_Fields = assemble0_127_Fields.bind(this);
        this.assemble127_extensions = assemble127_extensions.bind(this);
        this.assemble127_25_extensions = assemble127_25_extensions.bind(this);
        this.includesSecondaryBitmap = false;
    }
}
exports.Main = Main;
