import { prisma } from '../src/database.js'

async function main() {
    await upsertSomeRecommendations();
}

async function upsertSomeRecommendations() {
    await prisma.recommendation.upsert({
        where: { id: 1 },
        update: {},
        create: { name: "Für Elise", youtubeLink: "https://www.youtube.com/watch?v=y0LfRlCHEV8", score: 500 }
    });
    await prisma.recommendation.upsert({
        where: { id: 2 },
        update: {},
        create: { name: "Toccata and Fugue", youtubeLink: "https://youtu.be/PyMz0w2UC9s", score: 12039812 }
    });
    await prisma.recommendation.upsert({
        where: { id: 3 },
        update: {},
        create: { name: "Eu volto, Maria", youtubeLink: "https://youtu.be/BnAkj9zyE7U", score: 1944 }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })