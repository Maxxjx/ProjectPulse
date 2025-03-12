// Chart Data Interfaces

export interface ProjectProgressChartData {
  projects: {
    name: string;
    progress: number;
    status: string;
  }[];
}

export interface TaskDistributionChartData {
  tasks: {
    status: string;
    count: number;
  }[];
}

export interface TimeTrackingChartData {
  days: string[];
  hours: number[];
}

export interface BudgetChartData {
  categories: string[];
  budget: number[];
  spent: number[];
}

export interface TeamPerformanceChartData {
  members: string[];
  tasks: {
    completed: number[];
    inProgress: number[];
  };
}

export interface ProjectTimelineChartData {
  projects: {
    name: string;
    start: Date;
    end: Date;
    progress: number;
  }[];
}

export interface PriorityDistributionChartData {
  priorities: {
    label: string;
    value: number;
  }[];
}

// Helper function to generate random data for demo purposes
export const generateRandomData = {
  projectProgress: (): ProjectProgressChartData => {
    const statuses = ['Not Started', 'In Progress', 'On Hold', 'Completed'];
    return {
      projects: Array(5).fill(0).map((_, i) => ({
        name: `Project ${i + 1}`,
        progress: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }))
    };
  },
  
  taskDistribution: (): TaskDistributionChartData => {
    return {
      tasks: [
        { status: 'To Do', count: Math.floor(Math.random() * 30) + 5 },
        { status: 'In Progress', count: Math.floor(Math.random() * 20) + 5 },
        { status: 'Review', count: Math.floor(Math.random() * 15) + 2 },
        { status: 'Completed', count: Math.floor(Math.random() * 40) + 10 }
      ]
    };
  },
  
  timeTracking: (): TimeTrackingChartData => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      days,
      hours: days.map(() => Math.floor(Math.random() * 8) + 1)
    };
  },
  
  budget: (): BudgetChartData => {
    const projects = ['Project A', 'Project B', 'Project C', 'Project D'];
    return {
      categories: projects,
      budget: projects.map(() => Math.floor(Math.random() * 10000) + 5000),
      spent: projects.map(() => Math.floor(Math.random() * 8000) + 2000)
    };
  },
  
  teamPerformance: (): TeamPerformanceChartData => {
    const members = ['Rajesh', 'Priya', 'Vikram', 'Ananya', 'Deepika'];
    return {
      members,
      tasks: {
        completed: members.map(() => Math.floor(Math.random() * 20) + 5),
        inProgress: members.map(() => Math.floor(Math.random() * 10) + 1)
      }
    };
  },
  
  projectTimeline: (): ProjectTimelineChartData => {
    const now = new Date();
    return {
      projects: Array(4).fill(0).map((_, i) => {
        const start = new Date(now);
        start.setDate(start.getDate() - Math.floor(Math.random() * 30));
        const end = new Date(start);
        end.setDate(end.getDate() + Math.floor(Math.random() * 60) + 30);
        return {
          name: `Project ${i + 1}`,
          start,
          end,
          progress: Math.floor(Math.random() * 100)
        };
      })
    };
  },
  
  priorityDistribution: (): PriorityDistributionChartData => {
    return {
      priorities: [
        { label: 'Low', value: Math.floor(Math.random() * 20) + 5 },
        { label: 'Medium', value: Math.floor(Math.random() * 40) + 15 },
        { label: 'High', value: Math.floor(Math.random() * 25) + 10 },
        { label: 'Critical', value: Math.floor(Math.random() * 15) + 3 }
      ]
    };
  }
}; 