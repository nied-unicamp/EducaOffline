import { createSelector } from "@ngrx/store";
import { fromStringToDate } from "src/app/models";
import { Course, CourseFilesState, CourseSM } from "src/app/models/course.model";
import { FileState, FileUploaded } from "src/app/models/file-uploaded.model";
import { Selector } from "..";
import { MaterialAdvancedSelectors } from "../material/material.advanced.selector";
import { MaterialSelectors } from "../material/material.selector";
import { AppState } from "../state";


const selectAllMaterialFiles = (course: CourseSM) => {
  return (state: AppState) => MaterialAdvancedSelectors.sel.many(
    MaterialSelectors.byCourse.id.all(course?.id)
  )(state)
    .map(item => item?.files ?? []).reduce((a, b) => a.concat(b), [])
}

// TODO: Add activity files
const selectAllFiles = selectAllMaterialFiles;



const getFilesSizeSum = (files: FileUploaded[]) => files?.map(file => file?.byteSize ?? 0).reduce((a, b) => a + b, 0) ?? 0;

const getFilterFilesByState = (files: FileUploaded[], state: FileState) => files?.filter(file => file?.status?.currently === state) ?? [];

const getDownloadingSize = (files: FileUploaded[]) => getFilterFilesByState(files, FileState.IsDownloading).map(file => file.byteSize * file.status.progress).reduce((a, b) => a + b, 0)

const getUploadingSize = (files: FileUploaded[]) => getFilterFilesByState(files, FileState.IsUploading).map(file => file.byteSize * file.status.progress).reduce((a, b) => a + b, 0)

const getProgressSize = (files: FileUploaded[]) => getUploadingSize(files) + getDownloadingSize(files) + getFilesSizeSum(getFilterFilesByState(files, FileState.Downloaded));

const getProgress = (files: FileUploaded[]) => {
  const all = getFilesSizeSum(files);

  if (!all) {
    return 1;
  }

  return getProgressSize(files) / all;
};


const convert: (sm: CourseSM, convertedFiles: FileUploaded[]) => Course =
  (sm: CourseSM, convertedFiles: FileUploaded[]) => {
    if (!sm) {
      return undefined;
    }

    const { offlineSync, startDate, endDate, subscriptionBegin, subscriptionEnd, ...rest } = sm;

    let filesState: CourseFilesState = CourseFilesState.NotPresentLocally

    const progress = getProgress(convertedFiles);

    // TODO: account for upload progress
    if (offlineSync?.enable) {
      if (progress > .99) {
        filesState = CourseFilesState.Downloaded;
      } else if (getProgressSize(convertedFiles) > 0) {
        filesState = CourseFilesState.IsDownloading;
      } else {
        filesState = CourseFilesState.NeedsToBeDownloaded;
      }
    }


    return !sm ? undefined : {
      ...rest,
      startDate: fromStringToDate(startDate),
      endDate: fromStringToDate(endDate),
      subscriptionBegin: fromStringToDate(subscriptionBegin),
      subscriptionEnd: fromStringToDate(subscriptionEnd),
      offlineSync: {
        enable: offlineSync?.enable ?? false,
        progress: progress,
        state: filesState
      }
    };
  }

const convertOne = (course: CourseSM) => createSelector(
  selectAllFiles(course),
  (files) => convert(course, files)
);

const convertMany = (courses: CourseSM[]) => createSelector(
  (state: AppState) => courses.map(course => convert(course, selectAllFiles(course)(state))),
  (items) => items
);

const convertOneSel = (selector: Selector<CourseSM>) => {
  return (state: AppState) => convertOne(selector(state))(state)
}

const convertManySel = (selector: Selector<CourseSM[]>) => {
  return (state: AppState) => convertMany(selector(state))(state)
}


export const CourseAdvancedSelectors = {
  sel: {
    one: convertOneSel,
    many: convertManySel,
  },
  convert: {
    one: convertOne,
    many: convertMany,
  }
}
