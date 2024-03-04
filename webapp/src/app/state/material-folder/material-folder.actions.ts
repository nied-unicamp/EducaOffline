import { MaterialFolderForm, MaterialFolderJson, MaterialFolderSM } from 'src/app/models/material-folder.model'
import { ActionTemplates } from '../shared/template.actions';
import { MaterialFolderState } from './material-folder.state';
import { MaterialFolderOfflineActions } from './offline/material-folder.offline.actions';


export const MaterialFolderActions = {
  keyLoaded: ActionTemplates.keyLoaded<MaterialFolderState>('MaterialFolder'),

  fetchAll: ActionTemplates.validated.withArgs<{ courseId: number }, MaterialFolderJson[]>('[ MaterialFolder / API ] Load all folders from a course'),

  create: ActionTemplates.validated.withArgs<{ body: MaterialFolderForm, courseId: number }, MaterialFolderJson>('[ MaterialFolder / API ] Create a folder'),

  edit: ActionTemplates.validated.withArgs<{ body: MaterialFolderForm, folderId: number, courseId: number }, MaterialFolderJson>('[ MaterialFolder / API ] Edit folder'),

  delete: ActionTemplates.validated.withArgs<{ folderId: number, courseId: number }, void>('[ MaterialFolder / API ] Delete a folder'),

  offline: MaterialFolderOfflineActions,
  basic: ActionTemplates.basicActions<MaterialFolderSM>('MaterialFolder'),
};
