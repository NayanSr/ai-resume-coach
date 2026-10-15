// chatgpt edited code
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

export async function requireDbUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  );

  const email = (
    primaryEmail?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress
  )?.trim().toLowerCase();

  if (!email) {
    throw new Error("User email is required");
  }

  const name =
    clerkUser.fullName ?? clerkUser.firstName ?? null;
  const imageUrl = clerkUser.imageUrl ?? null;

  // Look for the user using both unique identifiers.
  const [byClerkId, byEmail] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkId: userId },
    }),
    prisma.user.findUnique({
      where: { email },
    }),
  ]);

  // The two identifiers point to different database users.
  // Do not merge or overwrite either user's data automatically.
  if (byClerkId && byEmail && byClerkId.id !== byEmail.id) {
    throw new Error(
      "Account conflict: Clerk ID and email belong to different database users."
    );
  }

  // The Clerk ID already exists. Update the existing record.
  if (byClerkId) {
    return prisma.user.update({
      where: { id: byClerkId.id },
      data: { email, name, imageUrl },
    });
  }

  // The email exists but belongs to a different Clerk ID.
  if (byEmail) {
    const isVerifiedPrimaryEmail =
      primaryEmail?.emailAddress.trim().toLowerCase() === email &&
      primaryEmail.verification?.status === "verified";

    if (!isVerifiedPrimaryEmail) {
      throw new Error(
        "Existing email found. A verified primary email is required to reconnect this account."
      );
    }

    // Preserve the existing user record and its related data.
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        clerkId: userId,
        name,
        imageUrl,
      },
    });
  }

  // Neither identifier exists, so create a new user.
  return prisma.user.create({
    data: {
      clerkId: userId,
      email,
      name,
      imageUrl,
    },
  });
}

/*
// grok code
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";


export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email is required");
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
  });

  return user;
} */