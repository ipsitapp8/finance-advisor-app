import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const Role = {
  ADMIN: "ADMIN",
  VIEWER: "VIEWER",
};

const PolicyType = {
  LIC: "LIC",
  MUTUAL_FUND: "MUTUAL_FUND",
  HEALTH_INSURANCE: "HEALTH_INSURANCE",
  TERM_INSURANCE: "TERM_INSURANCE",
  ULIP: "ULIP",
  PENSION: "PENSION",
  CHILD_PLAN: "CHILD_PLAN",
  OTHER: "OTHER",
};

const PremiumFreq = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  ANNUAL: "ANNUAL",
  ONE_TIME: "ONE_TIME",
};

const PolicyStatus = {
  ACTIVE: "ACTIVE",
  LAPSED: "LAPSED",
  MATURED: "MATURED",
  SURRENDERED: "SURRENDERED",
  PENDING: "PENDING",
};

const ReminderType = {
  PREMIUM_DUE: "PREMIUM_DUE",
  PREMIUM_OVERDUE: "PREMIUM_OVERDUE",
  BIRTHDAY: "BIRTHDAY",
  POLICY_RENEWAL: "POLICY_RENEWAL",
  POLICY_MATURITY: "POLICY_MATURITY",
  GENERAL: "GENERAL",
};

async function main() {
  console.log("Seeding started...");

  // Clean existing database records
  await prisma.contactMessage.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.policy.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin Advisor User
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@pratikfinance.com",
      name: "Pratik Shah",
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // 2. Create Viewer User
  const viewerPasswordHash = await bcrypt.hash("viewer123", 10);
  const viewerUser = await prisma.user.create({
    data: {
      email: "viewer@example.com",
      name: "Guest Viewer",
      password: viewerPasswordHash,
      role: Role.VIEWER,
    },
  });
  console.log(`Created viewer user: ${viewerUser.email}`);

  // 3. Create Mock Clients
  const client1 = await prisma.client.create({
    data: {
      name: "Amit Sharma",
      phone: "9876543210",
      email: "amit.sharma@example.com",
      address: "Flat 402, Sunshine Heights, Mumbai, MH",
      dateOfBirth: new Date("1982-08-15"),
      notes: "High net worth client, interested in wealth creation and retirement solutions.",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Priya Patel",
      phone: "9823456789",
      email: "priya.patel@example.com",
      address: "12-A, Shanti Niketan, Ahmedabad, GJ",
      dateOfBirth: new Date("1990-03-22"),
      notes: "Young IT professional, focuses on tax planning (80C ELSS SIPs) and health coverage.",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Vikram Singh",
      phone: "9112233445",
      email: "vikram.singh@example.com",
      address: "House No. 89, Sector 15, Gurgaon, HR",
      dateOfBirth: new Date("1975-12-05"),
      notes: "Owns a manufacturing business. Requires large life sum assured and cash flow management.",
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: "Rohan Deshmukh",
      phone: "9988776655",
      email: "rohan.d@example.com",
      address: "B-501, Royal Oasis, Pune, MH",
      dateOfBirth: new Date("1988-06-11"),
      notes: "Seeking education plans for his 5-year-old child.",
    },
  });

  console.log("Mock clients created.");

  // 4. Create Policies for Clients
  const today = new Date();
  
  // Amit Sharma Policies
  await prisma.policy.create({
    data: {
      policyNumber: "LIC-120984712",
      policyType: PolicyType.LIC,
      policyName: "Jeevan Anand (Plan 915)",
      premiumAmount: 24500.0,
      premiumFreq: PremiumFreq.ANNUAL,
      startDate: new Date("2018-05-10"),
      dueDate: new Date(today.getFullYear(), 4, 10), // May 10th
      maturityDate: new Date("2038-05-10"),
      status: PolicyStatus.ACTIVE,
      sumAssured: 500000.0,
      notes: "Endowment policy with whole life risk cover. Premium paid regularly.",
      clientId: client1.id,
    },
  });

  await prisma.policy.create({
    data: {
      policyNumber: "HDFC-HL-481920",
      policyType: PolicyType.HEALTH_INSURANCE,
      policyName: "HDFC Ergo Optima Secure",
      premiumAmount: 18200.0,
      premiumFreq: PremiumFreq.ANNUAL,
      startDate: new Date("2021-09-15"),
      dueDate: new Date(today.getFullYear(), 8, 15), // Sept 15th
      maturityDate: null,
      status: PolicyStatus.ACTIVE,
      sumAssured: 1000000.0,
      notes: "Health cover for self and spouse. Sum assured increases to 2X after 1 year.",
      clientId: client1.id,
    },
  });

  // Priya Patel Policies
  await prisma.policy.create({
    data: {
      policyNumber: "SBI-MF-7718290",
      policyType: PolicyType.MUTUAL_FUND,
      policyName: "SBI Bluechip Fund (SIP)",
      premiumAmount: 5000.0,
      premiumFreq: PremiumFreq.MONTHLY,
      startDate: new Date("2022-01-01"),
      dueDate: new Date(today.getFullYear(), today.getMonth(), 5), // 5th of every month
      status: PolicyStatus.ACTIVE,
      sumAssured: null,
      notes: "SIP investing in large cap companies. High performance history.",
      clientId: client2.id,
    },
  });

  await prisma.policy.create({
    data: {
      policyNumber: "MAX-TERM-88129",
      policyType: PolicyType.TERM_INSURANCE,
      policyName: "Max Life Smart Secure Plus",
      premiumAmount: 15400.0,
      premiumFreq: PremiumFreq.ANNUAL,
      startDate: new Date("2023-04-12"),
      dueDate: new Date(today.getFullYear(), 3, 12), // April 12th
      maturityDate: new Date("2065-04-12"),
      status: PolicyStatus.ACTIVE,
      sumAssured: 15000000.0, // 1.5 Cr
      notes: "Pure term insurance with critical illness rider.",
      clientId: client2.id,
    },
  });

  // Vikram Singh Policies
  await prisma.policy.create({
    data: {
      policyNumber: "LIC-551029837",
      policyType: PolicyType.LIC,
      policyName: "Jeevan Umang (Plan 945)",
      premiumAmount: 85000.0,
      premiumFreq: PremiumFreq.ANNUAL,
      startDate: new Date("2019-11-20"),
      dueDate: new Date(today.getFullYear(), 10, 20), // Nov 20th
      maturityDate: new Date("2049-11-20"),
      status: PolicyStatus.ACTIVE,
      sumAssured: 2000000.0, // 20 Lakhs
      notes: "Whole life assurance offering 8% payout after premium paying term.",
      clientId: client3.id,
    },
  });

  await prisma.policy.create({
    data: {
      policyNumber: "ICICI-PRU-10294",
      policyType: PolicyType.ULIP,
      policyName: "ICICI Pru Signature",
      premiumAmount: 100000.0,
      premiumFreq: PremiumFreq.ANNUAL,
      startDate: new Date("2020-02-15"),
      dueDate: new Date(today.getFullYear() - 1, 1, 15), // Feb 15th last year (Lapsed)
      maturityDate: new Date("2030-02-15"),
      status: PolicyStatus.LAPSED,
      sumAssured: 1000000.0,
      notes: "Market linked plan. Client missed premium due to business cash flow issues.",
      clientId: client3.id,
    },
  });

  // Rohan Deshmukh Policies
  await prisma.policy.create({
    data: {
      policyNumber: "LIC-339847120",
      policyType: PolicyType.CHILD_PLAN,
      policyName: "LIC Single Premium Jeevan Vriddhi",
      premiumAmount: 200000.0,
      premiumFreq: PremiumFreq.ONE_TIME,
      startDate: new Date("2024-01-20"),
      dueDate: new Date("2024-01-20"),
      maturityDate: new Date("2034-01-20"),
      status: PolicyStatus.ACTIVE,
      sumAssured: 350000.0,
      notes: "Single premium investment for child's higher education.",
      clientId: client4.id,
    },
  });

  console.log("Mock policies created.");

  // 5. Create Reminders
  // Premium upcoming (in 7 days)
  const dateIn7Days = new Date();
  dateIn7Days.setDate(today.getDate() + 7);
  
  await prisma.reminder.create({
    data: {
      type: ReminderType.PREMIUM_DUE,
      title: "Premium Due: LIC Jeevan Anand (Amit Sharma)",
      description: "Policy LIC-120984712 annual premium of ₹24,500 is due on " + dateIn7Days.toDateString(),
      dueDate: dateIn7Days,
      clientId: client1.id,
    },
  });

  // Premium overdue (15 days ago)
  const date15DaysAgo = new Date();
  date15DaysAgo.setDate(today.getDate() - 15);
  
  await prisma.reminder.create({
    data: {
      type: ReminderType.PREMIUM_OVERDUE,
      title: "OVERDUE: ICICI Pru Signature (Vikram Singh)",
      description: "Policy ICICI-PRU-10294 premium of ₹100,000 was due on " + date15DaysAgo.toDateString() + ". Status: Lapsed. Please call client to reinstate.",
      dueDate: date15DaysAgo,
      clientId: client3.id,
    },
  });

  // Birthday upcoming (tomorrow)
  const birthdayTomorrow = new Date();
  birthdayTomorrow.setDate(today.getDate() + 1);
  
  await prisma.reminder.create({
    data: {
      type: ReminderType.BIRTHDAY,
      title: "Birthday: Priya Patel",
      description: "Call Priya on +91 9823456789 to send wishes.",
      dueDate: birthdayTomorrow,
      clientId: client2.id,
    },
  });

  // General meeting (in 3 days)
  const dateIn3Days = new Date();
  dateIn3Days.setDate(today.getDate() + 3);
  await prisma.reminder.create({
    data: {
      type: ReminderType.GENERAL,
      title: "Portfolio Review: Vikram Singh",
      description: "Schedule zoom call to discuss mutual fund performance and new term insurance offer.",
      dueDate: dateIn3Days,
      clientId: client3.id,
    },
  });

  console.log("Mock reminders created.");

  // 6. Create Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Amit Sharma",
        content: "Mr. Pratik Shah has been handling my family's investments and life insurance policies for over 15 years. His integrity, deep understanding of market trends, and prompt service during claims are unmatched.",
        rating: 5,
        isPublic: true,
      },
      {
        clientName: "Priya Patel",
        content: "As a young IT professional, I was completely lost with tax-saving and investments. Pratik guide me through ELSS tax saving mutual funds and term insurance. Truly simplified my finances!",
        rating: 5,
        isPublic: true,
      },
      {
        clientName: "Vikram Singh",
        content: "The level of customization and personal attention I receive is incredible. The retirement and wealth protection plans mapped out by Pratik are robust. I sleep easy knowing my family's future is secure.",
        rating: 5,
        isPublic: true,
      },
      {
        clientName: "Sunita Rao",
        content: "Exceptional advisory! Very transparent about costs, returns, and lock-in periods. Highly recommended for anyone looking for reliable financial advisory in India.",
        rating: 5,
        isPublic: true,
      },
    ],
  });
  console.log("Mock testimonials created.");

  // 7. Create Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Rajesh Kulkarni",
        email: "rajesh.k@example.com",
        phone: "9811223344",
        message: "Hi, I am looking to invest ₹25,000 monthly in mutual funds. I need advice on choosing between large cap and flexi cap funds. Please schedule a call.",
        isRead: false,
      },
      {
        name: "Meera Nair",
        email: "meera.nair@example.com",
        phone: "9876123450",
        message: "I want to inquire about the LIC Jeevan Utsav plan for my children. What is the minimum sum assured and premium paying term?",
        isRead: true,
      },
    ],
  });
  console.log("Mock contact messages created.");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
