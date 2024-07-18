"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../tools");
const formats_1 = require("../formats");
const types_1 = require("../types");
function assembleKeyValueString(self) {
    const mtiCheck = self.checkMTI();
    const validate = self.validateMessage();
    const state = self.rebuildExtensions();
    // expects array of 0s & 1s and data-json object
    if (mtiCheck && validate && state) {
        const bitmaps_127 = self.assembleBitMap_127();
        const bmpsHex = self.getBitMapHex_127_ext();
        let buff = Buffer.alloc(8, bmpsHex, 'hex');
        if (self.formats['127.1'] != undefined) {
            if (self.formats['127.1'].ContentType === 'an') {
                buff = Buffer.alloc(16, bmpsHex, 'ascii');
            }
        }
        const fieldkv = [];
        for (let i = 0; i < bitmaps_127.length; i++) {
            const field = '127.' + (Number(i) + 1);
            const subField = Number(i) + 1;
            if (bitmaps_127[i] === 1) {
                if (!self.Msg[field]) {
                    return tools_1.default.toErrorObject('Field ' + field + ' in bitmap but not in json');
                }
                const this_format = self.formats[field] || formats_1.default[field];
                if (this_format) {
                    const state = (0, types_1.default)(this_format, self.Msg[field], field);
                    if (state.error) {
                        return tools_1.default.toErrorObject('Message is invalid');
                    }
                    if (this_format.LenType === 'fixed') {
                        if (formats_1.default[field].ContentType === 'b') {
                            if (this_format.MaxLen === self.Msg[field].length) {
                                const size = this_format.MaxLen / 2;
                                fieldkv.push(`${subField}=${self.Msg[field]}`);
                            }
                            else {
                                return tools_1.default.toInvalidLengthErrorObject(field, self.Msg[field].length);
                            }
                        }
                        else {
                            if (this_format.MaxLen === self.Msg[field].length) {
                                fieldkv.push(`${subField}=${self.Msg[field]}`);
                            }
                            else {
                                return tools_1.default.toInvalidLengthErrorObject(field, self.Msg[field].length);
                            }
                        }
                    }
                    else {
                        const thisLen = tools_1.default.getLenType(this_format.LenType);
                        if (!this_format.MaxLen)
                            return tools_1.default.toErrorObject('max length not implemented for ' + this_format.LenType + field);
                        if (self.Msg[field] && self.Msg[field].length > this_format.MaxLen)
                            return tools_1.default.toInvalidLengthErrorObject(field, self.Msg[field].length);
                        if (thisLen === 0) {
                            return tools_1.default.toErrorObject('field' + field + ' has no field implementation');
                        }
                        else {
                            const actualLength = self.Msg[field].length;
                            const padCount = thisLen - actualLength.toString().length;
                            let lenIndicator = actualLength.toString();
                            for (let i = 0; i < padCount; i++)
                                lenIndicator = 0 + lenIndicator;
                            const thisBuff = Buffer.alloc(self.Msg[field].length + lenIndicator.length, lenIndicator + self.Msg[field]);
                            fieldkv.push(`${subField}=${self.Msg[field]}`);
                        }
                    }
                }
                else
                    return tools_1.default.toErrorObject('field ' + field + ' not implemented');
            }
        }
        if (self.embededProperties.exclude127Bitmap) {
            buff = Buffer.alloc(0);
        }
        const dataString = fieldkv.join('; ');
        const dataLength = dataString.length;
        buff = Buffer.concat([buff, Buffer.alloc(dataLength, dataString)]);
        const padCount = tools_1.default.getLenType(formats_1.default['127'].LenType);
        let actualLen = buff.byteLength.toString();
        const x = padCount - actualLen.length;
        for (let i = 0; i < x; i++)
            actualLen = '0' + actualLen;
        const lenBuff = Buffer.alloc(actualLen.length, actualLen);
        return Buffer.concat([lenBuff, buff]);
    }
    else
        return tools_1.default.toErrorObject('Invalid Message in 127 extensions');
}
/**
 * Assemble fields 127.0-63 into ISO 8583 encoded string
 * @method assemble0_127_extensions
 * @memberof module:Message-Package
 */
function default_1() {
    if (this.embededProperties.field_127_25_key_value_string) {
        const buff = assembleKeyValueString(this);
        return buff;
    }
    const mtiCheck = this.checkMTI();
    const validate = this.validateMessage(this.Msg);
    const state = this.rebuildExtensions();
    // expects array of 0s & 1s and data-json object
    if (mtiCheck && validate && state) {
        const bitmaps_127 = this.assembleBitMap_127();
        const bmpsHex = this.getBitMapHex_127_ext();
        let buff = Buffer.alloc(8, bmpsHex, 'hex');
        for (let i = 0; i < bitmaps_127.length; i++) {
            const field = '127.' + (Number(i) + 1);
            if (bitmaps_127[i] === 1) {
                if (field === '127.25') {
                    const _25_buff = this.assemble127_25_extensions();
                    if (!_25_buff.error) {
                        if (_25_buff.byteLength > 12) {
                            buff = Buffer.concat([buff, _25_buff]);
                            continue;
                        }
                        else {
                            continue;
                        }
                    }
                }
                if (!this.Msg[field]) {
                    return tools_1.default.toErrorObject('Field ' + field + ' in bitmap but not in json');
                }
                const this_format = this.formats[field] || formats_1.default[field];
                if (this_format) {
                    const state = (0, types_1.default)(this_format, this.Msg[field], field);
                    if (state.error) {
                        return tools_1.default.toErrorObject('Message is invalid');
                    }
                    if (this_format.LenType === 'fixed') {
                        if (formats_1.default[field].ContentType === 'b') {
                            if (this_format.MaxLen === this.Msg[field].length) {
                                const size = this_format.MaxLen / 2;
                                const thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                                buff = Buffer.concat([buff, thisBuff]);
                            }
                            else {
                                return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                            }
                        }
                        else {
                            if (this_format.MaxLen === this.Msg[field].length) {
                                const thisBuff = Buffer.alloc(this.Msg[field].length, this.Msg[field]);
                                buff = Buffer.concat([buff, thisBuff]);
                            }
                            else {
                                return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                            }
                        }
                    }
                    else {
                        const thisLen = tools_1.default.getLenType(this_format.LenType);
                        if (!this_format.MaxLen)
                            return tools_1.default.toErrorObject('max length not implemented for ' + this_format.LenType + field);
                        if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
                            return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                        if (thisLen === 0) {
                            return tools_1.default.toErrorObject('field' + field + ' has no field implementation');
                        }
                        else {
                            const actualLength = this.Msg[field].length;
                            const padCount = thisLen - actualLength.toString().length;
                            let lenIndicator = actualLength.toString();
                            for (let i = 0; i < padCount; i++)
                                lenIndicator = 0 + lenIndicator;
                            const thisBuff = Buffer.alloc(this.Msg[field].length + lenIndicator.length, lenIndicator + this.Msg[field]);
                            buff = Buffer.concat([buff, thisBuff]);
                        }
                    }
                }
                else
                    return tools_1.default.toErrorObject('field ' + field + ' not implemented');
            }
        }
        const padCount = tools_1.default.getLenType(formats_1.default['127'].LenType);
        let actualLen = buff.byteLength.toString();
        const x = padCount - actualLen.length;
        for (let i = 0; i < x; i++)
            actualLen = '0' + actualLen;
        const bitmapBuff = buff.slice(0, 8);
        const lenBuff = Buffer.alloc(actualLen.length, actualLen);
        const dataBuff = buff.slice(8, buff.byteLength);
        return Buffer.concat([lenBuff, bitmapBuff, dataBuff]);
    }
    else
        return tools_1.default.toErrorObject('Invalid Message in 127 extensions');
}
exports.default = default_1;
