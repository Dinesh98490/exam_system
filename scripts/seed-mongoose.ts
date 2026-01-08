import mongoose from 'mongoose';
import { Exam, Question } from '../models/Exam';
import User from '../models/User';
import { hashPassword } from '../lib/auth/password';
import dbConnect from '../lib/mongoose';

async function seed() {
  await dbConnect();

  console.log('Seeding exams...');

  // Create Users
  const passwordHash = await hashPassword('password123');

  await User.deleteMany({ email: { $in: ['admin@secure.edu', 'lecturer@secure.edu', 'moderator@secure.edu'] } });

  await User.create([
      {
          name: 'System Admin',
          email: 'admin@secure.edu',
          passwordHash,
          role: 'ADMIN'
      },
      {
          name: 'Dr. Lecturer',
          email: 'lecturer@secure.edu',
          passwordHash,
          role: 'LECTURER'
      },
      {
          name: 'Ms. Moderator',
          email: 'moderator@secure.edu',
          passwordHash,
          role: 'MODERATOR'
      }
  ]);
  console.log('Created users: Admin, Lecturer, Moderator (password: password123)');

  // Create a sample published exam
  const exam = await Exam.create({
    title: 'Network Security Fundamentals',
    description: 'Mid-term examination covering OSI model, Firewalls, and Cryptography basics.',
    durationMinutes: 60,
    status: 'PUBLISHED',
    price: 0, // Free
  });

  console.log(`Created exam: ${exam.title}`);

  // Create questions for Network Security
  await Question.insertMany([
    {
      examId: exam._id,
      text: 'Which layer of the OSI model is responsible for routing?',
      options: ['Data Link', 'Network', 'Transport', 'Session'],
      correctOptionIndex: 1, 
      points: 2
    },
    {
      examId: exam._id,
      text: 'What does SSL stand for?',
      options: ['Secure Sockets Layer', 'System Safe Login', 'Super Secure Link', 'Standard System Logic'],
      correctOptionIndex: 0,
      points: 2
    },
    {
        examId: exam._id,
        text: 'Which of the following is a symmetric encryption algorithm?',
        options: ['RSA', 'AES', 'ECC', 'Diffie-Hellman'],
        correctOptionIndex: 1, 
        points: 2
    },
    {
        examId: exam._id,
        text: 'What is the primary function of a firewall?',
        options: ['To route packets', 'To encrypt data', 'To filter network traffic', 'To store data'],
        correctOptionIndex: 2,
        points: 2
    },
    {
        examId: exam._id,
        text: 'Which attack involves overwhelming a system with traffic?',
        options: ['Phishing', 'SQL Injection', 'DDoS', 'Man-in-the-Middle'],
        correctOptionIndex: 2,
        points: 2
    }
  ]);

  console.log('Questions added for Network Security.');

  // Create a LOCKED exam (Paid)
  const paidExam = await Exam.create({
    title: 'Certified Ethical Hacker (CEH) Mock',
    description: 'Comprehensive mock exam for CEH certification. Covers footprinting, scanning, enumeration, and system hacking.',
    durationMinutes: 120,
    status: 'PUBLISHED',
    price: 1500, // NPR
  });

  await Question.insertMany([
      {
          examId: paidExam._id,
          text: 'Which Nmap flag is used for OS detection?',
          options: ['-sS', '-O', '-sV', '-Pn'],
          correctOptionIndex: 1,
          points: 5
      },
      {
          examId: paidExam._id,
          text: 'What is the first step in the hacking methodology?',
          options: ['Scanning', 'Footprinting', 'Enumeration', 'Exploitation'],
          correctOptionIndex: 1,
          points: 5
      },
       {
          examId: paidExam._id,
          text: 'Metasploit is primarily used for?',
          options: ['Password Cracking', 'Network Sniffing', 'Exploitation Framework', 'Data Recovery'],
          correctOptionIndex: 2,
          points: 5
      }
  ]);
  
  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
