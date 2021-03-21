import { Rest, Hub, HubEvent, HubSelector, HubValidator, HubValidatorSelector, HubEventData, HubEventSelection, HubEventSelectionData, HubEventValidation, HubEventValidationData, HubEventValidationSelection, HubEventValidationSelectionData } from '../wslib'
import { AnyData, User } from '../models'
import { ContractBase } from '@/lib/contracts'

export class CredentialContract extends ContractBase {
    public readonly service = 'credentialContract';
    public readonly isAuth = false;
    public readonly roles = []

    @Hub()
    onUpdate = new HubEvent();

    @Hub()
    onUpdateData = new HubEventData<AnyData>();

    @HubSelector<CredentialContract, User, string>( {
        select: async ( instance, user, selector ) => {
            instance.logger.log( 'onUpdateSelection.select( selector: ${selector})' )
            return true
            // return false
        },
    } )
    onUpdateSelection = new HubEventSelection<string>();

    @HubSelector<CredentialContract, User, string>( {
        select: async ( instance, user, selector ) => {
            instance.logger.log( 'onUpdateSelectionData.select( selector: ${selector})' )
            return true
            // return false
        },
    } )
    onUpdateSelectionData = new HubEventSelectionData<string, AnyData>();

    @HubValidator<CredentialContract, User, number>( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( `onUpdateValidation.validate(validator: ${validator})` )
            return true
            // return false
            // throw new Error('NOT !!!!')
        },
    } )
    onUpdateValidation = new HubEventValidation<number>();

    @HubValidator<CredentialContract, User, number>( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( `onUpdateValidationData.validate(validator: ${validator})` )
            return true
            // return false
            // throw new Error('NOT !!!!')
        },
    } )
    onUpdateValidationData = new HubEventValidationData<number, AnyData>();

    @HubValidatorSelector<CredentialContract, User, number, string[], string>( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( `onUpdateValidationSelection.validate(validator: ${validator})` )
            return ['my selector', 'b']
            // return true
            // return false
            // throw new Error('NOT !!!!')
        },
        select: async ( instance, user, validationResult, selector ) => {
            instance.logger.log( `onUpdateValidationSelection.select(validationResult: ${validationResult}, selector: ${selector}...)` )
            return validationResult.indexOf( selector ) > -1
            // return true
            // return false
            // throw new Error('NOT !!!!')
        },
    } )
    onUpdateValidationSelection = new HubEventValidationSelection<number, string>();

    @HubValidatorSelector<CredentialContract, User, number, string[], string>( {
        validate: async ( instance, user, validator ) => {
            instance.logger.log( `onUpdateValidationSelectionData.validate(validator: ${validator})` )
            return ['my selector', 'b']
            // return true
            // return false
            // throw new Error('NOT !!!!')
        },
        select: async ( instance, user, validationResult, selector ) => {
            instance.logger.log( `onUpdateValidationSelectionData.select(validationResult: ${validationResult}, selector: ${selector}...)` )
            return validationResult.indexOf( selector ) > -1
            // return true
            // return false
            // throw new Error('NOT !!!!')
        },
    } )
    onUpdateValidationSelectionData = new HubEventValidationSelectionData<number, string, AnyData>();

    @Rest()
    print (): void {
        this.logger.log( 'print()' )
    }

    @Rest()
    notify (): void {
        this.logger.log( 'notify()' )
        const data = { a: 'hello', b: true } as AnyData
        this.onUpdate.emit()
        this.onUpdateData.emit( data )
        this.onUpdateSelection.emit( 'selector' )
        this.onUpdateSelectionData.emit( 'selector', data )
        this.onUpdateValidation.emit()
        this.onUpdateValidationData.emit( data )
        this.onUpdateValidationSelection.emit( 'my selector' )
        this.onUpdateValidationSelectionData.emit( 'my selector', data )
    }
}