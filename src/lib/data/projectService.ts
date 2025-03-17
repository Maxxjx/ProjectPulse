import { Project } from './types';
import { projects } from './mockData';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return projects;
  },
  getProjectsByClient: async (clientId: string): Promise<Project[]> => {
    return projects.filter((project) => project.client?.id === clientId);
  },
  getProjectsByTeamMember: async (teamMemberId: string): Promise<Project[]> => {
    return projects.filter((project) =>
      project.team?.some((member) => member.id === teamMemberId)
    );
  },
  createProject: async (
    validatedData: any,
    creatorId: string,
    creatorName: string
  ): Promise<Project | null> => {
    const newProject: Project = {
      id: projects.length + 1, 
      name: validatedData.name,
      description: validatedData.description,
      createdAt: new Date().toISOString(),
      createdBy: { id: creatorId, name: creatorName },
      clientId: validatedData.clientId,
      team: validatedData.team || [],
      status: validatedData.status || ''
    };
    projects.push(newProject);
    return newProject;
  }
};