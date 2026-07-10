import {
  Activity,
  MemberRole,
  PrismaClient,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

async function clearDatabase() {
  await prisma.comment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("🌱 Starting database seed...");

  await clearDatabase();

  const passwordHash = await bcrypt.hash("Demo123!", 12);
  const currentDate = new Date();

  const admin = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "admin@nexusboard.dev",
      passwordHash,
      role: UserRole.ADMIN,
      image: null,
    },
  });

  const designer = await prisma.user.create({
    data: {
      name: "Sophia Chen",
      email: "sophia@nexusboard.dev",
      passwordHash,
      role: UserRole.MEMBER,
      image: null,
    },
  });

  const developer = await prisma.user.create({
    data: {
      name: "Daniel Carter",
      email: "daniel@nexusboard.dev",
      passwordHash,
      role: UserRole.MEMBER,
      image: null,
    },
  });

  const marketingProject = await prisma.project.create({
    data: {
      name: "Marketing Website",
      description:
        "Design and development of the new public-facing company website.",
      color: "#2563EB",
      status: ProjectStatus.ACTIVE,
      ownerId: admin.id,
      members: {
        create: [
          {
            userId: admin.id,
            role: MemberRole.OWNER,
          },
          {
            userId: designer.id,
            role: MemberRole.ADMIN,
          },
          {
            userId: developer.id,
            role: MemberRole.MEMBER,
          },
        ],
      },
    },
  });

  const mobileProject = await prisma.project.create({
    data: {
      name: "Mobile Application",
      description:
        "Cross-platform productivity application for NexusBoard customers.",
      color: "#7C3AED",
      status: ProjectStatus.ACTIVE,
      ownerId: admin.id,
      members: {
        create: [
          {
            userId: admin.id,
            role: MemberRole.OWNER,
          },
          {
            userId: developer.id,
            role: MemberRole.ADMIN,
          },
        ],
      },
    },
  });

  const analyticsProject = await prisma.project.create({
    data: {
      name: "Analytics Dashboard",
      description:
        "Internal dashboard for monitoring product usage and business metrics.",
      color: "#059669",
      status: ProjectStatus.ACTIVE,
      ownerId: admin.id,
      members: {
        create: [
          {
            userId: admin.id,
            role: MemberRole.OWNER,
          },
          {
            userId: designer.id,
            role: MemberRole.MEMBER,
          },
          {
            userId: developer.id,
            role: MemberRole.MEMBER,
          },
        ],
      },
    },
  });

  const brandProject = await prisma.project.create({
    data: {
      name: "Brand Refresh",
      description:
        "Completed visual identity and brand guideline modernization project.",
      color: "#EA580C",
      status: ProjectStatus.COMPLETED,
      ownerId: admin.id,
      members: {
        create: [
          {
            userId: admin.id,
            role: MemberRole.OWNER,
          },
          {
            userId: designer.id,
            role: MemberRole.ADMIN,
          },
        ],
      },
    },
  });

  const landingPageTask = await prisma.task.create({
    data: {
      title: "Build responsive landing page",
      description:
        "Implement the approved landing-page design using reusable components.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: addDays(currentDate, 3),
      projectId: marketingProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  const designSystemTask = await prisma.task.create({
    data: {
      title: "Create design system",
      description:
        "Define typography, spacing, colors, buttons, inputs, and card components.",
      status: TaskStatus.REVIEW,
      priority: TaskPriority.HIGH,
      dueDate: addDays(currentDate, 1),
      projectId: marketingProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Prepare SEO metadata",
      description:
        "Create page titles, descriptions, Open Graph metadata, and sitemap.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(currentDate, 5),
      projectId: marketingProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Write homepage content",
      description:
        "Prepare concise content for the hero, features, testimonials, and CTA.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(currentDate, -2),
      projectId: marketingProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Implement authentication flow",
      description:
        "Build login, registration, session handling, and protected navigation.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      dueDate: addDays(currentDate, 2),
      projectId: mobileProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Create onboarding screens",
      description:
        "Design the welcome, workspace setup, and first-project onboarding flow.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(currentDate, 7),
      projectId: mobileProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Configure push notifications",
      description:
        "Add notification preferences and task reminder infrastructure.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: addDays(currentDate, 10),
      projectId: mobileProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Design analytics overview",
      description:
        "Create the main analytics page with KPI cards and trend charts.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: addDays(currentDate, -1),
      projectId: analyticsProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Connect chart data",
      description:
        "Load aggregated task and project data into interactive dashboard charts.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: addDays(currentDate, 4),
      projectId: analyticsProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Add date range filters",
      description:
        "Allow users to filter analytics by week, month, quarter, and custom range.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(currentDate, 8),
      projectId: analyticsProject.id,
      creatorId: admin.id,
      assigneeId: developer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Approve new logo",
      description: "Review the final logo variants and approve the primary mark.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: addDays(currentDate, -12),
      projectId: brandProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Publish brand guidelines",
      description:
        "Deliver the finalized colors, typography, logo, and usage documentation.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(currentDate, -7),
      projectId: brandProject.id,
      creatorId: admin.id,
      assigneeId: designer.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content:
          "The desktop layout is complete. I am currently finishing the mobile navigation.",
        taskId: landingPageTask.id,
        authorId: developer.id,
      },
      {
        content:
          "Great progress. Please verify the tablet breakpoint before moving it to review.",
        taskId: landingPageTask.id,
        authorId: admin.id,
      },
      {
        content:
          "The component library is ready for final approval.",
        taskId: designSystemTask.id,
        authorId: designer.id,
      },
    ],
  });

  const activities: Omit<Activity, "id" | "createdAt">[] = [
    {
      type: "PROJECT_CREATED",
      message: "Alex created the Marketing Website project.",
      projectId: marketingProject.id,
      userId: admin.id,
    },
    {
      type: "TASK_UPDATED",
      message: "Daniel moved Build responsive landing page to In Progress.",
      projectId: marketingProject.id,
      userId: developer.id,
    },
    {
      type: "COMMENT_ADDED",
      message: "Sophia commented on Create design system.",
      projectId: marketingProject.id,
      userId: designer.id,
    },
    {
      type: "TASK_COMPLETED",
      message: "Sophia completed Design analytics overview.",
      projectId: analyticsProject.id,
      userId: designer.id,
    },
    {
      type: "MEMBER_ADDED",
      message: "Daniel joined the Mobile Application project.",
      projectId: mobileProject.id,
      userId: developer.id,
    },
    {
      type: "PROJECT_COMPLETED",
      message: "Alex completed the Brand Refresh project.",
      projectId: brandProject.id,
      userId: admin.id,
    },
  ];

  await prisma.activity.createMany({
    data: activities,
  });

  console.log("✅ Database seed completed.");
  console.log("");
  console.log("Demo account:");
  console.log("Email: admin@nexusboard.dev");
  console.log("Password: Demo123!");
}

main()
  .catch((error) => {
    console.error("❌ Database seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });