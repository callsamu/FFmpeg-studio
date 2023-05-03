import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Router, RouterModule } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from 'src/storage.service';
import { ArgsService } from '../args.service';
import { EditorEventType } from '../editor-event';
import { EditorStatesService } from '../editor-states.service';
import { FFmpegService } from '../ffmpeg.service';

import { EditorComponent } from './editor.component';

@Component({selector: 'app-code-editor', template: ''})
class CodeEditorComponent {}

@Component({selector: 'app-message', template: ''})
class MessageComponent {}

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  let argumentSpy: jasmine.SpyObj<ArgsService>;
  let editorStateSpy: jasmine.SpyObj<EditorStatesService>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let ffmpegSpy: jasmine.SpyObj<FFmpegService>;

  beforeEach(async () => {
    editorStateSpy = jasmine.createSpyObj('EditorStatesService', {
      openBuffers: [],
      delete: undefined,
    });

    storageSpy = jasmine.createSpyObj('StorageService', {
      fetch: "ffmpeg",
      save: undefined,
    });


    const route = {snapshot: {params: {name: "foobar"}}};

    dialogSpy = jasmine.createSpyObj('MatDialog', {
      open: {
        afterClosed(): Observable<string> {
          return new BehaviorSubject("name").asObservable();
        }
      }
    })

    argumentSpy = jasmine.createSpyObj('ArgsService', ['addFile', 'setArgs']);
    ffmpegSpy = jasmine.createSpyObj('FFmpegService', ['load']);

    await TestBed.configureTestingModule({
      declarations: [
        EditorComponent,
        CodeEditorComponent,
        MessageComponent,
      ],
      imports: [
        RouterModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        provideRouter([{path: 'command', component: EditorComponent}]),
        provideAnimations(),
        { provide: ArgsService, useValue: argumentSpy },
        { provide: ActivatedRoute, useValue: route},
        { provide: MatDialog, useValue: dialogSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: EditorStatesService, useValue: editorStateSpy },
        { provide: FFmpegService, useValue: ffmpegSpy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init with command name provided', () => {
    it('should call storage and retrieve command from its name', () => {
      expect(storageSpy.fetch).toHaveBeenCalledOnceWith("foobar");
      expect(component.command).toBe("ffmpeg");
    });

    it("should have a tab named 'foobar'", () => {
      expect(component.tabs.size).toBe(1);
      expect(component.tabs.has('foobar')).toBeTrue();
    });
  });

  it('should be able to add a new tab', () => {
    component.addTab('foobarxyz');
    expect(component.tabs.has('foobarxyz')).toBeTrue();

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const tabs = element.querySelectorAll('nav a');


    expect(tabs).toHaveSize(2);
  });

  describe('tab deletion', () => {
    it('should close tab and pick next to its left', fakeAsync(() => {
      ["foo", "bar"].forEach(name => component.addTab(name));

      const tabs = Array.from(component.tabs);
      console.log(tabs);

      component.closeTab(new MouseEvent(''), "foo");
      expect(component.tabs.size).toBe(2);
      tick();

      const want: (string | null)[] = ["foobar", "bar"];
      const remaining = Array.from(component.tabs);
      want.forEach((name, idx) => expect(name).toBe(remaining[idx]));

      expect(TestBed.inject(Router).url).toBe("/command;name=foobar");
    }));

    it('should close tab and pick next to its right if left is empty', fakeAsync(() => {
      ["foo", "bar"].forEach(name => component.addTab(name));

      const tabs = Array.from(component.tabs);
      console.log(tabs);

      component.closeTab(new MouseEvent(''), "foobar");
      expect(component.tabs.size).toBe(2);
      tick();

      const want: (string | null)[] = ["foo", "bar"];
      const remaining = Array.from(component.tabs);
      want.forEach((name, idx) => expect(name).toBe(remaining[idx]));

      expect(TestBed.inject(Router).url).toBe("/command;name=foo");
    }));
  });

  it('should send undo event', () => {
    component.eventsToEditor.subscribe(event => {
      expect(event.type).toBe(EditorEventType.undo);
    })
    component.undo();
  });

  describe('saving', () => {
    it('should only save if command name is not null', () => {
      component.commandName = "foo";
      component.save();

      expect(storageSpy.save).toHaveBeenCalledOnceWith("foo", "ffmpeg");
    });

    it('should open dialog if command name is null', () => {
      component.eventsToEditor.subscribe(event => {
        expect(event.type).toBe(EditorEventType.retrieval);
      });

      component.commandName = null;
      component.save();

      expect(storageSpy.save).toHaveBeenCalledOnceWith("name", "ffmpeg");
    });
  });

  describe('file uploading', () => {
    it('should pass files to args service and insert on editor', () => {
      const file = new File(["foo"], "foo.txt", {type: "text/plain"});

      component.eventsToEditor.subscribe(event => {
        expect(event.type).toBe(EditorEventType.insertion);
        expect(event.value).toBe("foo.txt");
      })

      component.uploadFile(file);

      expect(argumentSpy.addFile).toHaveBeenCalled();

      const gotFilename = argumentSpy.addFile.calls.first().args[0].name;
      expect(gotFilename).toBe("foo.txt");
    });

    it('should insert commas between the filename if it contains spaces', () => {
      const file = new File(["foo bar"], "foo bar.txt", {type: "text/plain"});
      component.uploadFile(file);

      expect(argumentSpy.addFile).toHaveBeenCalled();

      const gotFilename = argumentSpy.addFile.calls.first().args[0].name;
      expect(gotFilename).toBe(`"foo bar.txt"`);
    });
  });
});
