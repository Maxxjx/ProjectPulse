'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DataServiceInstance } from '@/lib/data-service';
import { TeamPerformanceChart, ChartWrapper } from '@/components/charts';
import { ChartDebug } from '@/components/charts/ChartDebug';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  tasksCompleted: number;
  tasksInProgress: number;
  hoursLogged: number;
  performance: number;
}

interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  date: Date;
  minutes: number;
  description: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignedTo: string;
}

export default function TeamPerformancePage() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('monthly');
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Initialize data service and handle possible errors
        await DataServiceInstance.initialize().catch(err => {
          console.warn('Using mock data due to database connection issue:', err.message);
        });
        
        // Get users data with error handling
        const usersData = await DataServiceInstance.getUsers().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        });
        
        // Get time entries data with error handling
        const timeData = await DataServiceInstance.getTimeEntries().catch(err => {
          console.error('Error fetching time entries:', err);
          return [];
        });
        
        // Get tasks data with error handling
        const tasksData = await DataServiceInstance.getTasks().catch(err => {
          console.error('Error fetching tasks:', err);
          return [];
        });
        
        // Process and transform user data into team members with performance metrics
        if (usersData && usersData.length > 0) {
          // Filter users to only include team members
          const teamData = usersData.filter(user => 
            user.role === 'team' || user.role === 'admin'
          );
          
          // Transform into required format with performance metrics
          const processedTeamData = teamData.map(user => {
            // Calculate tasks assigned to this user
            const userTasks = tasksData?.filter(task => task.assignedTo === user.id) || [];
            const completedTasks = userTasks.filter(task => task.status === 'Completed').length;
            const inProgressTasks = userTasks.filter(task => task.status === 'In Progress').length;
            
            // Calculate hours logged by this user
            const userTimeEntries = timeData?.filter(entry => entry.userId === user.id) || [];
            const totalMinutes = userTimeEntries.reduce((acc, entry) => acc + entry.minutes, 0);
            const hoursLogged = parseFloat((totalMinutes / 60).toFixed(1));
            
            // Calculate performance score (simplified for demo)
            // Performance = completed tasks * 10 + hours logged
            const performance = completedTasks * 10 + hoursLogged;
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department || 'General',
              tasksCompleted: completedTasks,
              tasksInProgress: inProgressTasks,
              hoursLogged,
              performance
            };
          });
          
          setTeamMembers(processedTeamData);
          setTimeEntries(timeData || []);
          setTasks(tasksData || []);
        } else {
          // Fallback mock data for team performance
          setTeamMembers([
            {
              id: '1',
              name: 'Rajesh Sharma',
              email: 'admin@projectpulse.com',
              role: 'admin',
              department: 'Management',
              tasksCompleted: 12,
              tasksInProgress: 3,
              hoursLogged: 87.5,
              performance: 95
            },
            {
              id: '2',
              name: 'Priya Patel',
              email: 'priya@projectpulse.com',
              role: 'team',
              department: 'Development',
              tasksCompleted: 15,
              tasksInProgress: 2,
              hoursLogged: 92.0,
              performance: 98
            },
            {
              id: '3',
              name: 'Vikram Singh',
              email: 'vikram@projectpulse.com',
              role: 'team',
              department: 'Design',
              tasksCompleted: 8,
              tasksInProgress: 4,
              hoursLogged: 65.5,
              performance: 78
            },
            {
              id: '4',
              name: 'Deepika Verma',
              email: 'deepika@projectpulse.com',
              role: 'team',
              department: 'QA',
              tasksCompleted: 10,
              tasksInProgress: 1,
              hoursLogged: 75.0,
              performance: 85
            }
          ]);
          
          // Set mock time entries
          setTimeEntries([
            {
              id: 't1',
              userId: '1',
              taskId: 'task1',
              date: new Date(),
              minutes: 480,
              description: 'Project planning'
            },
            {
              id: 't2',
              userId: '2',
              taskId: 'task2',
              date: new Date(),
              minutes: 360,
              description: 'Frontend development'
            }
          ]);
          
          // Set mock tasks
          setTasks([
            {
              id: 'task1',
              title: 'Design System Planning',
              status: 'Completed',
              priority: 'High',
              assignedTo: '1'
            },
            {
              id: 'task2',
              title: 'Implement Dashboard UI',
              status: 'In Progress',
              priority: 'High',
              assignedTo: '2'
            }
          ]);
        }
      } catch (error) {
        console.error('Error in data fetching:', error);
        // Provide fallback data
        setTeamMembers([]);
        setTimeEntries([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate department options from team data
  const departments = ['all', ...new Set(teamMembers.map(member => member.department))];
  
  // Filter team members by department
  const filteredTeamMembers = department === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === department);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Performance Analysis</h1>
          <p className="text-muted-foreground">
            Monitor team productivity and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-background border border-input rounded-md px-3 py-2"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-background border border-input rounded-md px-3 py-2"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          
          {process.env.NODE_ENV !== 'production' && (
            <button
              className="px-3 py-2 bg-purple-800 text-white rounded-md text-sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide Debug' : 'Debug'}
            </button>
          )}
        </div>
      </header>

      {showDebug && (
        <ChartDebug
          data={{
            teamMembers: filteredTeamMembers,
            timeEntries,
            tasks
          }}
        />
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-2">
            <ChartWrapper title="Team Performance Overview">
              {filteredTeamMembers.length > 0 ? (
                <TeamPerformanceChart
                  data={filteredTeamMembers}
                  dateRange={dateRange}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No team data available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try changing your filter criteria or adding team members
                  </p>
                </div>
              )}
            </ChartWrapper>
          </div>
          
          <ChartWrapper title="Tasks Completed">
            <div className="space-y-4">
              {filteredTeamMembers.length > 0 ? (
                <div className="space-y-2">
                  {filteredTeamMembers
                    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
                    .map(member => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-32 truncate font-medium">{member.name}</div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-purple-500 h-3 rounded-full"
                            style={{ width: `${Math.min(100, member.tasksCompleted * 5)}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium">{member.tasksCompleted}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No task data available</p>
                </div>
              )}
            </div>
          </ChartWrapper>
          
          <ChartWrapper title="Hours Logged">
            <div className="space-y-4">
              {filteredTeamMembers.length > 0 ? (
                <div className="space-y-2">
                  {filteredTeamMembers
                    .sort((a, b) => b.hoursLogged - a.hoursLogged)
                    .map(member => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-32 truncate font-medium">{member.name}</div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-purple-500 h-3 rounded-full"
                            style={{ width: `${Math.min(100, (member.hoursLogged / 100) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium">{member.hoursLogged}h</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">No time tracking data available</p>
                </div>
              )}
            </div>
          </ChartWrapper>
        </div>
      )}
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">About This Report</h3>
        <p className="text-sm text-muted-foreground">
          The Team Performance Analysis dashboard provides insights into each team member's productivity. 
          Performance scores are calculated based on completed tasks and hours logged. 
          Filter by department to get department-specific insights.
        </p>
      </div>
    </div>
  );
}
