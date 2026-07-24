import { ShieldCheck, Download, Award, Calendar, User, FileText, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import db from "@/lib/db";

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cert = await db.certificate.findFirst({
    where: {
      OR: [{ id }, { certificateCode: id }],
    },
    include: {
      user: { select: { name: true } },
    },
  });

  if (!cert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Invalid Certificate</CardTitle>
            <CardDescription className="mt-2 text-base">
              The certificate ID <span className="font-mono font-bold text-foreground">{id}</span> could not be verified in our official records.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studentName = cert.issuedToName || cert.user.name;
  const formattedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4 md:p-8">
      <Card className="max-w-2xl w-full shadow-xl border-2 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-white/20 backdrop-blur-md rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Official Certificate Verified</h1>
          <p className="text-emerald-100 text-sm mt-1">Issued by EnglishBuddy Learning Platform</p>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-950 dark:text-emerald-200">Authenticity Status</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-400">Digitally signed & verified in system registry</p>
              </div>
            </div>
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">VERIFIED</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Recipient Name
              </span>
              <p className="text-xl font-bold text-foreground">{studentName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Certificate Title
              </span>
              <p className="text-lg font-semibold text-primary">{cert.title}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Category
              </span>
              <Badge variant="secondary" className="mt-1 font-medium">{cert.category}</Badge>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Issued Date
              </span>
              <p className="text-sm font-medium text-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl space-y-1 font-mono text-xs">
            <p className="text-muted-foreground">Unique Certificate ID:</p>
            <p className="font-bold text-foreground break-all">{cert.certificateCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={`/api/certificates/${cert.certificateCode}/download`} 
              download
              className={`flex-1 h-11 text-base font-semibold ${buttonVariants({ variant: "default" })}`}
            >
              <Download className="mr-2 h-5 w-5" /> Download PDF Certificate
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
