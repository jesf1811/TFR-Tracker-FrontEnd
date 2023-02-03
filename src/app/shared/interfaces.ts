import { Route } from '@angular/router';

export interface ProjectDTO {
  id?: number;
  name: string;
  client_id: number;
  start_date: Date;
  end_date: Date;
  status: any;
  version: number;
  client_specific: string;
  is_deleted: boolean;
  created_by: number;
  created_at: Date;
  modified_by: number;
  modified_at: Date;
  milestones?: MilestoneDTO[];
  project_resources?: ProjectResourceDTO[];
}

export interface Project {
  id: number;
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
  milestones: Milestone[];
  project_resources: ProjectResourceDTO[];
}

export interface ProjectMilestoneDTO {
  id: number;
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

export interface FormMilestone {
  id: number;
  project_id: number;
  name: string;
  description: string;
  start_date?: Date;
  delivery_date?: Date;
  acceptance_date?: Date;
  is_deleted: Boolean;
  tracker?: TrackerDTO;
}

export interface Milestone {
  id: number;
  project_id: number;
  name: string;
  description: string;
  start_date: Date;
  delivery_date: Date;
  acceptance_date: Date;
  is_deleted: Boolean;
  tracker?: TrackerDTO;
}

export interface MilestoneDTO {
  id?: number;
  project_id: number;
  name: string;
  description: string;
  start_date: Date;
  delivery_date: Date;
  acceptance_date: Date;
  is_deleted: Boolean;
  tracker?: TrackerDTO;
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
  cron: string | null;
  by_email: boolean;
  expiration_date: Date | null;
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

export interface TrackerDTO {
  milestone_id: number;
  project_id: number;
  start_date: Date;
  end_date: Date;
  status: string;
  created_by: number;
  modified_by: number;
  created_at: Date;
  modified_at: Date;
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
  user_name: string;
  msg: string;
  status: boolean;
  token: string;
}

export interface dialogContent {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

export interface ResourceSkillDTO {
  resource_id: number;
  skill: string;
  experience: number;
}
