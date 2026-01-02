// Central model registry - import this to ensure all models are registered
import User from './User';
import Partner from './Partner';
import Message from './Message';
import Conversation from './Conversation';
import Group from './Group';
import GroupMember from './GroupMember';
import Post from './Post';
import Comment from './Comment';
import Activity from './Activity';
import Achievement from './Achievement';
import Badge from './Badge';
import Goal from './Goal';
import StudySession from './StudySession';
import Note from './Note';
import NoteFolder from './NoteFolder';
import Subject from './Subject';
import Event from './Event';
import Notification from './Notification';
import UserProfile from './UserProfile';
import Question from './Question';
import Answer from './Answer';
import BlogPost from './BlogPost';
import BlogCategory from './BlogCategory';
import BlogComment from './BlogComment';
import Competition from './Competition';
import CompetitionTeam from './CompetitionTeam';
import DashboardWidget from './DashboardWidget';
import Category from './Category';

// Export all models
export {
  User,
  Partner,
  Message,
  Conversation,
  Group,
  GroupMember,
  Post,
  Comment,
  Activity,
  Achievement,
  Badge,
  Goal,
  StudySession,
  Note,
  NoteFolder,
  Subject,
  Event,
  Notification,
  UserProfile,
  Question,
  Answer,
  BlogPost,
  BlogCategory,
  BlogComment,
  Competition,
  CompetitionTeam,
  DashboardWidget,
  Category,
};

// Helper function to ensure all models are registered
export function registerModels() {
  // Just importing this file will register all models
  return true;
}
