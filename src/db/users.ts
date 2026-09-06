import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, role?: 'CUSTOMER' | 'SELLER') {
  const result = await db.insert(users)
    .values({
      uid,
      email,
      ...(role ? { role } : {}),
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        ...(role ? { role } : {}),
      },
    })
    .returning();

  return result[0];
}
