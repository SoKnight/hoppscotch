import { createHash } from 'node:crypto';
import { User as DbUser } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const GRAVATAR_PREFIX = 'https://gravatar.com/avatar/';

/**
 * Build a Gravatar URL for the given email
 *
 * @param email User's email
 * @returns Gravatar URL, or null if email is empty
 */
export function gravatarURL(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;

  const hash = createHash('sha256').update(normalized).digest('hex');
  // d=mp: admin dashboard renders photoURL without an onerror fallback
  return `${GRAVATAR_PREFIX}${hash}?s=256&d=mp`;
}

/**
 * Fill an empty photoURL with Gravatar, or refresh a stale Gravatar one.
 * Avatars set by OAuth providers are left untouched.
 *
 * @param prisma Prisma service
 * @param user User object
 * @returns User object with up-to-date photoURL
 */
export async function syncGravatar(
  prisma: PrismaService,
  user: DbUser,
): Promise<DbUser> {
  if (user.photoURL && !user.photoURL.startsWith(GRAVATAR_PREFIX)) return user;

  const photoURL = gravatarURL(user.email);
  if (photoURL === user.photoURL) return user;

  return prisma.user.update({
    where: { uid: user.uid },
    data: { photoURL },
  });
}
