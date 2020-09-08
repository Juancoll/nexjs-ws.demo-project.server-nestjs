import { ModelComponent } from '@/lib/db/models'

export class AComponent extends ModelComponent {
    constructor (
        public data1?: string,
        public data2?: number
    ) {
        super()
    }
}
