export abstract class ModelComponent {
    _type: string;

    constructor () {
        this._type = this.constructor.name
    }
}
