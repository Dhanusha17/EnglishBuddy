import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Parallel search queries
  const [users, courses, quizzes, certificates] = await Promise.all([
    db.user.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } }
        ]
      },
      take: 5,
      select: { id: true, name: true, email: true, role: { select: { name: true } } }
    }),
    db.course.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, status: true }
    }),
    db.quiz.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true }
    }),
    db.certificate.findMany({
      where: { certificateCode: { contains: q } },
      take: 5,
      select: { id: true, certificateCode: true, user: { select: { name: true } } }
    })
  ]);

  const unifiedResults = [
    ...users.map(u => ({ id: u.id, type: 'USER', title: u.name, subtitle: u.email, link: `/admin/users` })),
    ...courses.map(c => ({ id: c.id, type: 'COURSE', title: c.title, subtitle: c.status, link: `/admin/courses/\${c.id}` })),
    ...quizzes.map(q => ({ id: q.id, type: 'QUIZ', title: q.title, subtitle: 'Quiz', link: `/admin/quizzes/\${q.id}` })),
    ...certificates.map(c => ({ id: c.id, type: 'CERTIFICATE', title: c.certificateCode, subtitle: `Issued to \${c.user?.name}`, link: `/admin/certificates` }))
  ];

  return NextResponse.json({ results: unifiedResults });
});
