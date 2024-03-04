import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { ActionTemplates } from '../template.actions';
import { StateWithOffline } from '../template.state';
import { OfflineRequestType } from './offline.state';


interface OfflineSyncFeatureArgs<T extends StateWithOffline<T>> {
    name: string;
    stateSelector: MemoizedSelector<object, T, DefaultProjectorFn<T>>;
}

interface OfflineSyncRequestArgs<T extends StateWithOffline<T>> extends OfflineSyncFeatureArgs<T> {
    type: OfflineRequestType;
}

export const OfflineActions = {
    syncAll: ActionTemplates.validated.noArgs('[Offline] Sync all features'),

    syncNext: ActionTemplates.validated
        .withArgs<OfflineSyncFeatureArgs<any>, never>(`[ Offline / Feature ] Sync  feature`),
    syncRequestType: ActionTemplates.validated
        .withArgs<OfflineSyncRequestArgs<any>, never>(`[ Offline / Feature / Request ] Sync one request type `),
    basic: undefined
};

/**
 * TODO: WARN: probably updated and deleted should have all related metadata
 */
export const getOfflineActions = <MyEntity, MyIdType, MyGroupIdType>(entityName: string) => {
    return {
        created: ActionTemplates.arrayActions<MyIdType>(entityName + ' / Offline / Created'),
        requested: {
            ids: ActionTemplates.arrayActions<MyIdType>(entityName + ' / Offline / Requested / Ids'),
            groupIds: ActionTemplates.arrayActions<MyGroupIdType>(entityName + ' / Offline / Requested / GroupIds'),
        },
        updated: ActionTemplates.basicActions<MyEntity>(entityName + ' / Offline / Updated'),
        deleted: ActionTemplates.basicActions<MyEntity>(entityName + ' / Offline / Deleted')
    };
};
