"use server";

import prisma from "./db";
import { auth } from "@clerk/nextjs/server";
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from "./types";
import { redirect } from "next/navigation";
// import * as PM from "@prisma/client";
import dayjs from "dayjs";

function authenticateAndRedirect(): string {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }
  return userId;
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = authenticateAndRedirect();

  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,

        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

type DynamicWhereClause = {
  [key: string]: any;
};

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = authenticateAndRedirect();

  try {
    let whereClause: DynamicWhereClause = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }
    const skip = (page - 1) * limit;
    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    const count: number = await prisma.job.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(count / limit);

    return { jobs, count, page, totalPages };
  } catch (error) {
    console.error(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = authenticateAndRedirect();
  try {
    const deletedJob = await prisma.job.delete({
      where: {
        clerkId: userId,
        id,
      },
    });

    return deletedJob;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
  let job: JobType | null = null;
  const userId = authenticateAndRedirect();
  try {
    job = await prisma.job.findUnique({
      where: {
        clerkId: userId,
        id,
      },
    });
  } catch (error) {
    console.log(error);
    job = null;
  }

  if (!job) {
    redirect("/jobs");
  }
  return job;
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = authenticateAndRedirect();

  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.update({
      where: {
        clerkId: userId,
        id,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type JobStats = {
  status: string;
  _count: {
    status: number;
  };
};

export async function getStatsAction(): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> {
  const userId = authenticateAndRedirect();

  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId,
      },
    });
    const statsObject = stats.reduce(
      (acc: Record<string, number>, curr: JobStats) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
    return defaultStats;
  } catch (error) {
    console.log(error);
    redirect("/jobs");
  }
}

export async function getChartsDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const applicationsPerMonth = jobs.reduce(
      (acc: Array<{ date: string; count: number }>, job: JobType) => {
        const date = dayjs(job.createdAt).format("MMM YY");

        const existingEntry = acc.find((entry) => entry.date === date);

        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }

        return acc;
      },
      [] as Array<{ date: string; count: number }>
    );

    return applicationsPerMonth;
  } catch (error) {
    console.log(error);
    redirect("/jobs");
  }
}
