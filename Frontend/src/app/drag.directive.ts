import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { FileHandle } from './_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files:EventEmitter<FileHandle>=new EventEmitter();

@HostListener("style.backgraound") private background="#eee";

  constructor(private sanitizer:DomSanitizer) { }


  @HostListener("dragover",["$event"])
public onDragOver(evt:DragEvent){
 evt.preventDefault();
 evt.stopPropagation();
 this.background="#999";

}
@HostListener("dragleave",)
 public onDragLeave(evt:DragEvent){
  evt.preventDefault();
  evt.stopPropagation();
  this.background="#eee";
 }

 @HostListener("drop",["$event"])
 public onDrop(evt:DragEvent){
  evt.preventDefault();
  evt.stopPropagation();
  this.background="#eee";

  let fileHandle: FileHandle;

   const file:any=evt.dataTransfer?.files[0];
   //const file =evt.dataTransfer.files[0];
    const url =this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));

    fileHandle={file,url};
    this.files.emit(fileHandle);

 }
}

