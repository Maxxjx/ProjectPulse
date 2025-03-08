interface EmailTemplateProps {
  recipientName: string;
  appUrl: string;
}

// Base email template with common styles and layout
function baseTemplate(content: string, props: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>ProjectPulse</title>
        <style>
          @media only screen and (max-width: 620px) {
            table.body h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
            table.body p,
            table.body ul,
            table.body ol,
            table.body td,
            table.body span,
            table.body a {
              font-size: 16px !important;
            }
            table.body .wrapper,
            table.body .article {
              padding: 10px !important;
            }
            table.body .content {
              padding: 0 !important;
            }
            table.body .container {
              padding: 0 !important;
              width: 100% !important;
            }
            table.body .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
            table.body .btn table {
              width: 100% !important;
            }
            table.body .btn a {
              width: 100% !important;
            }
          }
          
          .btn-primary {
            background-color: #8B5CF6;
            border-radius: 4px;
            color: #ffffff;
            display: inline-block;
            font-family: sans-serif;
            font-size: 16px;
            font-weight: bold;
            line-height: 45px;
            text-align: center;
            text-decoration: none;
            width: 200px;
            -webkit-text-size-adjust: none;
          }
          
          .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
          }
          
          .footer {
            clear: both;
            padding-top: 10px;
            text-align: center;
            width: 100%;
          }
          
          .footer td,
          .footer p,
          .footer span,
          .footer a {
            color: #999999;
            font-size: 12px;
            text-align: center;
          }
          
          .main {
            background: #ffffff;
            border-radius: 4px;
            width: 100%;
          }
          
          .wrapper {
            box-sizing: border-box;
            padding: 20px;
          }
          
          body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          
          table {
            border-collapse: separate;
            width: 100%;
          }
          
          table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top;
          }
          
          .body {
            background-color: #f6f6f6;
            width: 100%;
          }
          
          .container {
            margin: 0 auto !important;
            max-width: 580px;
            padding: 10px;
            width: 580px;
          }
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
                <table role="presentation" class="main">
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="text-align: center; margin-bottom: 20px;">
                              <img src="${props.appUrl}/logo.png" alt="ProjectPulse Logo" width="60" height="60" style="margin-bottom: 10px;" />
                              <h1 style="color: #333; margin: 0;">ProjectPulse</h1>
                            </div>
                            ${content}
                            <p style="margin-top: 20px;">If you have any questions, please contact our support team.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span>ProjectPulse Inc.</span>
                        <br />
                        <a href="${props.appUrl}/unsubscribe">Unsubscribe</a>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Password Reset Email
export function passwordResetEmail(props: EmailTemplateProps & { resetLink: string }) {
  const content = `
    <p>Hello ${props.recipientName},</p>
    <p>We received a request to reset your password for your ProjectPulse account. Click the button below to set a new password:</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.resetLink}" target="_blank" class="btn-primary">Reset Password</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>This link is valid for the next 30 minutes.</p>
  `;
  
  return baseTemplate(content, props);
}

// Task Assignment Email
export function taskAssignmentEmail(props: EmailTemplateProps & { 
  taskTitle: string;
  taskLink: string;
  projectName: string;
  dueDate: string;
  assignedBy: string;
}) {
  const content = `
    <p>Hello ${props.recipientName},</p>
    <p>You have been assigned a new task in ProjectPulse:</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #333;">${props.taskTitle}</h2>
      <p><strong>Project:</strong> ${props.projectName}</p>
      <p><strong>Due Date:</strong> ${props.dueDate}</p>
      <p><strong>Assigned By:</strong> ${props.assignedBy}</p>
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.taskLink}" target="_blank" class="btn-primary">View Task</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  
  return baseTemplate(content, props);
}

// Comment Notification Email
export function commentNotificationEmail(props: EmailTemplateProps & {
  taskTitle: string;
  taskLink: string;
  commenterName: string;
  commentText: string;
}) {
  const content = `
    <p>Hello ${props.recipientName},</p>
    <p><strong>${props.commenterName}</strong> commented on <strong>${props.taskTitle}</strong>:</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; font-style: italic;">
      "${props.commentText}"
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.taskLink}" target="_blank" class="btn-primary">View Comment</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  
  return baseTemplate(content, props);
}

// Deadline Reminder Email
export function deadlineReminderEmail(props: EmailTemplateProps & {
  taskTitle: string;
  taskLink: string;
  projectName: string;
  dueDate: string;
  daysRemaining: number;
}) {
  const content = `
    <p>Hello ${props.recipientName},</p>
    <p>This is a reminder that the following task is due ${props.daysRemaining === 0 ? 'today' : `in ${props.daysRemaining} days`}:</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #333;">${props.taskTitle}</h2>
      <p><strong>Project:</strong> ${props.projectName}</p>
      <p><strong>Due Date:</strong> ${props.dueDate}</p>
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.taskLink}" target="_blank" class="btn-primary">View Task</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  
  return baseTemplate(content, props);
}

// Weekly Summary Email
export function weeklySummaryEmail(props: EmailTemplateProps & {
  startDate: string;
  endDate: string;
  completedTasks: number;
  pendingTasks: number;
  upcomingDeadlines: Array<{
    title: string;
    dueDate: string;
    link: string;
  }>;
  dashboardLink: string;
}) {
  const upcomingDeadlinesHtml = props.upcomingDeadlines.map(task => `
    <tr>
      <td><a href="${task.link}" style="color: #8B5CF6;">${task.title}</a></td>
      <td style="text-align: right;">${task.dueDate}</td>
    </tr>
  `).join('');

  const content = `
    <p>Hello ${props.recipientName},</p>
    <p>Here's your weekly summary for ${props.startDate} to ${props.endDate}:</p>
    
    <div style="margin: 20px 0;">
      <div style="display: inline-block; width: 45%; background-color: #f0f9ff; padding: 15px; border-radius: 4px; margin-right: 5%;">
        <h3 style="margin-top: 0; color: #0284c7;">Completed Tasks</h3>
        <p style="font-size: 24px; font-weight: bold; margin-bottom: 0; color: #0284c7;">${props.completedTasks}</p>
      </div>
      <div style="display: inline-block; width: 45%; background-color: #fef2f2; padding: 15px; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #ef4444;">Pending Tasks</h3>
        <p style="font-size: 24px; font-weight: bold; margin-bottom: 0; color: #ef4444;">${props.pendingTasks}</p>
      </div>
    </div>
    
    <h3 style="margin-top: 30px;">Upcoming Deadlines:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #eee;">
        <th style="text-align: left; padding: 8px 0;">Task</th>
        <th style="text-align: right; padding: 8px 0;">Due Date</th>
      </tr>
      ${upcomingDeadlinesHtml}
    </table>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="margin-top: 30px;">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.dashboardLink}" target="_blank" class="btn-primary">View Dashboard</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  
  return baseTemplate(content, props);
}

// Welcome Email
export function welcomeEmail(props: EmailTemplateProps & {
  loginLink: string;
  gettingStartedLink: string;
}) {
  const content = `
    <p>Hello ${props.recipientName},</p>
    <p>Welcome to ProjectPulse! We're excited to have you on board.</p>
    <p>ProjectPulse is designed to help you manage your projects more efficiently, collaborate with your team, and stay on top of deadlines.</p>
    
    <h3 style="margin-top: 20px;">Getting Started:</h3>
    <ol>
      <li>Log in to your account</li>
      <li>Complete your profile</li>
      <li>Explore the dashboard</li>
      <li>Start creating or joining projects</li>
    </ol>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="margin-top: 20px;">
      <tbody>
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><a href="${props.loginLink}" target="_blank" class="btn-primary">Login</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    
    <p style="margin-top: 30px;">Need help getting started? Check out our <a href="${props.gettingStartedLink}" style="color: #8B5CF6;">Getting Started Guide</a>.</p>
  `;
  
  return baseTemplate(content, props);
}

// Export a function to send a mocked email (for demo purposes)
export function sendMockEmail(
  template: string, 
  props: any, 
  recipient: string
): Promise<{ success: boolean, messageId?: string, error?: string }> {
  // This is a mock function - in a real application, you would integrate with an email service
  console.log(`[MOCK EMAIL] Sending ${template} to ${recipient}`);
  console.log(`[MOCK EMAIL] Props:`, props);
  
  // Simulate an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a 95% success rate
      if (Math.random() > 0.05) {
        resolve({
          success: true,
          messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
        });
      } else {
        resolve({
          success: false,
          error: 'Failed to send email'
        });
      }
    }, 800);
  });
} 