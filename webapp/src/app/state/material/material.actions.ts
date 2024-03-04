import { MaterialForm, MaterialJson, MaterialSM } from 'src/app/models/material.model';
import { ActionTemplates } from '../shared/template.actions';
import { MaterialState } from './material.state';
import { MaterialOfflineActions } from './offline/material.offline.actions';
import { createAction, props } from '@ngrx/store';


export const MaterialActions = {
  keyLoaded: ActionTemplates.keyLoaded<MaterialState>('Material'),

  fetchAll: ActionTemplates.validated.withArgs<{ courseId: number }, MaterialJson[]>('[ Material / API ] Load all materials from a course'),
  fetchFolderMaterials: ActionTemplates.validated.withArgs<{ courseId: number, folderId: number }, MaterialJson[]>('[ Material / API ] Load all materials from folder of a course'),

  create: {
    files: ActionTemplates.validated.withArgs<{ files: File[], courseId: number, folderId: number }, MaterialJson[]>('[ Material / API ] Create a file'),
    link: ActionTemplates.validated.withArgs<{ body: MaterialForm, courseId: number, folderId: number }, MaterialJson>('[ Material / API ] Create a link'),
  },
  editLink: ActionTemplates.validated.withArgs<{ body: MaterialForm, materialId: number, courseId: number }, MaterialJson>('[ Material / API ] Edit material link'),
  changeMaterialFolder: ActionTemplates.validated.withArgs<{ courseId: number, materialId: number , folderId: number }, void>('[ Material / API ] Change the location (folder) of a Material'),

  updateFolderReferences: createAction('[ Material ] Update references of a folder that was created offline',
    props<{ oldFolderId: number, newFolderId: number }>()),

  delete: ActionTemplates.validated.withArgs<{ materialId: number, courseId: number }, void>('[ Material / API ] Delete a material'),

  offline: MaterialOfflineActions,
  basic: ActionTemplates.basicActions<MaterialSM>('Material'),
};
