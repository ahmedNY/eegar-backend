export enum RentState {
    draft = 'draft',
    canceled = 'canceled',
    checkedIn = 'checkedIn',
    checkedOut = 'checkedOut',
}

export const transRoles = {
    [RentState.draft]: [RentState.canceled, RentState.checkedIn],
    [RentState.checkedIn]: [RentState.checkedOut],
    [RentState.checkedOut]: [],
    [RentState.canceled]: [],
}

export function canChangeState(currentState: RentState, nextState: RentState): boolean {
    return transRoles[currentState].includes(nextState);
}