import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { ResourceService } from 'src/app/services/resource/resource.service';
import { ResponseHandlerService } from 'src/app/services/response-handler/response-handler.service';
import { TfrManagementService } from 'src/app/services/tfr-management/tfr-management.service';
import { AllocatedResourceTypeDTO } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    TfrManagementService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class StepperComponent implements OnInit {
  @ViewChild('stepper') myStepper!: MatStepper;

  /*
    Will be removed once Laura's component is placed in the stepper
  */
  milestoneFormGroup = this._formBuilder.group({
    milestoneName: ['', Validators.required],
  });

  /*
    The size of this array is proportional to the number of steps in the stepper (excluding the
    last summary step).

    This array holds whether a step has been completed. For e.g:
    At index 0 with a value of false indicates that the step 1 has not been completed.
  */
  stepsValid: boolean[] = [false, false, false];
  editMode: boolean = false;

  /*
    controls whether the user can move to another step without completing its current step.

    A value of true forces the user to complete its current step before moving to the next.
  */
  isLinear = true;

  /*
    Listens to screen size changes. When the screen is small, the orientation of the stepper
    will be vertical. A horizontal stepper will appear on a large screen.
  */
  stepLabels: Observable<string[]>;

  getResourceNameObserver = {
    next: (data: AllocatedResourceTypeDTO[]) => {
      this.tfrManagementService.projectResourcesWithNames = data;
    },
  };

  getProjectObserver = {
    next: (response: Data) => {
      let status = response['project']['status'];
      if (status === 500) {
        this.tfrManagementService.apiError = true;
      } else if (status === 503) {
        this.tfrManagementService.serverDown = true;
      } else {
        let project = response['project'];
        this.tfrManagementService.project = project;
        this.apiService
          .getResourcesNamesByProjectIdFromDatabase(project.id)
          .subscribe(this.getResourceNameObserver);
        this.tfrManagementService.setClientName(project.client_id);
      }
    },
  };

  submitTFRObserver = {
    next: () => {
      this.router.navigate(['/tfrs']);
      this.responseHandlerService.goodSave();
    },
    error: () => {
      this.responseHandlerService.badSave();
    },
  };

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(TfrManagementService)
    protected tfrManagementService: TfrManagementService,
    protected breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private apiService: ApiService,
    private responseHandlerService: ResponseHandlerService
  ) {
    /*
      Listener for the screen size.
      Below 800px, the stepper labels are just icons
      Above 800px, the stepper labels are icons and text
    */
    this.stepLabels = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        map(({ matches }) =>
          matches
            ? ['TFR Basic Details', 'Milestones', 'Resources', 'TFR Submission']
            : ['', '', '', '']
        )
      );
  }

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path !== 'tfr/create') {
      let tfrId = Number(this.route.snapshot.paramMap.get('id'));

      /*
        Error validation for the path variable.
        The path variable (the project_id) is expected to be a number.
      */
      if (!Number.isInteger(tfrId)) {
        this.router.navigate(['/home']);
      } else {
        this.route.paramMap.subscribe((result) => {
          tfrId = Number(result.get('id'));
          this.route.data.subscribe(this.getProjectObserver);
        });
      }
    }
  }

  /*
    Programmatically moves to the next step.

    To be able to programmatically move to the next step, the stepper should NOT be
    linear. The stepper is momentarily made not linear.
    forward = true => Move to next step
    forward = false => Move to previous step
  */
  nextStep(forward: boolean) {
    this.myStepper.linear = false;
    if (forward) {
      this.myStepper.next();
    } else {
      this.myStepper.previous();
    }
    this.myStepper.linear = true;
  }

  /*
    When each step gets notified by its child component that the step has been completed through
    an emitter, this method should be called with the stepNumber (first index at 0) and
    TRUE (step completed).
  */
  stepCompleted(stepNumber: number, completed: boolean) {
    if (stepNumber >= 0) {
      this.stepsValid[stepNumber] = completed;
    }
  }

  /*
    After submitting the whole project, this method handles the redirection to the URL where all
    the TFRs are displayed.

    A small confirmation pop-up msg (aka a snack bar) is displayed at the bottom of the screen for 3000ms.
  */
  redirect(update: boolean) {
    if (update || this.tfrManagementService.project?.status === 'DRAFT') {
      this.tfrManagementService
        .updateStatusToDatabase()
        .subscribe(this.submitTFRObserver);
    } else {
      this.router.navigate(['/tfrs']);
    }
  }

  /*
    In edit mode the submit button should not be present
  */
  setEditMode(editMode: boolean) {
    this.editMode = editMode;
  }

  get currentResourcesWithNames(): AllocatedResourceTypeDTO[] {
    return this.resourceService.resourcesWithoutDeleted(
      this.tfrManagementService.getProjectResourcesWithNames
    );
  }
}
