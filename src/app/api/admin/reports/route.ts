import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const totalUsers = await db.user.count();
  const totalCourses = await db.course.count();
  const totalTests = await db.test.count();
  const totalInterviews = await db.mockInterview.count();
  const totalPosts = await db.communityPost.count();
  
  return NextResponse.json({
    data: {
      totalUsers,
      totalCourses,
      totalTests,
      totalInterviews,
      totalPosts,
    }
  }, { status: 200 });
});