import { ContractBase } from '@/lib/contracts'
import { AuthContract } from './auth.contract'
import { BaseContract } from './base.contract'
import { CredentialContract } from './credential.contract'
import { UsersContracts } from './users.contract'

export class Contracts {
    auth = new AuthContract();
    base = new BaseContract( );
    credential = new CredentialContract();
    users = new UsersContracts()

    constructor (){
        this.get().forEach( x => x.contracts = this )
    }

    get (): ContractBase[]{
        return [
            this.auth,
            this.base,
            this.credential,
            this.users,
        ]
    }
}

export default new Contracts()