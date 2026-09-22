const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Competition = require('../models/Competition');
const Participation = require('../models/Participation');
const { COMPETITION_STATUS, PARTICIPATION_STATUS } = require('../constants/status');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Competition.deleteMany({});
    await Participation.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const users = await User.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300'
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300'
      }
    ]);

    console.log(`[Seed] Created ${users.length} users.`);

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    console.log('[Seed] Creating competitions...');

    // Competition 1: Feedants Classical Dance (Matches exact user design screenshot)
    const classicalDanceComp = await Competition.create({
      title: 'Feedants Classical Dance',
      description:
        'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      bannerImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
      organizer: {
        name: 'Manju Dubey',
        role: 'Judge',
        title: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      entryFee: 99,
      prizePool: 1500,
      maximumParticipants: 20,
      currentParticipants: 1,
      registrationStartDate: new Date(now.getTime() - 2 * oneDay),
      registrationEndDate: new Date(now.getTime() + 1.25 * oneDay), // Closes in ~1d 6h
      submissionStartDate: new Date(now.getTime() - oneDay),
      submissionEndDate: new Date(now.getTime() + 10 * oneDay),
      startDate: new Date(now.getTime() - 2 * oneDay),
      endDate: new Date(now.getTime() + 12 * oneDay),
      resultDate: new Date(now.getTime() + 14 * oneDay),
      status: COMPETITION_STATUS.REGISTRATION_OPEN,
      rules: [
        'Performances must be strictly classical dance forms (Kathak, Bharatanatyam, Odissi, Manipuri, etc.).',
        'Video resolution must be clear with minimum 720p resolution.',
        'Audio must be original or unedited backing track without distorted background noise.',
        'Maximum video duration is 3 minutes.',
        'Only contributions from paid registered participants will be evaluated by the judges.'
      ],
      eligibility: [
        'Open for all age groups across India.',
        'Solo performances only.',
        'Participants must submit original video recorded in 2026.'
      ],
      judgingParameters: [
        { title: 'Expressions & Abhinaya', description: 'Facial expressions and storytelling impact (30%)' },
        { title: 'Rhythm & Footwork', description: 'Precision in Taal and Layakar (30%)' },
        { title: 'Choreography & Grace', description: 'Fluidity and execution of mudras (20%)' },
        { title: 'Costume & Presentation', description: 'Authenticity of attire and overall stage presence (20%)' }
      ],
      rewards: [
        { position: 1, rankText: '1st Winner', prizeAmount: 550 },
        { position: 2, rankText: '2nd Winner', prizeAmount: 300 },
        { position: 3, rankText: '3rd Winner', prizeAmount: 240 },
        { position: 4, rankText: '4th Winner', prizeAmount: 200 },
        { position: 5, rankText: '5th Winner', prizeAmount: 130 },
        { position: 6, rankText: '6th Winner', prizeAmount: 80 }
      ],
      previousWinners: [
        {
          name: 'Riya Shah',
          rankText: '1st Winner',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          name: 'Aarav Mehta',
          rankText: '1st Winner',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          name: 'Neha Verma',
          rankText: '2nd Winner',
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          name: 'Ishita Chouhan',
          rankText: '3rd Winner',
          image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        }
      ],
      disclaimer: 'Only contributions from paid participants will be considered for judging.',
      referralLink: 'https://feedants.com/r/referral123',
      referralBonusAmount: 10
    });

    // Competition 2: Upcoming Design Competition
    const upcomingComp = await Competition.create({
      title: 'Feedants Mobile UI/UX Design Challenge',
      description: 'Design the next generation mobile user experience for social commerce applications.',
      bannerImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
      category: 'Design',
      tags: ['Design', 'Figma', 'UI/UX'],
      organizer: {
        name: 'Rohan Sen',
        role: 'Head of Design',
        title: 'Principal Designer at Feedants',
        experience: '8+ Years of Experience',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
      },
      entryFee: 49,
      prizePool: 2500,
      maximumParticipants: 50,
      currentParticipants: 0,
      registrationStartDate: new Date(now.getTime() + 2 * oneDay), // Starts in 2 days
      registrationEndDate: new Date(now.getTime() + 10 * oneDay),
      startDate: new Date(now.getTime() + 2 * oneDay),
      endDate: new Date(now.getTime() + 15 * oneDay),
      resultDate: new Date(now.getTime() + 17 * oneDay),
      status: COMPETITION_STATUS.UPCOMING,
      rules: ['Figma file submission required.', 'Original work only.'],
      eligibility: ['Open globally to all designers.'],
      rewards: [
        { position: 1, rankText: '1st Winner', prizeAmount: 1500 },
        { position: 2, rankText: '2nd Winner', prizeAmount: 1000 }
      ]
    });

    // Competition 3: FULL Competition (Capacity reached)
    const fullComp = await Competition.create({
      title: 'Feedants Full Stack Developer Sprint',
      description: 'Rapid coding tournament to build scalable microservices under 24 hours.',
      bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      category: 'Coding',
      tags: ['Node.js', 'React', 'MongoDB'],
      organizer: {
        name: 'Vikram Sethi',
        role: 'Tech Lead',
        title: 'Senior Architect',
        experience: '10+ Years Experience',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'
      },
      entryFee: 149,
      prizePool: 5000,
      maximumParticipants: 5,
      currentParticipants: 5, // Capacity fully booked
      registrationStartDate: new Date(now.getTime() - 3 * oneDay),
      registrationEndDate: new Date(now.getTime() + 2 * oneDay),
      startDate: new Date(now.getTime() - 3 * oneDay),
      endDate: new Date(now.getTime() + 5 * oneDay),
      resultDate: new Date(now.getTime() + 6 * oneDay),
      status: COMPETITION_STATUS.FULL,
      rules: ['Must use Git repository for submission.'],
      eligibility: ['Open for all software developers.'],
      rewards: [{ position: 1, rankText: '1st Winner', prizeAmount: 5000 }]
    });

    // Competition 4: COMPLETED Competition
    const completedComp = await Competition.create({
      title: 'Feedants Monologue & Acting Championship 2026',
      description: 'National acting competition judged by acclaimed theatre directors.',
      bannerImage: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=800',
      category: 'Drama',
      tags: ['Acting', 'Certificate', 'Completed'],
      organizer: {
        name: 'Sunita Rao',
        role: 'Theatre Director',
        title: 'National School of Drama Alumna',
        experience: '15+ Years',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
      },
      entryFee: 199,
      prizePool: 3000,
      maximumParticipants: 30,
      currentParticipants: 28,
      registrationStartDate: new Date(now.getTime() - 20 * oneDay),
      registrationEndDate: new Date(now.getTime() - 10 * oneDay),
      startDate: new Date(now.getTime() - 20 * oneDay),
      endDate: new Date(now.getTime() - 2 * oneDay), // Ended 2 days ago
      resultDate: new Date(now.getTime() - oneDay),
      status: COMPETITION_STATUS.COMPLETED,
      rules: ['Completed.'],
      eligibility: ['Open to all.'],
      rewards: [{ position: 1, rankText: '1st Winner', prizeAmount: 3000 }]
    });

    console.log('[Seed] Creating initial registration for User 1 in Classical Dance competition...');
    await Participation.create({
      userId: users[0]._id,
      competitionId: classicalDanceComp._id,
      status: PARTICIPATION_STATUS.REGISTERED,
      registeredAt: new Date()
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials for Mobile / API Testing:');
    console.log(`User 1 (Registered in Classical Dance): ${users[0].email} / password123`);
    console.log(`User 2 (Unregistered):                 ${users[1].email} / password123`);
    console.log(`User 3 (Unregistered):                 ${users[2].email} / password123`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`, error);
    process.exit(1);
  }
};

seedData();
