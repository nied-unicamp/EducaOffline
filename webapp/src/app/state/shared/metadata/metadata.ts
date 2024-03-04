import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

export type IdType = number | string;

// export type InnerEntity<T> = T extends EntityState<infer S> ? S : never;
export type InnerIdType<T extends EntityState<any>> = T extends { ids: number[] } ? number : string;

export const enum MetadataType {
    Group,
    Item
}

//// Id precisa ser string pra garantir que vai funcionar com tudo =(
export interface Metadata<MyType = IdType> {
    id: MyType;
    type: MetadataType;
    lastUpdate: string;
}

export interface MetadataState<MyType = IdType> extends EntityState<Metadata<MyType>> { }

export const metadataAdapter = <T = IdType>() => createEntityAdapter<Metadata<T>>({
    selectId: (metadata: Metadata<T>) => `${metadata.type}/${metadata.id}`
});


export const MetadataSelectors = <T = number | string>
    (selectMetadataState: MemoizedSelector<any, MetadataState<T>, DefaultProjectorFn<MetadataState<T>>>) => {

    const {
        selectIds,
        selectEntities,
        selectAll,
        selectTotal,
    } = metadataAdapter<T>().getSelectors();

    const selectMetadataIds = createSelector(
        selectMetadataState,
        selectIds
    );
    const selectMetadataEntities = createSelector(
        selectMetadataState,
        selectEntities
    );
    const selectMetadataAll = createSelector(
        selectMetadataState,
        selectAll
    );
    const selectMetadataTotal = createSelector(
        selectMetadataState,
        selectTotal
    );

    const selectById = (id: string | number) => createSelector(
        selectMetadataEntities,
        (entities) => id ? entities[id] : null
    );

    return {
        byId: (id: T) => {
            return {
                item: selectById(`Item/${id}`),
                group: selectById(`Group/${id}`),
            };
        },
        ids: selectMetadataIds,
        entities: selectMetadataEntities,
        all: selectMetadataAll,
        total: selectMetadataTotal,
    };
};
