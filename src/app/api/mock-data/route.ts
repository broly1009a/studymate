import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import BlogPost from '@/models/BlogPost';
import BlogCategory from '@/models/BlogCategory';
import BlogComment from '@/models/BlogComment';
import Competition from '@/models/Competition';
import CompetitionTeam from '@/models/CompetitionTeam';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
import Goal from '@/models/Goal';
import StudyGroup from '@/models/StudyGroup';
import GroupMember from '@/models/GroupMember';
import GroupMessage from '@/models/GroupMessage';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import Note from '@/models/Note';
import NoteFolder from '@/models/NoteFolder';
import Partner from '@/models/Partner';
import PartnerRequest from '@/models/PartnerRequest';
import StudySession from '@/models/StudySession';
import StudySessionRecord from '@/models/StudySessionRecord';
import Subject from '@/models/Subject';

// Import all mock data
import { blogPosts, blogCategories, blogComments } from '@/lib/mock-data/blog';
import { competitions, competitionTeams } from '@/lib/mock-data/competitions';
import { forumQuestions, forumAnswers } from '@/lib/mock-data/forum';
import { goals } from '@/lib/mock-data/goals';
import { studyGroups, groupMembers, groupMessages } from '@/lib/mock-data/groups';
import { conversations, messages } from '@/lib/mock-data/messages';
import { notes, noteFolders } from '@/lib/mock-data/notes';
import { partners, partnerRequests } from '@/lib/mock-data/partners';
import { profiles } from '@/lib/mock-data/profiles';
import { studySessions, studySessionRecords, mockSubjects } from '@/lib/mock-data/sessions';
import { hashPassword } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const results = {
      users: { inserted: 0, skipped: 'Already exists' as string | null },
      blogPosts: { inserted: 0, skipped: 'Collection not empty' as string | null },
      blogCategories: { inserted: 0, skipped: 'Collection not empty' as string | null },
      blogComments: { inserted: 0, skipped: 'Collection not empty' as string | null },
      competitions: { inserted: 0, skipped: 'Collection not empty' as string | null },
      competitionTeams: { inserted: 0, skipped: 'Collection not empty' as string | null },
      questions: { inserted: 0, skipped: 'Collection not empty' as string | null },
      answers: { inserted: 0, skipped: 'Collection not empty' as string | null },
      goals: { inserted: 0, skipped: 'Collection not empty' as string | null },
      studyGroups: { inserted: 0, skipped: 'Collection not empty' as string | null },
      groupMembers: { inserted: 0, skipped: 'Collection not empty' as string | null },
      groupMessages: { inserted: 0, skipped: 'Collection not empty' as string | null },
      messages: { inserted: 0, skipped: 'Collection not empty' as string | null },
      conversations: { inserted: 0, skipped: 'Collection not empty' as string | null },
      notes: { inserted: 0, skipped: 'Collection not empty' as string | null },
      noteFolders: { inserted: 0, skipped: 'Collection not empty' as string | null },
      partners: { inserted: 0, skipped: 'Collection not empty' as string | null },
      partnerRequests: { inserted: 0, skipped: 'Collection not empty' as string | null },
      studySessions: { inserted: 0, skipped: 'Collection not empty' as string | null },
      studySessionRecords: { inserted: 0, skipped: 'Collection not empty' as string | null },
      subjects: { inserted: 0, skipped: 'Collection not empty' as string | null },
    };

    // Check and seed users (only if no users exist)
    let insertedUsers: any[] = [];
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // Create users from profiles mock data with hashed passwords
      const mockUsers = await Promise.all(
        profiles.slice(0, 10).map(async (profile: any, index: number) => {
          const hashedPassword = await hashPassword('password123');
          return {
            email: profile.email || `user${index + 1}@example.com`,
            username: profile.username || `user${index + 1}`,
            fullName: profile.fullName,
            password: hashedPassword,
            avatar: profile.avatar,
            bio: profile.bio,
            subjects: profile.skills?.map((s: any) => s.name) || [],
            verified: true,
            role: index === 0 ? 'admin' : 'student',
            status: 'active',
            mockId: (index + 1).toString(),
          };
        })
      );
      insertedUsers = await User.insertMany(mockUsers);
      results.users = { inserted: insertedUsers.length, skipped: null };
    } else {
      // If users already exist, fetch them for mapping
      insertedUsers = await User.find().limit(10);
    }

    // Create user map
    const userMap: { [key: string]: any } = {};
    insertedUsers.forEach((user, index) => {
      if (user.mockId) {
        userMap[user.mockId] = user._id;
      } else {
        userMap[(index + 1).toString()] = user._id;
      }
    });

    // Check and seed blog categories
    let insertedCategories: any[] = [];
    if (await BlogCategory.countDocuments() === 0) {
      insertedCategories = await BlogCategory.insertMany(blogCategories);
      results.blogCategories = { inserted: insertedCategories.length, skipped: null };
    } else {
      insertedCategories = await BlogCategory.find();
    }

    // Create category map
    const categoryMap: { [key: string]: string } = {};
    insertedCategories.forEach((cat) => {
      const originalId = blogCategories.find(c => c.name === cat.name)?.id;
      if (originalId) {
        categoryMap[originalId] = cat._id.toString();
      }
    });

    // Check and seed blog data
    let insertedPosts: any[] = [];
    if (await BlogPost.countDocuments() === 0) {
      // Update blogPosts with real ObjectIds
      const updatedBlogPosts = blogPosts.map(post => ({
        ...post,
        authorId: userMap[post.authorId] || insertedUsers[0]._id,
        categoryId: categoryMap[post.categoryId] || insertedCategories[0]._id,
      }));
      insertedPosts = await BlogPost.insertMany(updatedBlogPosts);
      results.blogPosts = { inserted: insertedPosts.length, skipped: null };
    } else {
      insertedPosts = await BlogPost.find();
    }

    // Create post map
    const postMap: { [key: string]: string } = {};
    insertedPosts.forEach((post) => {
      const originalId = blogPosts.find(p => p.title === post.title)?.id;
      if (originalId) {
        postMap[originalId] = post._id.toString();
      }
    });

    if (await BlogComment.countDocuments() === 0) {
      // Update blogComments with real ObjectIds
      const updatedBlogComments = blogComments.map(comment => ({
        ...comment,
        postId: postMap[comment.postId] || insertedPosts[0]._id,
        authorId: userMap[comment.authorId] || insertedUsers[0]._id,
      }));
      const inserted = await BlogComment.insertMany(updatedBlogComments);
      results.blogComments = { inserted: inserted.length, skipped: null };
    }

    // Check and seed competitions
    let insertedCompetitions: any[] = [];
    if (await Competition.countDocuments() === 0) {
      // Update competitions with real ObjectIds
      const updatedCompetitions = competitions.map(competition => ({
        ...competition,
        organizerId: userMap[competition.organizerId] || insertedUsers[0]._id,
      }));
      insertedCompetitions = await Competition.insertMany(updatedCompetitions);
      results.competitions = { inserted: insertedCompetitions.length, skipped: null };
    } else {
      // If competitions already exist, fetch them for mapping
      insertedCompetitions = await Competition.find().limit(10);
    }

    // Create competition map
    const competitionMap: { [key: string]: any } = {};
    insertedCompetitions.forEach((competition, index) => {
      competitionMap[(index + 1).toString()] = competition._id;
    });

    if (await CompetitionTeam.countDocuments() === 0) {
      // Update competitionTeams with real ObjectIds
      const updatedCompetitionTeams = competitionTeams.map(team => ({
        ...team,
        competitionId: competitionMap[team.competitionId] || insertedCompetitions[0]._id,
        members: team.members.map((member: any) => ({
          ...member,
          userId: userMap[member.userId] || insertedUsers[0]._id,
        })),
      }));
      const inserted = await CompetitionTeam.insertMany(updatedCompetitionTeams);
      results.competitionTeams = { inserted: inserted.length, skipped: null };
    }

    // Check and seed forum
    let insertedQuestions: any[] = [];
    if (await Question.countDocuments() === 0) {
      // Update forumQuestions with real ObjectIds
      const updatedForumQuestions = forumQuestions.map(question => ({
        ...question,
        authorId: userMap[question.authorId] || insertedUsers[0]._id,
      }));
      insertedQuestions = await Question.insertMany(updatedForumQuestions);
      results.questions = { inserted: insertedQuestions.length, skipped: null };
    } else {
      // If questions already exist, fetch them for mapping
      insertedQuestions = await Question.find().limit(20);
    }

    // Create question map
    const questionMap: { [key: string]: any } = {};
    insertedQuestions.forEach((question, index) => {
      questionMap[(index + 1).toString()] = question._id;
    });

    if (await Answer.countDocuments() === 0) {
      // Update forumAnswers with real ObjectIds
      const updatedForumAnswers = forumAnswers.map(answer => ({
        ...answer,
        questionId: questionMap[answer.questionId] || insertedQuestions[0]._id,
        authorId: userMap[answer.authorId] || insertedUsers[0]._id,
      }));
      const inserted = await Answer.insertMany(updatedForumAnswers);
      results.answers = { inserted: inserted.length, skipped: null };
    }

    // Check and seed goals
    if (await Goal.countDocuments() === 0) {
      // Update goals with real ObjectIds
      const updatedGoals = goals.map(goal => {
        const { subjectId, ...rest } = goal;
        return {
          ...rest,
          userId: userMap[goal.userId] || insertedUsers[0]._id,
        };
      });
      const inserted = await Goal.insertMany(updatedGoals);
      results.goals = { inserted: inserted.length, skipped: null };
    }

    // Check and seed groups data
    let insertedGroups: any[] = [];
    if (await StudyGroup.countDocuments() === 0) {
      // Update studyGroups with real ObjectIds
      const updatedStudyGroups = studyGroups.map(group => ({
        ...group,
        owner: userMap[group.ownerId] || insertedUsers[0]._id,
        admins: [],
        members: [],
      }));
      insertedGroups = await StudyGroup.insertMany(updatedStudyGroups);
      results.studyGroups = { inserted: insertedGroups.length, skipped: null };
    } else {
      // If groups already exist, fetch them for mapping
      insertedGroups = await StudyGroup.find().limit(10);
    }

    // Create group map
    const groupMap: { [key: string]: any } = {};
    insertedGroups.forEach((group, index) => {
      groupMap[(index + 1).toString()] = group._id;
    });

    if (await GroupMember.countDocuments() === 0) {
      // Update groupMembers with real ObjectIds
      const updatedGroupMembers = groupMembers.map(member => ({
        ...member,
        groupId: groupMap[member.groupId] || insertedGroups[0]._id,
        userId: userMap[member.userId] || insertedUsers[0]._id,
      }));
      const inserted = await GroupMember.insertMany(updatedGroupMembers);
      results.groupMembers = { inserted: inserted.length, skipped: null };
    }

    if (await GroupMessage.countDocuments() === 0) {
      // Update groupMessages with real ObjectIds
      const updatedGroupMessages = groupMessages.map(message => ({
        ...message,
        groupId: groupMap[message.groupId] || insertedGroups[0]._id,
        userId: userMap[message.userId] || insertedUsers[0]._id,
        reactions: message.reactions?.map(reaction => ({
          ...reaction,
          userIds: reaction.users.map((user: string) => userMap[user] || insertedUsers[0]._id),
        })),
      }));
      const inserted = await GroupMessage.insertMany(updatedGroupMessages);
      results.groupMessages = { inserted: inserted.length, skipped: null };
    }

    // Check and seed conversations
    let insertedConversations: any[] = [];
    if (await Conversation.countDocuments() === 0) {
      // Update conversations with real ObjectIds
      const updatedConversations = conversations.map(conversation => ({
        participants: [insertedUsers[0]._id, userMap[conversation.partnerId]],
        participantNames: [insertedUsers[0].fullName, conversation.partnerName],
        lastMessage: conversation.lastMessage,
        lastMessageTime: new Date(conversation.lastMessageTime),
        unreadCounts: { [insertedUsers[0]._id.toString()]: conversation.unreadCount },
        subject: conversation.subject,
        isActive: true,
      }));
      insertedConversations = await Conversation.insertMany(updatedConversations);
      results.conversations = { inserted: insertedConversations.length, skipped: null };
    } else {
      // If conversations already exist, fetch them for mapping
      insertedConversations = await Conversation.find().limit(10);
    }

    // Create conversation map
    const conversationMap: { [key: string]: any } = {};
    insertedConversations.forEach((conversation, index) => {
      conversationMap[(index + 1).toString()] = conversation._id;
    });

    // Check and seed messages
    if (await Message.countDocuments() === 0) {
      // Update messages with real ObjectIds
      const updatedMessages = messages.map(message => ({
        ...message,
        conversationId: conversationMap[message.conversationId] || insertedConversations[0]._id,
        senderId: userMap[message.senderId] || insertedUsers[0]._id,
        reactions: message.reactions?.map(reaction => ({
          ...reaction,
          userId: userMap[reaction.userId] || insertedUsers[0]._id,
          userName: insertedUsers.find(u => u._id === (userMap[reaction.userId] || insertedUsers[0]._id))?.fullName || 'Unknown',
        })),
      }));
      const inserted = await Message.insertMany(updatedMessages);
      results.messages = { inserted: inserted.length, skipped: null };
    }

    // Check and seed notes
    let insertedNoteFolders: any[] = [];
    if (await NoteFolder.countDocuments() === 0) {
      // Update noteFolders with real ObjectIds
      const updatedNoteFolders = noteFolders.map(folder => ({
        ...folder,
        userId: userMap[folder.userId] || insertedUsers[0]._id,
      }));
      insertedNoteFolders = await NoteFolder.insertMany(updatedNoteFolders);
      results.noteFolders = { inserted: insertedNoteFolders.length, skipped: null };
    } else {
      // If noteFolders already exist, fetch them for mapping
      insertedNoteFolders = await NoteFolder.find().limit(10);
    }

    // Create noteFolder map
    const noteFolderMap: { [key: string]: string } = {};
    insertedNoteFolders.forEach((folder, index) => {
      noteFolderMap[(index + 1).toString()] = folder._id.toString();
    });

    if (await Note.countDocuments() === 0) {
      // Update notes with real ObjectIds
      const updatedNotes = notes.map(note => ({
        ...note,
        userId: userMap[note.userId] || insertedUsers[0]._id,
        folderId: note.folderId ? noteFolderMap[note.folderId] || null : null,
      }));
      const inserted = await Note.insertMany(updatedNotes);
      results.notes = { inserted: inserted.length, skipped: null };
    }

    // Check and seed partners
    if (await Partner.countDocuments() === 0) {
      // Clear any existing partners first
      await Partner.deleteMany({});
      // Update partners with real ObjectIds
      const updatedPartners = partners.map(partner => ({
        ...partner,
        userId: userMap[partner.userId] || insertedUsers[0]._id,
      }));
      const inserted = await Partner.insertMany(updatedPartners);
      results.partners = { inserted: inserted.length, skipped: null };
    }

    if (await PartnerRequest.countDocuments() === 0) {
      // Update partnerRequests with real ObjectIds
      const updatedPartnerRequests = partnerRequests.map(request => ({
        ...request,
        senderId: userMap[request.senderId] || insertedUsers[0]._id,
        receiverId: userMap[request.receiverId] || insertedUsers[0]._id,
      }));
      const inserted = await PartnerRequest.insertMany(updatedPartnerRequests);
      results.partnerRequests = { inserted: inserted.length, skipped: null };
    }

    // Check and seed sessions
    if (await StudySession.countDocuments() === 0) {
      // Update studySessions with real ObjectIds
      const updatedStudySessions = studySessions.map(session => ({
        title: session.topic || 'Study Session',
        description: session.notes || 'Study session',
        creatorId: userMap[session.userId || '1'] || insertedUsers[0]._id,
        creatorName: insertedUsers.find(u => u._id === (userMap[session.userId || '1'] || insertedUsers[0]._id))?.fullName || 'Unknown',
        subject: session.subjectName || 'General',
        topic: session.topic || 'Study',
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime || session.startTime),
        duration: session.duration,
        online: true,
        maxParticipants: 10,
        participants: [userMap[session.userId || '1'] || insertedUsers[0]._id],
        participants_count: 1,
        status: session.status === 'completed' ? 'completed' : 'scheduled',
        notes: session.notes,
        resources: [],
      }));
      const inserted = await StudySession.insertMany(updatedStudySessions);
      results.studySessions = { inserted: inserted.length, skipped: null };
    }

    // Check and seed subjects
    let insertedSubjects: any[] = [];
    if (await Subject.countDocuments() === 0) {
      // Update subjects with real ObjectIds
      const updatedSubjects = mockSubjects.map(subject => ({
        ...subject,
        userId: userMap[subject.userId] || insertedUsers[0]._id,
      }));
      insertedSubjects = await Subject.insertMany(updatedSubjects);
      results.subjects = { inserted: insertedSubjects.length, skipped: null };
    } else {
      // If subjects already exist, fetch them for mapping
      insertedSubjects = await Subject.find().limit(10);
    }

    // Create subject map
    const subjectMap: { [key: string]: any } = {};
    insertedSubjects.forEach((subject, index) => {
      subjectMap[(index + 1).toString()] = subject._id;
    });

    if (await StudySessionRecord.countDocuments() === 0) {
      // Update studySessionRecords with real ObjectIds
      const updatedStudySessionRecords = studySessionRecords.map(record => ({
        ...record,
        userId: userMap[record.userId] || insertedUsers[0]._id,
        subjectId: subjectMap[record.subjectId] || insertedSubjects[0]._id,
      }));
      const inserted = await StudySessionRecord.insertMany(updatedStudySessionRecords);
      results.studySessionRecords = { inserted: inserted.length, skipped: null };
    }

    return NextResponse.json({
      success: true,
      message: 'Mock data seeding completed',
      results,
    });

  } catch (error) {
    console.error('Error seeding mock data:', error);
    return NextResponse.json(
      { error: 'Failed to seed mock data', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const counts = {
      users: await User.countDocuments(),
      blogPosts: await BlogPost.countDocuments(),
      blogCategories: await BlogCategory.countDocuments(),
      blogComments: await BlogComment.countDocuments(),
      competitions: await Competition.countDocuments(),
      competitionTeams: await CompetitionTeam.countDocuments(),
      questions: await Question.countDocuments(),
      answers: await Answer.countDocuments(),
      goals: await Goal.countDocuments(),
      studyGroups: await StudyGroup.countDocuments(),
      groupMembers: await GroupMember.countDocuments(),
      groupMessages: await GroupMessage.countDocuments(),
      messages: await Message.countDocuments(),
      conversations: await Conversation.countDocuments(),
      notes: await Note.countDocuments(),
      noteFolders: await NoteFolder.countDocuments(),
      partners: await Partner.countDocuments(),
      partnerRequests: await PartnerRequest.countDocuments(),
      studySessions: await StudySession.countDocuments(),
      studySessionRecords: await StudySessionRecord.countDocuments(),
    };

    const totalCollections = Object.keys(counts).length;
    const emptyCollections = Object.entries(counts).filter(([_, count]) => count === 0).map(([key]) => key);

    return NextResponse.json({
      message: 'Database status',
      totalCollections,
      emptyCollections: emptyCollections.length,
      emptyCollectionNames: emptyCollections,
      counts,
      hasAllData: emptyCollections.length === 0,
    });
  } catch (error) {
    console.error('Error fetching database status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database status' },
      { status: 500 }
    );
  }
}