export const enum OfflineRequestType {
    Created, Requested, Updated, Deleted, GradeReleased, None
}

export const getArrayAdapter = <T extends number | string>() => {
    return {
        addOne: (entity: T, state: T[]) => {
            if (state.indexOf(entity) >= 0) {
                return state;
            }
            return [entity, ...state];
        },
        addMany: (entities: T[], state: T[]) => {
            const newItems = entities.filter(item => !state.includes(item));

            return [...newItems, ...state];
        },
        addAll: (entities: T[], state: T[]) => {
            return [...entities];
        },
        removeOne: (entity: T, state: T[]) => {
            return [...state].filter(item => item !== entity);
        },
        removeMany: (entities: T[], state: T[]) => {
            return [...state].filter(item => !entities.includes(item));
        },
        removeAll: (state: T[]) => {
            return [];
        },
        initialState: () => [] as T[]
    };
};
