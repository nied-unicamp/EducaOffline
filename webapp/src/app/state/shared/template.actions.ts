import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { IdAndGroupId, IdStringAndGroupId } from './template.state';

const keyLoaded = <T>(entityName: string) => {
  return createAction(`[${entityName} / Sync] Load Success`, props<{ data: T }>());
};

const validationWithArgs = <Input, Output>(base: string) => {
  return {
    request:
      createAction(base, props<{ input: Input }>()),
    success:
      createAction(base + ' Success', props<{ input: Input; data: Output }>()),
    error:
      createAction(base + ' Error', props<{ input: Input; error: any }>()),
    offlineError:
      createAction(base + ' Offline Error', props<{ input: Input; error: any; info: any }>()),
  };
};

const validationWithoutArgs = <T>(base: string) => {
  return {
    request:
      createAction(base),
    success:
      createAction(base + ' Success', props<{ data: T }>()),
    error:
      createAction(base + ' Error', props<{ error: any }>()),
    offlineError:
      createAction(base + 'Offline Error', props<{ error: any; info: any }>()),
  };
};


const idAndGroup = (featureName: string) => {
  return {
    add: createAction(`[ ${featureName} / Basic ] Add one`, props<{ data: IdAndGroupId }>()),
    remove: createAction(`[ ${featureName} / Basic ] Remove one`, props<{ data: IdAndGroupId }>()),
  };
};

const idStringAndGroup = (featureName: string) => {
  return {
    add: createAction(`[ ${featureName} / Basic ] Add one`, props<{ data: IdStringAndGroupId }>()),
    remove: createAction(`[ ${featureName} / Basic ] Remove one`, props<{ data: IdStringAndGroupId }>()),
  };
};


const basicActions = <T, MyIdType extends number | string = number>(featureName: string) => {
  return {
    add: {
      all:
        createAction(`[ ${featureName} / Basic ] Add all`, props<{ data: T[] }>()),
      many:
        createAction(`[ ${featureName} / Basic ] Add many`, props<{ data: T[] }>()),
      one:
        createAction(`[ ${featureName} / Basic ] Add one`, props<{ data: T }>()),
    },
    upsert: {
      many:
        createAction(`[ ${featureName} / Basic ] Upsert many`, props<{ data: T[] }>()),
      one:
        createAction(`[ ${featureName} / Basic ] Upsert one`, props<{ data: T }>()),
    },
    update: {
      many:
        createAction(`[ ${featureName} / Basic ] Update many`, props<{ data: Update<T>[] }>()),
      one:
        createAction(`[ ${featureName} / Basic ] Update one`, props<{ data: Update<T> }>()),
    },
    remove: {
      all:
        createAction(`[ ${featureName} / Basic ] Remove all`),
      many:
        createAction(`[ ${featureName} / Basic ] Remove many`, props<{ data: MyIdType[] }>()),
      one:
        createAction(`[ ${featureName} / Basic ] Remove one`, props<{ data: MyIdType }>()),
    }
  };
};


const arrayActions = <T>(featureName: string) => {
  return {
    add: {
      all:
        createAction(`[ ${featureName} ] Add all to array`, props<{ data: T[] }>()),
      many:
        createAction(`[ ${featureName} ] Add many to array`, props<{ data: T[] }>()),
      one:
        createAction(`[ ${featureName} ] Add one to array`, props<{ data: T }>()),
    },
    remove: {
      all:
        createAction(`[ ${featureName} ] Remove all to array`),
      many:
        createAction(`[ ${featureName} ] Remove many to array`, props<{ data: T[] }>()),
      one:
        createAction(`[ ${featureName} ] Remove one to array`, props<{ data: T }>()),
    }
  };
};


export const ActionTemplates = {
  basicActions,
  keyLoaded,
  idAndGroup,
  idStringAndGroup,
  validated: {
    noArgs: validationWithoutArgs,
    withArgs: validationWithArgs
  },
  arrayActions
};
