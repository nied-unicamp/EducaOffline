import { Pipe, PipeTransform } from "@angular/core";
import { Material } from "src/app/models/material.model";

@Pipe({ name: 'filterByFolderId' })
export class FilterByFolderIdPipe implements PipeTransform {
  transform(materials: Material[], folderId: number): Material[] {
    if (!materials || !folderId) {
      return materials;
    }
    return materials.filter(material => material.folder === folderId);
  }
}
