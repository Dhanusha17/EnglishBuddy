import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
  
  // Cross-module parallel search
  const [courses, lessons, practices, tests, companies, forumPosts, groups, events, resources] = await Promise.all([
    db.course.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.lesson.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.practiceActivity.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.test.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.company.findMany({ where: { name: { contains: q } }, take: 5 }),
    db.communityPost.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.studyGroup.findMany({ where: { name: { contains: q } }, take: 5 }),
    db.event.findMany({ where: { title: { contains: q } }, take: 5 }),
    db.resource.findMany({ where: { title: { contains: q } }, take: 5 }),
  ]);
  
  const results = [
    ...courses.map(c => ({ id: c.id, title: c.title, type: 'COURSE', url: `/learning/course/${c.id}` })),
    ...lessons.map(l => ({ id: l.id, title: l.title, type: 'LESSON', url: `/learning/lesson/${l.id}` })),
    ...practices.map(p => ({ id: p.id, title: p.title, type: 'PRACTICE', url: `/practice/activity/${p.id}` })),
    ...tests.map(t => ({ id: t.id, title: t.title, type: 'TEST', url: `/tests/session/${t.id}` })),
    ...companies.map(c => ({ id: c.id, title: c.name, type: 'COMPANY', url: `/placement/companies/${c.id}` })),
    ...forumPosts.map(f => ({ id: f.id, title: f.title, type: 'FORUM_POST', url: `/community/forum/${f.id}` })),
    ...groups.map(g => ({ id: g.id, title: g.name, type: 'STUDY_GROUP', url: `/community/groups/${g.id}` })),
    ...events.map(e => ({ id: e.id, title: e.title, type: 'EVENT', url: `/community/events/${e.id}` })),
    ...resources.map(r => ({ id: r.id, title: r.title, type: 'RESOURCE', url: `/resources/${r.id}` })),
  ];
  
  return NextResponse.json({ data: results }, { status: 200 });
});