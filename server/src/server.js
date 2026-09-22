const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');
const Competition = require('./models/Competition');
const Participation = require('./models/Participation');
const { COMPETITION_STATUS, PARTICIPATION_STATUS } = require('./constants/status');

const PORT = process.env.PORT || 5000;

const seedInitialData = async () => {
  try {
    const count = await Competition.countDocuments();
    if (count > 0) return; // Already seeded

    console.log('[Seed] Seeding initial competition data...');
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const user1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: 'password123',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
    });

    await User.create([
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

    // Classical Dance Competition matching reference UI
    const danceComp = await Competition.create({
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
      registrationEndDate: new Date(now.getTime() + 1.25 * oneDay),
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
        'Maximum video duration is 3 minutes.'
      ],
      eligibility: ['Open for all age groups across India.', 'Solo performances only.'],
      judgingParameters: [
        { title: 'Expressions & Abhinaya', description: 'Facial expressions and storytelling impact (30%)' },
        { title: 'Rhythm & Footwork', description: 'Precision in Taal and Layakar (30%)' }
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
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Aarav Mehta',
          rankText: '1st Winner',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Neha Verma',
          rankText: '2nd Winner',
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
        },
        {
          name: 'Ishita Chouhan',
          rankText: '3rd Winner',
          image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300'
        }
      ],
      disclaimer: 'Only contributions from paid participants will be considered for judging.',
      referralLink: 'https://feedants.com/r/referral123'
    });

    await Participation.create({
      userId: user1._id,
      competitionId: danceComp._id,
      status: PARTICIPATION_STATUS.REGISTERED
    });

    console.log('[Seed] Database seeded with initial competitions and users successfully!');
  } catch (e) {
    console.error('[Seed Error]', e);
  }
};

connectDB().then(async () => {
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Feedants Server running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
});
