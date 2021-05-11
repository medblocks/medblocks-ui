import { property } from "lit-element";
import { event, EventEmitter } from "../../internal/decorators";
import EhrElement from "../EhrElement";

interface Quantity {
    magnitude?: number,
    unit?: string
}

/**Base Quantity element to extend other quantity elements from */
export default class QuantityElement extends EhrElement {
    @property({ type: Object }) data: Quantity | undefined;
    @event('mb-input') _mbInput: EventEmitter<Quantity>;
} 