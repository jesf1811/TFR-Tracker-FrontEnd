import { Route } from '@angular/router';

export interface ProjectDTO {
  id?: number;
  notes: string;
  name: string;
  client_id: number;
  start_date: Date;
  end_date: Date;
  status: string;
  version: number;
  client_specific: { [key: string]: string };
  resources_count: number;
  is_deleted: boolean;
  created_by: number;
  created_at: Date;
  modified_by: number;
  modified_at: Date;
  milestones?: MilestoneDTO[];
  project_resources?: ProjectResourceDTO[];
}

export interface MilestoneDTO {
  id?: number;
  project_id: number;
  status: string;
  name: string;
  description: string;
  start_date?: Date;
  delivery_date?: Date;
  acceptance_date?: Date;
  is_deleted: Boolean;
  possible_status?: string[];
}

export interface TFRRoute extends Route {
  navigationLabel?: String;
}

export interface TaskDTO {
  id?: number;
  project_id: number;
  task_type: any;
  execute_at: Date;
  recurring: boolean;
  cron?: string;
  by_email: boolean;
  expiration_date?: Date;
}

export interface ResourceDTO {
  id?: number;
  first_name: string;
  last_name: string;
  type: string;
  email: string;
  is_deleted: boolean;
}

export interface TaskCreationDTO {
  task: TaskDTO;
  resources: ResourceDTO[];
}

export interface ClientDTO {
  id: number;
  name: string;
}

export interface ClientAttributeDTO {
  client_id: number;
  attribute_name: string;
  is_deleted: boolean;
}

export interface AllocatedResourceTypeDTO {
  project_id: number;
  resource_id: number;
  resource_name: string;
  resource_email: string;
  seniority: string;
  is_deleted: boolean;
  role: string;
}

export interface ProjectResourceDTO {
  project_id: number;
  resource_id: number;
  role: string;
  seniority: string;
  is_deleted: boolean;
}

export interface ProjectBasicDetails {
  name: string;
  start_date: Date;
  end_date: Date;
  client_id: number;
  client_specific: { [key: string]: string };
  status: string;
}

export interface ResourceListType {
  resource_name: string;
  resource_email: string;
  resource_id: number;
  selected: boolean;
}

export interface RegisterResponse {
  msg: string;
  status: boolean;
}

export interface LoginResponse {
  id: BigInteger;
  username: string;
  msg: string;
  status: boolean;
  role: string;
  token: string;
}

export interface TfrCreationDialogContent {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

export interface NotesDialogContent {
  notes: string;
  editable: boolean;
}

export interface DisplaySkillDTO {
  skill: string;
  experience: number;
  percentage: number;
}

export interface UserTaskDTO {
  project_name: string;
  frequency: string;
  next_occurrence: Date;
  task_id: number;
  task_type: string;
  resource_id: number;
  enabled: boolean;
}

export interface TaskResourceDTO {
  task_id: number;
  resource_id: number;
  enabled: boolean;
}

export interface UpcomingProject {
  name: string;
  startDate: Date;
  daysToStart: number;
}

export interface AddResource {
  resource_name: string;
  role: string;
  seniority: string;
}

export interface UpdateResourceDialogContent {
  seniorityLevels: string[];
  resources: ResourceListType[];
  resourceToEdit: AllocatedResourceTypeDTO;
}

///////////////////////////////////////////////////////////////////////////
/////////////////////////////////// REFACTOR //////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Please delete all the duplicate DTOs, add proper type checking where appropriate
// and update your components / services to use the interfaces that are not in this section

export interface Project {
  id: number;
  notes: string;
  name: string;
  client_id: number;
  start_date: Date;
  end_date: Date;
  status: string;
  version: number;
  client_specific: { [key: string]: string };
  resources_count: number;
  is_deleted: Boolean;
  created_by: number;
  modified_by: number;
  created_at: Date;
  modified_at: Date;
  milestones: MilestoneDTO[];
  project_resources: ProjectResourceDTO[];
}

export interface ProjectMilestoneDTO {
  id: number;
  notes: string;
  name: string;
  client_id: number;
  start_date: Date;
  end_date: Date;
  status: string;
  version: number;
  client_specific: { [key: string]: string };
  is_deleted: Boolean;
  created_by: number;
  modified_by: number;
  created_at: Date;
  modified_at: Date;
  milestones: MilestoneDTO[];
  project_resources: ProjectResourceDTO[];
}
