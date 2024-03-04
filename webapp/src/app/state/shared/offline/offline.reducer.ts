import { EntityAdapter } from '@ngrx/entity';
import { combineReducers } from '@ngrx/store';
import { arrayReducer, basicReducer } from '../template.reducers';
import { StateWithOffline } from '../template.state';


export const getOfflineReducer = <MyEntity, OuterState extends (EntityAdapter<MyEntity> & StateWithOffline<OuterState>)>
    (entityName: number, outerAdapter: EntityAdapter<MyEntity>) => {
    const reducers = {
        created: arrayReducer(entityName + ' / Offline / Created'),
        requested: combineReducers({
            ids: arrayReducer(entityName + ' / Offline / Requested / Ids'),
            groupIds: arrayReducer(entityName + ' / Offline / Requested / GroupIds'),
        }),
        updated: basicReducer(entityName + ' / Offline / Updated', outerAdapter),
        deleted: basicReducer(entityName + ' / Offline / Deleted', outerAdapter),
    };

    return combineReducers(reducers);
};

