import { hashSync } from 'bcrypt'

import { prisma } from './prisma-client'

import type { User } from '@prisma/client'

const up = async () => {
  // Создание пользователей
  const createUsers = async () => {
    return await prisma.user.createMany({
      data: [
        {
          email: 'dima@gmail.com',
          username: 'dima',
          password: hashSync('111111', 10),
          isActivated: true
        },
        {
          email: 'ivan@gmail.com',
          username: 'ivan',
          password: hashSync('111111', 10),
          isActivated: true
        },
        {
          email: 'petr@gmail.com',
          username: 'petr',
          password: hashSync('111111', 10),
          isActivated: true
        }
      ],
      skipDuplicates: true
    })
  }

  // Получение пользователей
  const getUsers = async () => {
    return await prisma.user.findMany({
      where: {
        email: { in: ['dima@gmail.com', 'ivan@gmail.com', 'petr@gmail.com'] }
      }
    })
  }

  // Создание профилей
  const createProfiles = async (users: User[]) => {
    const profilesData = [
      {
        fullName: 'Dmitry Golovichkin',
        userId: users.find((u) => u.email === 'dima@gmail.com')?.id
      },
      {
        fullName: 'Ivan Ivanov',
        userId: users.find((u) => u.email === 'ivan@gmail.com')?.id
      },
      {
        fullName: 'Petr Petrov',
        userId: users.find((u) => u.email === 'petr@gmail.com')?.id
      }
    ]

    const validProfiles = profilesData.filter((p) => p.userId !== undefined)

    return await prisma.profile.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: validProfiles as any,
      skipDuplicates: true
    })
  }

  // Создание токенов
  const createTokens = async (users: { id: number }[]) => {
    const tokensData = users.map((user) => ({
      refreshToken: `token-for-user-${user.id}`,
      userId: user.id
    }))

    return await prisma.token.createMany({
      data: tokensData,
      skipDuplicates: true
    })
  }

  // Создание подписок
  const createSubscriptions = async (
    users: { id: number; email: string }[]
  ) => {
    const dima = users.find((u) => u.email === 'dima@gmail.com')
    const ivan = users.find((u) => u.email === 'ivan@gmail.com')
    const petr = users.find((u) => u.email === 'petr@gmail.com')
    if (!dima || !ivan || !petr) return

    const subs = [
      { userId: dima.id, followingId: ivan.id },
      { userId: dima.id, followingId: petr.id },
      { userId: ivan.id, followingId: petr.id },
      { userId: petr.id, followingId: dima.id }
    ]

    for (const sub of subs) {
      try {
        await prisma.subscription.create({ data: sub })
      } catch (e) {
        console.log(e)
      }
    }
  }

  // Создание постов
  const createPosts = async (users: User[]) => {
    const posts = await Promise.all(
      users.map((user, idx) =>
        prisma.post.create({
          data: {
            content: `Post content ${idx + 1}`,
            userId: user.id
          }
        })
      )
    )

    return posts
  }

  // Лайки для постов
  const createPostLikes = async (users: User[], posts: { id: number }[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const likes: any[] = []

    for (const user of users) {
      for (const post of posts) {
        if (Math.random() < 0.5) {
          likes.push({ userId: user.id, postId: post.id })
        }
      }
    }

    await prisma.postLike.createMany({
      data: likes,
      skipDuplicates: true
    })
  }

  // Комментарии к постам
  const createPostComments = async (users: User[], posts: { id: number }[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comments: any[] = []

    for (const post of posts) {
      for (const user of users) {
        if (Math.random() < 0.7) {
          comments.push({
            userId: user.id,
            postId: post.id,
            content: `Nice post by user ${user.id}`
          })
        }
      }
    }

    await prisma.postComment.createMany({
      data: comments,
      skipDuplicates: true
    })
  }

  // Создание сообщений
  const createMessages = async (users: User[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = []

    for (const sender of users) {
      for (const receiver of users) {
        if (sender.id !== receiver.id) {
          messages.push({
            senderId: sender.id,
            receiverId: receiver.id,
            content: `Hi from user ${sender.id} to ${receiver.id}`
          })
        }
      }
    }

    const createdMessages = await Promise.all(
      messages.map((msg) => prisma.message.create({ data: msg }))
    )

    return createdMessages
  }

  // Выполнение всех функций
  await createUsers()
  const users = await getUsers()

  await createProfiles(users)
  await createTokens(users)
  await createSubscriptions(users)

  const posts = await createPosts(users)
  await createPostLikes(users, posts)
  await createPostComments(users, posts)

  const _messages = await createMessages(users)
}

const down = async () => {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tables) {
    // TRUNCATE отдельно для каждой таблицы
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`
    )
  }
}

const main = async () => {
  try {
    console.log('seed down...')
    await down()
    console.log('seed up...')
    await up()
  } catch (error) {
    console.error(error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
