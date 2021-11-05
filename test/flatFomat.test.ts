
import { expect } from '@open-wc/testing'
import { fromFlat, toFlat} from "../src/medblocks/form/plugins/openEHRFlat";

describe("from flat validation",()=>{
  it('should parse percentage-test1',()=>{
     const flat = fromFlat({ "ncd/pulse_oximetry/any_event:0/spo": 0.02,
      "ncd/pulse_oximetry/any_event:0/spo|numerator": 2.0,
      "ncd/pulse_oximetry/any_event:0/spo|denominator": 100.0,
      "ncd/pulse_oximetry/any_event:0/spo|type": 2,})
      expect(flat).to.eql({ "ncd/pulse_oximetry/any_event:0/spo": {_root: 0.02, numerator: 2, denominator: 100, type: 2 }})
  })
  it('should parse percentage-test2',()=>{
     const flat = fromFlat({ 
      "ncd/pulse_oximetry/any_event:0/spo|numerator": 2.0,
      "ncd/pulse_oximetry/any_event:0/spo|denominator": 100.0,
      "ncd/pulse_oximetry/any_event:0/spo|type": 2,
      "ncd/pulse_oximetry/any_event:0/spo": 0.02,})
      expect(flat).to.eql({ "ncd/pulse_oximetry/any_event:0/spo": {_root: 0.02, numerator: 2, denominator: 100, type: 2 }})
  })
})

describe("to flat validation test-1",()=>{
    it('should serialize percentage',()=>{
        const flat = toFlat({ "ncd/pulse_oximetry/any_event:0/spo": {_root: 0.02, numerator: 2, denominator: 100, type: 2 }})
        expect(flat).to.eql({ "ncd/pulse_oximetry/any_event:0/spo": 0.02,
        "ncd/pulse_oximetry/any_event:0/spo|numerator": 2.0,
        "ncd/pulse_oximetry/any_event:0/spo|denominator": 100.0,
        "ncd/pulse_oximetry/any_event:0/spo|type": 2,})
    })
})

