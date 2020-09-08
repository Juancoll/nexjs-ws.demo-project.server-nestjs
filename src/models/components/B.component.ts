import { ModelComponent } from '@/lib/db/models'

export class BComponent extends ModelComponent {
    constructor (
        public var1?: string,
        public var2?: number,
    ) {
        super()
    }
}
