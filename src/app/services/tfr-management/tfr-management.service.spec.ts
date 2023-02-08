import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  AllocatedResourceTypeDTO,
  ClientDTO,
  Milestone,
  Project,
  ProjectBasicDetails,
  ProjectResourceDTO,
} from 'src/app/shared/interfaces';
import {
  DummyAllocatedResources,
  DummyProject,
} from 'src/app/types/dummy-data';
import { ApiService } from '../api/api.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';

import { TfrManagementService } from './tfr-management.service';

import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('Window');

xdescribe('TfrManagementService', () => {
  let service: TfrManagementService;
  let snackBarServiceSpy: jasmine.SpyObj<SnackBarService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let milestones: Milestone[];
  let projectResources: ProjectResourceDTO[];
  let projectResourcesWithNames: AllocatedResourceTypeDTO[];
  let project: Project;
  let clientName: string;
  let basicDetails: ProjectBasicDetails;
  let clients: ClientDTO[];
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of('true'),
    close: of('true'),
  });
  let windowMock = {
    location: {
      reload: jasmine.createSpy('reload'),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: SnackBarService,
          useValue: jasmine.createSpyObj('SnackBarService', ['showSnackBar']),
        },
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', [
            'getClients',
            'postProject',
            'putStatus',
            'putProject',
            'getProject',
            'postProjectResources',
          ]),
        },
        { provide: WINDOW, useValue: windowMock },
      ],
    });

    snackBarServiceSpy = TestBed.inject(
      SnackBarService
    ) as jasmine.SpyObj<SnackBarService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj
    );
    service = TestBed.inject(TfrManagementService);

    project = { ...DummyProject };
    milestones = project.milestones;
    projectResources = project.project_resources;

    basicDetails = (({
      name,
      start_date,
      end_date,
      client_id,
      client_specific,
      status,
    }) => ({ name, start_date, end_date, client_id, client_specific, status }))(
      project
    );

    clients = [
      {
        id: 1,
        name: 'JP Morgan',
      },
      {
        id: 2,
        name: 'Morgan Stanley',
      },
      {
        id: 3,
        name: 'HSBC',
      },
      {
        id: 4,
        name: 'BOA',
      },
      {
        id: 5,
        name: 'Santander',
      },
    ];

    projectResourcesWithNames = DummyAllocatedResources;

    service.project = project;

    apiServiceSpy.postProject.and.returnValue(of(1));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Project ID', () => {
    expect(service.getProjectId).toBe(1);
  });

  it('should get Project Name', () => {
    expect(service.getProjectName).toBe('Bench Project');
  });

  it('should get Milestones', () => {
    expect(service.getMilestones).toBe(milestones);
  });

  it('should get Project Resources with names', () => {
    service.projectResourcesWithNames = projectResourcesWithNames;

    expect(service.getProjectResourcesWithNames).toBe(
      projectResourcesWithNames
    );
  });

  it('should get the Project Resources', () => {
    expect(service.getProjectResources).toBe(projectResources);
  });

  it('should get Project', () => {
    expect(service.getProject).toBe(project);
  });

  it('should get Client Name', () => {
    clientName = 'Morgan Stanley';
    service.clientName = clientName;
    expect(service.getClientName).toBe(clientName);
  });

  it('should get Resources Count', () => {
    expect(service.getResourcesCount).toBe(4);
  });

  it('should set Project', () => {
    service.setProject(project);
    expect(service.project).toBe(project);
  });

  it('should get undefined Basic Details', () => {
    service.project = undefined;
    expect(service.getBasicDetails).toBe(undefined);
  });

  it('should get Basic Details', () => {
    service.project = project;
    expect(service.getBasicDetails).toEqual(basicDetails);
  });

  it('should compareBasicDetails - same object', () => {
    let result = service.compareBasicDetails(basicDetails);

    expect(service.project).toEqual(project);
    expect(service.getBasicDetails).toEqual(basicDetails);
    expect(result).toBe(true);
  });

  it('should set Basic Details - Project already defined', () => {
    apiServiceSpy.putProject.and.returnValue(of(1));
    apiServiceSpy.getClients.and.returnValue(of(clients));
    service.project = project;

    basicDetails.name = 'Portfolio Management Project';
    service.setBasicDetails(basicDetails, true);
    expect(service.project?.name).toBe(basicDetails.name);
  });

  it('should set Basic Details ', () => {
    service.project = project;
    expect(service.compareBasicDetails(basicDetails)).toBe(true);
    service.setBasicDetails(basicDetails, true).subscribe((response) => {
      expect(response).toBe(true);
    });
  });

  it('should update project to db - success', () => {
    apiServiceSpy.putProject.and.returnValue(of(1));
    service.project = project;
    service.updateProjectToDatabase();
    expect(service.project.version).toBe(1);
  });

  it('should update project to db - failure bad versioning', () => {
    let httpErrorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 412,
    });
    dialogRefSpyObj.afterClosed.and.returnValue(of('true'));
    spyOn(window.location, 'reload');

    service.updateProjectToDatabaseObserver.error(httpErrorResponse);
    expect(window.location.reload).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should update project to db - failure server error', () => {
    let httpErrorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 500,
    });

    service.updateProjectToDatabaseObserver.error(httpErrorResponse);

    expect(snackBarServiceSpy.showSnackBar).toHaveBeenCalledWith(
      'Save Unsuccessful. Server Error',
      4000
    );
  });

  it('should create project - error', () => {
    let httpErrorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 500,
    });

    service.createProjectObserver.error(httpErrorResponse);
    expect(snackBarServiceSpy.showSnackBar).toHaveBeenCalledWith(
      'Save Unsuccessful. Server Error',
      4000
    );
    service.subject.subscribe((response) => {
      expect(response).toBe(false);
    });
  });

  it('should make API call to create project in db', () => {
    service.project = project;
    apiServiceSpy.postProject.and.returnValue(of(1));
    service.createProjectInDatabase();
    expect(service.project.id).toBe(1);
    expect(service.project.version).toBe(2);
    expect(snackBarServiceSpy.showSnackBar).toHaveBeenCalledWith(
      'Saved to database',
      2000
    );
  });

  it('should create a new project by setting basic details', () => {
    service.project = undefined;
    apiServiceSpy.getClients.and.returnValue(of(clients));
    apiServiceSpy.postProject.and.returnValue(of(2));
    service.setBasicDetails(basicDetails, true);
    expect(service.getBasicDetails).toEqual(basicDetails);
  });

  it('should compare basic details undefined project', () => {
    service.project = undefined;
    let result = service.compareBasicDetails(basicDetails);
    expect(result).toBe(false);
  });

  it('should compare basic details not equal', () => {
    let anotherBasicDetails = {
      name: 'Bank Project',
      start_date: new Date('2022-12-24T09:00:00.000+00:00'),
      end_date: new Date('2022-12-09T23:59:59.000+00:00'),
      status: 'INPROGRESS',
      client_id: 3,
      client_specific: {
        Department: 'Wealth Management',
        'ED/MD': 'Amy Phutty',
      },
    };
    service.project = project;
    expect(service.compareBasicDetails(anotherBasicDetails)).toBe(false);
  });

  it('should set project resources', () => {
    project.project_resources = [];
    service.project = project;
    service.setProjectResources(projectResources);
    expect(service.project.project_resources).toEqual(projectResources);
  });

  it('should set project resources with names', () => {
    service.setProjectResourcesWithNames(projectResourcesWithNames);

    expect(service.projectResourcesWithNames).toEqual(
      projectResourcesWithNames
    );
  });

  it('should update project to resource mapping in db success', () => {
    apiServiceSpy.postProjectResources.and.returnValue(of(1));
    service.project = project;
    service.updateProjectToResourceMapping();
    expect(service.project.version).toBe(1);
  });

  it('should get project from database', () => {
    let httpResponse = new HttpResponse<Project>({
      url: 'http://localhost:8080/projects/1',
      body: project,
      status: 200,
    });

    apiServiceSpy.getProject.and.returnValue(of(httpResponse));

    let result = service.getFromDatabase(1);
    result.subscribe((data) => {
      expect(data.url).toEqual(httpResponse.url);
      expect(data.status).toEqual(httpResponse.status);
    });
  });

  it('should extract project success', () => {
    let httpResponse = new HttpResponse<Project>({
      url: 'http://localhost:8080/projects/1',
      body: project,
      status: 200,
    });
    expect(service.extractProject(httpResponse)).toEqual(httpResponse);
    expect(service.project).toEqual(project);
  });

  it('should extract project failure', () => {
    let httpResponse = new HttpResponse<Project>({
      url: 'http://localhost:8080/projects/1',
      body: undefined,
      status: 200,
    });
    expect(service.extractProject(httpResponse)).toEqual(httpResponse);
    expect(service.project).toEqual(undefined);
  });

  it('should update project status to db', () => {
    apiServiceSpy.putStatus.and.returnValue(of(true));
    let result = service.updateStatusToDatabase();
    result.subscribe((response) => expect(response).toBe(true));
  });

  it('should set resources count', () => {
    service.setResourcesCount(1);
    expect(service.project?.resources_count).toBe(1);
  });
});
