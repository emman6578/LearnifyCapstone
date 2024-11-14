import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { instructionalMaterials } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.instructionalMaterials.findFirst({
    where: eq(instructionalMaterials.id, params.challengeOptionId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof instructionalMaterials.$inferSelect;
  const data = await db
    .update(instructionalMaterials)
    .set({
      ...body,
    })
    .where(eq(instructionalMaterials.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(instructionalMaterials)
    .where(eq(instructionalMaterials.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};
